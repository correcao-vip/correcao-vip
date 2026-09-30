# 🏗️ ARQUITETURA TÉCNICA - CORREÇÃO VIP

## 📋 VISÃO GERAL
- **Objetivo:** Plataforma de correção de redações com desenho manuscrito + WhatsApp
- **Prazo:** 4 semanas
- **Usuários:** Prof.ª Vivi + alunos VIP
- **Escala:** 200+ alunos, 2000+ redações/ano

---

## 🔧 TECH STACK

### Frontend
```
Next.js 14 (App Router)
React 18 + TypeScript
TailwindCSS 3
Canvas API (desenho com tablet)
HTML2PDF (jsPDF + html2canvas)
Socket.io (opcional para realtime)
```

### Backend
```
Next.js API Routes OU Express.js
Node.js 20+
TypeScript
Prisma ORM (migrations automáticas)
```

### Banco de Dados
```
PostgreSQL 15+
Prisma Client
Redis (cache opcional)
```

### Storage
```
DigitalOcean Spaces OU AWS S3
Multer (upload middleware)
Sharp (otimização de imagens)
```

### Integrações Externas
```
Twilio WhatsApp API (notificações)
Supabase (alternativa com auth pronta)
```

### Deploy
```
Vercel (Frontend)
Railway / Render (Backend - grátis/barato)
```

---

## 📊 SCHEMA DO BANCO DE DADOS

```sql
-- Users (Professor)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  type ENUM('teacher', 'admin') DEFAULT 'teacher',
  organization_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Students
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  teacher_id UUID NOT NULL REFERENCES users(id),
  group_id UUID REFERENCES groups(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Groups (Turmas)
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  teacher_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Themes (Temas de Redação)
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  content_type ENUM('TEXT', 'PDF', 'IMG') DEFAULT 'TEXT',
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Essays (Redações)
CREATE TABLE essays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id),
  teacher_id UUID REFERENCES users(id),
  theme_id UUID NOT NULL REFERENCES themes(id),
  group_id UUID REFERENCES groups(id),
  
  content_type ENUM('TEXT', 'IMG') NOT NULL,
  content_text TEXT,
  content_img_url VARCHAR(512),
  
  status ENUM('PENDING', 'CORRECTION', 'FINISHED', 'REVISION') DEFAULT 'PENDING',
  
  submitted_at TIMESTAMP NOT NULL,
  correction_started_at TIMESTAMP,
  correction_finished_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Corrections (Avaliações)
CREATE TABLE corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  essay_id UUID NOT NULL REFERENCES essays(id) UNIQUE,
  teacher_id UUID NOT NULL REFERENCES users(id),
  
  -- Competências ENEM (0-200)
  competencia_1 INTEGER CHECK (competencia_1 BETWEEN 0 AND 200),
  competencia_2 INTEGER CHECK (competencia_2 BETWEEN 0 AND 200),
  competencia_3 INTEGER CHECK (competencia_3 BETWEEN 0 AND 200),
  competencia_4 INTEGER CHECK (competencia_4 BETWEEN 0 AND 200),
  competencia_5 INTEGER CHECK (competencia_5 BETWEEN 0 AND 200),
  
  final_note INTEGER GENERATED ALWAYS AS (
    (competencia_1 + competencia_2 + competencia_3 + competencia_4 + competencia_5) / 5
  ) STORED,
  
  -- Anotações
  general_comments TEXT,
  drawing_data JSONB, -- canvas blob base64
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pre-comments (Pré-comentários)
CREATE TABLE pre_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES users(id),
  text VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indices de performance
CREATE INDEX idx_essays_student_id ON essays(student_id);
CREATE INDEX idx_essays_teacher_id ON essays(teacher_id);
CREATE INDEX idx_essays_status ON essays(status);
CREATE INDEX idx_corrections_essay_id ON corrections(essay_id);
CREATE INDEX idx_corrections_teacher_id ON corrections(teacher_id);
```

---

## 🔌 API ENDPOINTS (RESTful)

