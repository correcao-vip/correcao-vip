# 🔌 EXEMPLOS DE API ENDPOINTS - CORREÇÃO VIP

## Setup Inicial

```typescript
// app/api/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## 📝 ESSAYS - UPLOAD & LISTAGEM

### Upload de Redação

```typescript
// app/api/essays/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/app/api/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const studentId = formData.get('studentId') as string;
    const themeId = formData.get('themeId') as string;
    const contentType = formData.get('contentType') as string; // TEXT ou IMG

    if (!file || !studentId || !themeId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Validação de arquivo
    const allowedMimes = ['image/jpeg', 'image/png', 'text/plain'];
    if (!allowedMimes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido' },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande (máx 10MB)' },
        { status: 400 }
      );
    }

    // Salva arquivo localmente (ou suba pra DigitalOcean)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const filename = `${Date.now()}-${file.name}`;
    const filepath = join(process.cwd(), 'public/uploads', filename);
    
    await writeFile(filepath, buffer);

    // Cria record no banco
    const essay = await prisma.essay.create({
      data: {
        studentId,
        themeId,
        contentType: contentType as any,
        contentImgUrl: `/uploads/${filename}`, // ou URL DigitalOcean
        status: 'PENDING',
      },
      include: {
        student: true,
        theme: true,
      },
    });

    return NextResponse.json(essay, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer upload' },
      { status: 500 }
    );
  }
}
```

### Listar Redações

```typescript
// app/api/essays/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/api/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const teacherId = req.headers.get('x-teacher-id');
    const status = req.nextUrl.searchParams.get('status');
    const groupId = req.nextUrl.searchParams.get('groupId');
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20');

    if (!teacherId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const skip = (page - 1) * limit;

    // Build filter
    const where: any = {
      OR: [
        { teacherId },
        { student: { teacherId } },
      ],
    };

    if (status) {
      where.status = status;
    }

    if (groupId) {
      where.groupId = groupId;
    }

    const essays = await prisma.essay.findMany({
      where,
      include: {
        student: true,
        theme: true,
        correction: true,
      },
      orderBy: { submittedAt: 'desc' },
      skip,
      take: limit,
    });

    const total = await prisma.essay.count({ where });

    return NextResponse.json({
      data: essays,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar redações' },
      { status: 500 }
    );
  }
}
```

---

## ⭐ CORRECTIONS - SALVAR AVALIAÇÃO

### Salvar/Atualizar Correção

```typescript
// app/api/corrections/[essayId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/api/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { essayId: string } }
) {
  try {
    const teacherId = req.headers.get('x-teacher-id');
    const {
      competencia1,
      competencia2,
      competencia3,
      competencia4,
      competencia5,
      generalComments,
      drawingUrl,
    } = await req.json();

    if (!teacherId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Calcula nota final
    const finalNote = Math.round(
      (competencia1 + competencia2 + competencia3 + competencia4 + competencia5) / 5
    );

    // Verifica se essay existe
    const essay = await prisma.essay.findUnique({
      where: { id: params.essayId },
    });

    if (!essay) {
      return NextResponse.json({ error: 'Redação não encontrada' }, { status: 404 });
    }

    // Cria ou atualiza correção
    const correction = await prisma.correction.upsert({
      where: { essayId: params.essayId },
      create: {
        essayId: params.essayId,
        teacherId,
        competencia1,
        competencia2,
        competencia3,
        competencia4,
        competencia5,
        finalNote,
        generalComments,
        drawingUrl,
        isFinished: true,
      },
      update: {
        competencia1,
        competencia2,
        competencia3,
        competencia4,
        competencia5,
        finalNote,
        generalComments,
        drawingUrl,
        isFinished: true,
        updatedAt: new Date(),
      },
      include: {
        essay: {
          include: {
            student: true,
          },
        },
      },
    });

    // Atualiza status do essay
    await prisma.essay.update({
      where: { id: params.essayId },
      data: {
        status: 'FINISHED',
        correctionFinishedAt: new Date(),
      },
    });

    // Dispara notificação WhatsApp (opcional)
    if (essay.student.phone) {
      // await sendWhatsAppNotification(correction, essay.student);
    }

    return NextResponse.json(correction, { status: 200 });
  } catch (error) {
    console.error('Correction error:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar correção' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { essayId: string } }
) {
  try {
    const correction = await prisma.correction.findUnique({
      where: { essayId: params.essayId },
      include: {
        essay: {
          include: {
            student: true,
            theme: true,
          },
        },
      },
    });

    if (!correction) {
      return NextResponse.json(
        { error: 'Correção não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(correction);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar correção' },
      { status: 500 }
    );
  }
}
```

---

## 📄 PDF - GERAR E BAIXAR

```typescript
// app/api/corrections/[essayId]/pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/api/lib/prisma';
import jsPDF from 'jspdf';

export async function GET(
  req: NextRequest,
  { params }: { params: { essayId: string } }
) {
  try {
    const correction = await prisma.correction.findUnique({
      where: { essayId: params.essayId },
      include: {
        essay: {
          include: {
            student: true,
            theme: true,
          },
        },
      },
    });

    if (!correction) {
      return NextResponse.json(
        { error: 'Correção não encontrada' },
        { status: 404 }
      );
    }

    // Gera PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Cabeçalho
    pdf.setFontSize(16);
    pdf.text('Correção de Redação - VIP Linguagens e Redação', 20, 20);

    pdf.setFontSize(10);
    pdf.text(`Aluno: ${correction.essay.student.name}`, 20, 30);
    pdf.text(`Tema: ${correction.essay.theme.title}`, 20, 40);
    pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 50);

    // Competências
    pdf.setFontSize(12);
    pdf.text('Avaliação por Competência ENEM:', 20, 65);

    let y = 75;
    const competencias = [
      `1. Domínio da modalidade escrita: ${correction.competencia1}`,
      `2. Compreensão da proposta: ${correction.competencia2}`,
      `3. Seleção e organização de informações: ${correction.competencia3}`,
      `4. Mecanismos linguísticos: ${correction.competencia4}`,
      `5. Proposta de intervenção: ${correction.competencia5}`,
    ];

    competencias.forEach((comp) => {
      pdf.text(comp, 20, y);
      y += 8;
    });

    // Nota final
    pdf.setFontSize(14);
    pdf.setTextColor(107, 53, 168); // Roxo VIP
    pdf.text(`Nota Final: ${correction.finalNote}`, 20, y + 5);

    // Comentários
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    if (correction.generalComments) {
      pdf.text('Comentários do Professor:', 20, y + 20);
      const wrappedText = pdf.splitTextToSize(correction.generalComments, 170);
      pdf.text(wrappedText, 20, y + 28);
    }

    // Gera buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Correcao_${correction.essay.student.name}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF error:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar PDF' },
      { status: 500 }
    );
  }
}
```

---

## 📊 REPORTS - DESEMPENHO DO ALUNO

```typescript
// app/api/reports/student/[studentId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/api/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const essays = await prisma.essay.findMany({
      where: { studentId: params.studentId },
      include: {
        correction: true,
        theme: true,
      },
      orderBy: { submittedAt: 'asc' },
    });

    if (essays.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma redação encontrada' },
        { status: 404 }
      );
    }

    // Calcula estatísticas
    const corrections = essays
      .map((e) => e.correction)
      .filter((c): c is any => c !== null);

    const stats = {
      totalEssays: essays.length,
      finishedEssays: corrections.length,
      averageNote:
        corrections.length > 0
          ? Math.round(
              corrections.reduce((sum, c) => sum + c.finalNote, 0) /
                corrections.length
            )
          : 0,
      competencyAverages: {
        comp1:
          corrections.length > 0
            ? Math.round(
                corrections.reduce((sum, c) => sum + c.competencia1, 0) /
                  corrections.length
              )
            : 0,
        comp2:
          corrections.length > 0
            ? Math.round(
                corrections.reduce((sum, c) => sum + c.competencia2, 0) /
                  corrections.length
              )
            : 0,
        comp3:
          corrections.length > 0
            ? Math.round(
                corrections.reduce((sum, c) => sum + c.competencia3, 0) /
                  corrections.length
              )
            : 0,
        comp4:
          corrections.length > 0
            ? Math.round(
                corrections.reduce((sum, c) => sum + c.competencia4, 0) /
                  corrections.length
              )
            : 0,
        comp5:
          corrections.length > 0
            ? Math.round(
                corrections.reduce((sum, c) => sum + c.competencia5, 0) /
                  corrections.length
              )
            : 0,
      },
    };

    // Evolução temporal
    const evolution = essays.map((e) => ({
      date: e.submittedAt,
      note: e.correction?.finalNote || 0,
      theme: e.theme.title,
    }));

    return NextResponse.json({
      stats,
      evolution,
      essays: essays.map((e) => ({
        id: e.id,
        theme: e.theme.title,
        submitted: e.submittedAt,
        status: e.status,
        note: e.correction?.finalNote,
      })),
    });
  } catch (error) {
    console.error('Report error:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar relatório' },
      { status: 500 }
    );
  }
}
```

---

## 💬 PRÉ-COMENTÁRIOS - CRUD

```typescript
// app/api/pre-comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/api/lib/prisma';

