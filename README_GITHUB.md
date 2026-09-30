# 📝 Correção VIP

> Plataforma inteligente de correção de redações ENEM com desenho em tempo real, WhatsApp integrado e PDF automático.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)

---

## 🎯 Sobre o Projeto

Plataforma customizada para Prof.ª Vivi Isber (VIP Linguagens e Redação) avaliar redações ENEM de seus alunos com:

✅ **Painel de Correção** - Avalie as 5 competências ENEM (0-200 cada)  
✅ **Desenho em Cima** - Caneta de tablet + correções manuscritas  
✅ **WhatsApp Integrado** - Notifique alunos automaticamente  
✅ **PDF Automático** - Gere relatórios com anotações  
✅ **Relatórios** - Dashboard com desempenho dos alunos  

---

## 🚀 Quick Start (5 minutos)

### 1. Pré-requisitos

Instale:
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)

### 2. Clone e Setup

```bash
git clone https://github.com/seu-usuario/correcao-vip.git
cd correcao-vip
npm install
```

### 3. Configure Variáveis

Crie arquivo `.env.local`:

```env
DATABASE_URL="postgresql://seu_usuario:senha@db.supabase.co:5432/postgres"
WHATSAPP_BUSINESS_ACCOUNT_ID="123456789"
WHATSAPP_BUSINESS_PHONE_ID="987654321"
WHATSAPP_BUSINESS_ACCESS_TOKEN="seu_token"
WHATSAPP_PHONE="558899310114"
NEXTAUTH_SECRET="uma-senha-aleatoria-bem-longa"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 4. Criar Banco

```bash
npx prisma migrate dev --name init
```

### 5. Rodar Localmente

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) 🎉

---

## 📚 Documentação Completa

- 📖 [README Detalhado](./CORRECAO_VIP_README.md) - O que é e como funciona
- 🛠️ [Setup Passo a Passo](./SETUP_PASSO_A_PASSO.md) - Instalação completa
- 📦 [Arquivos Criados](./ARQUIVOS_CRIADOS.md) - Estrutura do projeto

---

## 🎨 Fluxo de Uso

```
VOCÊ (Professora)                  ALUNO
       │                            │
       ├─→ Login                    ├─→ Faz upload
       │                            │
       ├─→ Vê redações pendentes    │
       │                            │
       ├─→ Abre uma redação    ←─────┘
       │
       ├─→ Desenha em cima
       │   (caneta tablet)
       │
       ├─→ Avalia 5 competências
       │
       ├─→ Salva correção
       │
       ├─→ Clica "Enviar WhatsApp"
       │
       └─→ Aluno recebe PDF! ←─────┘
```

---

## 📁 Estrutura

```
correcao-vip/
├── app/                        # Toda lógica Next.js
│   ├── (auth)/                 # Login/Register
│   ├── dashboard/              # Painel principal
│   │   ├── essays/             # Redações
│   │   │   └── [id]/           # ← PAINEL DE CORREÇÃO (aqui desenha!)
│   │   ├── reports/            # Relatórios
│   │   └── settings/           # Configurações
│   ├── api/                    # Endpoints
│   │   ├── auth/               # Autenticação
│   │   ├── essays/             # Redações
│   │   ├── corrections/        # Correções
│   │   ├── whatsapp/           # WhatsApp
│   │   └── pdf/                # PDF
│   └── components/             # React components
│       ├── CanvasDrawer.tsx    # ← Desenho com tablet
│       └── CompetenciaSlider.tsx
│
├── prisma/
│   └── schema.prisma           # Banco de dados
│
├── public/                     # Assets estáticos
│
├── package.json                # Dependências
├── tsconfig.json               # Config TypeScript
├── tailwind.config.js          # Config Tailwind
│
├── README.md                   # Este arquivo
├── SETUP_PASSO_A_PASSO.md     # Setup detalhado
└── .env.local                  # ← NÃO faz commit!
```

---

## 🛠️ Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript, TailwindCSS |
| **Backend** | Next.js API Routes |
| **Banco** | PostgreSQL (Supabase) |
| **ORM** | Prisma |
| **Auth** | NextAuth.js |
| **Desenho** | Canvas API + Pointer Events |
| **PDF** | jsPDF + html2canvas |
| **WhatsApp** | WhatsApp Business API |
| **Storage** | DigitalOcean Spaces / AWS S3 |
| **Deploy** | Vercel (frontend) + Railway (backend) |

---

## 📊 Banco de Dados

Schema Prisma com 8 modelos:

```prisma
User                    // Professora
├─ Student              // Alunos
├─ Group                // Turmas
├─ Theme                // Temas de redação
├─ Essay                // Redações enviadas
├─ Correction           // Correções realizadas
├─ PreComment           // Comentários pré-salvos
└─ Notification         // Notificações WhatsApp
```

[Ver schema completo →](./prisma/schema.prisma)

---

## 🚀 Deploy

### Frontend (Vercel)

```bash
# 1. Push pra GitHub
git push origin main

# 2. Conecta no Vercel
# https://vercel.com/new
# Seleciona este repositório

# 3. Define variáveis em Settings > Environment Variables
# Copia os mesmos do .env.local
```

### Backend (Railway/Render)

```bash
# Railway: https://railway.app
# 1. Conecta GitHub
# 2. Seleciona repositório
# 3. Deploy automático!
```

---

## 🐛 Erros Comuns

### "DATABASE_URL inválida"
→ Copia da Supabase: Project → Database → Connection Strings → URI

### "npm command not found"
→ Node.js não está instalado. Baixa em nodejs.org

### "Port 3000 already in use"
→ Roda em outra porta: `npm run dev -- -p 3001`

### "WhatsApp não funciona"
→ Verifica token em `.env.local`. Tá correto?

---

## 📝 Roadmap (4 Semanas)

- **Semana 1:** Setup + Autenticação ✅
- **Semana 2:** Upload + Painel de Redações
- **Semana 3:** Desenho + PDF + WhatsApp
- **Semana 4:** Relatórios + Deploy

---

## 📞 Suporte

Dúvidas? Vai na documentação:
- [Setup Passo a Passo](./SETUP_PASSO_A_PASSO.md)
- [Arquivos Criados](./ARQUIVOS_CRIADOS.md)

---

## 📄 License

MIT - Use à vontade! 💜

---

<div align="center">

**Feito para Prof.ª Vivi Isber | VIP Linguagens e Redação**

Natal/RN 🇧🇷

[Instagram @vivisber](https://instagram.com/vivisber)

</div>