### Auth
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/register
GET    /api/auth/me
```

### Students
```
GET    /api/students
GET    /api/students/:id
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id
```

### Themes
```
GET    /api/themes
POST   /api/themes
GET    /api/themes/:id
PUT    /api/themes/:id
DELETE /api/themes/:id
```

### Essays (Redações)
```
GET    /api/essays                    # listar com filtros
GET    /api/essays/:id
POST   /api/essays                    # upload nova redação
PUT    /api/essays/:id/status         # atualizar status
DELETE /api/essays/:id
```

### Corrections (Avaliações)
```
GET    /api/corrections/:essayId
POST   /api/corrections/:essayId      # salvar correção
PUT    /api/corrections/:essayId      # atualizar
GET    /api/corrections/:essayId/pdf  # gerar PDF
```

### Reports
```
GET    /api/reports/student/:studentId  # desempenho individual
GET    /api/reports/group/:groupId      # turma
GET    /api/reports/group/:groupId/export # PDF
```

### Pre-comments
```
GET    /api/pre-comments
POST   /api/pre-comments
DELETE /api/pre-comments/:id
```

### WhatsApp Webhook
```
POST   /api/whatsapp/webhook          # recebe mensagens Twilio
```

---

## 🎨 COMPONENTES PRINCIPAIS (Frontend)

```
/app
├── (auth)
│   ├── login
│   └── register
├── (dashboard)
│   ├── page.tsx              # Dashboard principal
│   ├── essays
│   │   └── [id]
│   │       └── correction.tsx # PAINEL PRINCIPAL
│   ├── reports
│   │   └── page.tsx
│   └── settings
├── api
│   ├── auth
│   ├── essays
│   ├── corrections
│   ├── reports
│   └── whatsapp
├── components
│   ├── CorrectionPanel.tsx
│   ├── CanvasDrawer.tsx          # Desenho em cima de imagem
│   ├── CompetenciaSlider.tsx
│   ├── PreComments.tsx
│   ├── EssayViewer.tsx
│   ├── PDFExport.tsx
│   └── WhatsAppStatus.tsx
├── lib
│   ├── api.ts
│   ├── prisma.ts
│   ├── whatsapp.ts
│   ├── pdf.ts
│   └── storage.ts
└── styles
    └── globals.css
```

---

## 🎯 ROADMAP 4 SEMANAS

### **SEMANA 1: Setup + DB + Auth**
- [ ] Repositório Git configurado
- [ ] Next.js 14 setup (TypeScript + TailwindCSS)
- [ ] Prisma + PostgreSQL setup
- [ ] Schema do banco pronto
- [ ] Autenticação (JWT ou NextAuth)
- [ ] Login/Logout funcionando

**Entregável:** Professora consegue fazer login

---

### **SEMANA 2: Upload + Painel Básico**
- [ ] Sistema de upload (Multer + DigitalOcean)
- [ ] CRUD de Temas
- [ ] CRUD de Alunos
- [ ] Listar redações (dashboard)
- [ ] Painel de correção básico (sem desenho)
- [ ] Sliders de competência funcionando
- [ ] Salvar correção no banco

**Entregável:** Consegue fazer upload, acessar painel e salvar nota

---

### **SEMANA 3: Desenho + PDF + WhatsApp**
- [ ] Canvas para desenho (tablet pen support)
- [ ] Salvar desenhos no banco (base64)
- [ ] Geração de PDF com anotações
- [ ] Integração Twilio WhatsApp
- [ ] Webhook WhatsApp (receber/enviar)
- [ ] Notificar aluno quando redação corrigida
- [ ] Testar fluxo completo

**Entregável:** Corrige redação, desenha, salva e envia no WhatsApp

---

### **SEMANA 4: Reports + Polishes + Deploy**
- [ ] Relatórios desempenho individual
- [ ] Relatórios por turma
- [ ] Exportar relatórios em PDF
- [ ] Histórico do aluno
- [ ] Pré-comentários CRUD
- [ ] UI refinement
- [ ] Testes
- [ ] Deploy (Vercel + Railway)
- [ ] Documentação

**Entregável:** Plataforma completa pronta pra usar

---

## 🎯 CANVAS COM TABLET PEN SUPPORT

```typescript
// lib/canvas-drawer.ts
export class CanvasDrawer {
  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d')!;
    this.setupPointerEvents(); // Tablet pen support
  }

  setupPointerEvents() {
    // Suporta stylus/caneta de tablet
    this.canvas.addEventListener('pointerdown', this.startDrawing);
    this.canvas.addEventListener('pointermove', this.draw);
    this.canvas.addEventListener('pointerup', this.stopDrawing);
    
    // Pressão da caneta
    this.canvas.addEventListener('pointermove', (e: PointerEvent) => {
      this.pressure = e.pressure; // 0-1
      this.setLineWidth(2 + this.pressure * 8); // 2-10px
    });
  }

  draw(e: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  exportBase64(): string {
    return this.canvas.toDataURL('image/png');
  }
}
```

---

## 📱 WHATSAPP INTEGRATION (Twilio)

```typescript
// lib/whatsapp.ts
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendWhatsAppNotification(
  phoneNumber: string,
  studentName: string,
  essayTheme: string,
  finalNote: number
) {
  await client.messages.create({
    body: `Olá ${studentName}! Sua redação sobre "${essayTheme}" foi corrigida! Nota: ${finalNote}. Acesse a plataforma para ver os comentários.`,
    from: `whatsapp:+${process.env.TWILIO_PHONE}`,
    to: `whatsapp:+55${phoneNumber}`
  });
}