// Listar
export async function GET(req: NextRequest) {
  try {
    const teacherId = req.headers.get('x-teacher-id');

    if (!teacherId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const comments = await prisma.preComment.findMany({
      where: { teacherId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar comentários' },
      { status: 500 }
    );
  }
}

// Criar
export async function POST(req: NextRequest) {
  try {
    const teacherId = req.headers.get('x-teacher-id');
    const { text, category } = await req.json();

    if (!teacherId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (!text || text.length > 500) {
      return NextResponse.json(
        { error: 'Texto inválido (máx 500 caracteres)' },
        { status: 400 }
      );
    }

    const comment = await prisma.preComment.create({
      data: {
        teacherId,
        text,
        category,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Create error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar comentário' },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/pre-comments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/api/lib/prisma';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teacherId = req.headers.get('x-teacher-id');

    if (!teacherId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await prisma.preComment.delete({
      where: { 
        id: params.id,
        teacherId, // Garante que é do professor autenticado
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar comentário' },
      { status: 500 }
    );
  }
}
```

---

## 🔔 WHATSAPP - NOTIFICAÇÃO

```typescript
// lib/whatsapp.ts
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsAppNotification(
  phoneNumber: string,
  studentName: string,
  essayTheme: string,
  finalNote: number,
  pdfUrl?: string
) {
  try {
    const message = await client.messages.create({
      body: `Olá ${studentName}! 🎉 Sua redação sobre "${essayTheme}" foi corrigida! Nota: ${finalNote}. Acesse a plataforma para ver os comentários completos e suas anotações.`,
      from: `whatsapp:+${process.env.TWILIO_PHONE}`,
      to: `whatsapp:+55${phoneNumber}`,
    });

    console.log('WhatsApp sent:', message.sid);
    return message.sid;
  } catch (error) {
    console.error('WhatsApp error:', error);
    throw error;
  }
}

export async function handleWhatsAppWebhook(body: any) {
  const { From, Body } = body;
  
  // Implementar lógica de resposta automática
  // Exemplo: "Olá! Acesse https://correcaovip.com para ver sua redação"
  
  const reply = await client.messages.create({
    body: 'Obrigada pela mensagem! Acesse https://correcaovip.com para acompanhar suas redações.',
    from: `whatsapp:+${process.env.TWILIO_PHONE}`,
    to: From,
  });

  return reply.sid;
}
```

---

## 🚀 COMO USAR ESSES ENDPOINTS

### 1. Criar autenticação middleware
```typescript
// app/api/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  // Implementar verificação JWT
  // const teacherId = verifyJWT(token);
  
  // Adicionar ao header para uso nos endpoints
  // request.headers.set('x-teacher-id', teacherId);

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
```

### 2. Usar no Frontend
```typescript
// app/lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function uploadEssay(
  studentId: string,
  themeId: string,
  file: File,
  contentType: 'TEXT' | 'IMG'
) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('studentId', studentId);
  formData.append('themeId', themeId);
  formData.append('contentType', contentType);

  const res = await fetch(`${API_BASE}/essays/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
}

export async function saveCorrection(
  essayId: string,
  correction: {
    competencia1: number;
    competencia2: number;
    competencia3: number;
    competencia4: number;
    competencia5: number;
    generalComments: string;
    drawingUrl?: string;
  }
) {
  const res = await fetch(`${API_BASE}/corrections/${essayId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(correction),
  });

  return res.json();
}
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Setup Prisma + PostgreSQL
- [ ] Configurar variáveis de ambiente
- [ ] Executar `npx prisma migrate dev`
- [ ] Implementar autenticação
- [ ] Implementar upload de redações
- [ ] Implementar painel de correção
- [ ] Integrar WhatsApp Twilio
- [ ] Implementar geração de PDF
- [ ] Implementar relatórios
- [ ] Testes E2E
- [ ] Deploy