// Webhook para receber mensagens
export function handleWhatsAppWebhook(req: NextRequest) {
  const { From, Body } = req.body;
  // Implementar lógica de resposta automática
}
```

---

## 📄 PDF EXPORT

```typescript
// lib/pdf.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateCorrectionPDF(
  essay: Essay,
  correction: Correction,
  drawingBase64: string
) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Cabeçalho
  pdf.setFontSize(16);
  pdf.text('Correção de Redação VIP', 20, 20);
  
  pdf.setFontSize(10);
  pdf.text(`Aluno: ${essay.student.name}`, 20, 30);
  pdf.text(`Tema: ${essay.theme.title}`, 20, 40);
  pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 50);

  // Competências
  pdf.setFontSize(12);
  pdf.text('Competências ENEM', 20, 65);
  
  let y = 75;
  const competencias = [
    `1. Domínio da modalidade: ${correction.competencia_1}`,
    `2. Compreensão da proposta: ${correction.competencia_2}`,
    `3. Seleção de informações: ${correction.competencia_3}`,
    `4. Mecanismos linguísticos: ${correction.competencia_4}`,
    `5. Proposta de intervenção: ${correction.competencia_5}`
  ];
  
  competencias.forEach((comp) => {
    pdf.text(comp, 20, y);
    y += 10;
  });

  // Nota final
  pdf.setFontSize(14);
  pdf.setTextColor(107, 53, 168); // Roxo VIP
  pdf.text(`Nota Final: ${correction.final_note}`, 20, y + 10);

  // Desenho (anotações)
  if (drawingBase64) {
    pdf.addImage(drawingBase64, 'PNG', 20, y + 25, 170, 100);
  }

  // Comentários gerais
  if (correction.general_comments) {
    pdf.text('Comentários do Professor:', 20, y + 135);
    const wrappedText = pdf.splitTextToSize(correction.general_comments, 170);
    pdf.text(wrappedText, 20, y + 145);
  }

  pdf.save(`Correcao_${essay.student.name}.pdf`);
}
```

---

## 🚀 COMO COMEÇAR

### 1. Clone/Setup Inicial
```bash
npx create-next-app@latest correcao-vip --typescript --tailwind
cd correcao-vip
npm install
```

### 2. Instale dependências
```bash
npm install @prisma/client prisma dotenv
npm install twilio jspdf html2canvas sharp multer
npm install next-auth jsonwebtoken bcryptjs
npm install -D typescript @types/node @types/react
```

### 3. Setup Prisma
```bash
npx prisma init
# Configure .env com DATABASE_URL (PostgreSQL)
npx prisma migrate dev --name init
```

### 4. Variáveis de Ambiente (.env.local)
```
DATABASE_URL=postgresql://user:password@localhost:5432/correcao_vip
NEXTAUTH_SECRET=seu_secret_aqui
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_PHONE=+5588999999999
STORAGE_KEY=seu_digitalocean_key
STORAGE_SECRET=seu_digitalocean_secret
STORAGE_ENDPOINT=seu_digitalocean_endpoint
```

---

## ⚡ PERFORMANCE & OTIMIZAÇÕES

- Image optimization com Next.js `<Image>`
- Lazy loading em listas
- Infinite scroll nos essays
- Cache Redis para relatórios
- Compression em PDFs grandes
- Service Worker para offline

---

## 🔒 SEGURANÇA

- Rate limiting na API
- CSRF protection
- JWT tokens (exp 24h)
- Hash de senhas (bcryptjs)
- SQL injection prevention (Prisma)
- Upload validation (mime types, size)
- Autenticação WhatsApp (verify Twilio signatures)

---

## 📝 PRÓXIMOS PASSOS

1. **Confirmar tech stack** - Quer adicionar/remover algo?
2. **Configurar banco PostgreSQL** - Local ou Supabase?
3. **Criar repositório** - GitHub/GitLab?
4. **Definir prioridades** - O que é MVP vs. nice-to-have?
5. **Começar Semana 1** - Quem vai codificar?

---

## 💡 NOTAS IMPORTANTES

- **Não usar SQLite** - PostgreSQL é obrigatório pra escala 2000+ redações
- **DigitalOcean Spaces** - Mais barato que S3 pra armazenar imagens
- **Twilio** - Mais confiável que WhatsApp Web (que pode bloquear)
- **Vercel** - Deploy grátis/cheap pro Next.js
- **Semana 1 crítica** - Se não terminar auth + DB, atrasa tudo
