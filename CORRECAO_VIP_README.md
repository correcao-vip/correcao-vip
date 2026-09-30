# 📝 CORREÇÃO VIP - Plataforma de Avaliação de Redações

Bem-vindo! Esta é a plataforma de correção de redações com desenho, WhatsApp e PDF reports.

---

## 🎯 O que é?

Um site onde **você** (professora) consegue:
- ✅ Receber redações dos alunos (texto ou foto)
- ✅ Avaliar as 5 competências ENEM
- ✅ **Desenhar em cima da redação** (com caneta de tablet)
- ✅ Adicionar comentários
- ✅ Gerar PDF com tudo
- ✅ Enviar tudo no WhatsApp pra o aluno automaticamente

---

## 🚀 COMEÇAR DO ZERO (Passo a Passo)

### 1️⃣ **Ter esses programas instalados** (grátis)

Você precisa ter instalado no computador:
- [Node.js](https://nodejs.org/) - É o "motor" que roda o projeto
- [Git](https://git-scm.com/) - Para baixar o código

### 2️⃣ **Criar conta em 2 serviços** (grátis no começo)

#### Supabase (Banco de Dados)
1. Entre em https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub (ou email)
4. Crie um novo projeto (dê um nome tipo "correcao-vip")
5. Copie a **Connection String** (vai aparecer na aba Database)
6. Guarde isso em um arquivo seguro

#### WhatsApp Business (Integração)
1. Entre em https://www.whatsapp.com/business/
2. Clique em "Get Started"
3. Complete o cadastro
4. Vai gerar um **API Token** (você recebe via email)
5. Guarde isso também

### 3️⃣ **Baixar o projeto**

Abra o terminal/CMD no seu computador e rode:

```bash
git clone https://github.com/seu-usuario/correcao-vip.git
cd correcao-vip
npm install
```

### 4️⃣ **Configurar variáveis** (coloca os segredos aqui)

Crie um arquivo chamado `.env.local` na raiz do projeto com:

```
# Banco de Dados (Supabase)
DATABASE_URL=postgresql://seu_usuario:sua_senha@db.xxxx.supabase.co:5432/postgres

# WhatsApp Business
WHATSAPP_BUSINESS_ACCOUNT_ID=seu_account_id
WHATSAPP_BUSINESS_PHONE_ID=seu_phone_id
WHATSAPP_BUSINESS_ACCESS_TOKEN=seu_token

# Seu número de WhatsApp
WHATSAPP_PHONE=558899310114

# Senhas do sistema
NEXTAUTH_SECRET=uma-senha-aleatoria-bem-comprida-aqui-12345

# URLs
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 5️⃣ **Criar o banco de dados**

```bash
npx prisma migrate dev --name init
```

Isso vai criar todas as tabelas no Supabase automaticamente.

### 6️⃣ **Rodar o site localmente**

```bash
npm run dev
```

Agora abra http://localhost:3000 no navegador! 🎉

---

## 📁 Estrutura de Pastas (o que cada uma faz)

```
correcao-vip/
│
├── app/                          # ← Toda a lógica do site fica aqui
│   ├── (auth)/                   # Páginas de login
│   │   ├── login/page.tsx        # Tela de fazer login
│   │   └── register/page.tsx     # Tela de criar conta
│   │
│   ├── dashboard/                # Área privada (após login)
│   │   ├── page.tsx              # Dashboard - visão geral
│   │   ├── essays/               # Redações
│   │   │   ├── page.tsx          # Listar redações
│   │   │   └── [id]/             # Página de CORREÇÃO (aqui que desenha!)
│   │   │       └── page.tsx
│   │   ├── reports/              # Relatórios/Desempenho
│   │   │   └── page.tsx
│   │   └── settings/             # Configurações
│   │       └── page.tsx
│   │
│   ├── api/                      # APIs (endpoints do servidor)
│   │   ├── auth/                 # Login/Logout
│   │   ├── essays/               # Upload de redações
│   │   ├── corrections/          # Salvar correções
│   │   ├── reports/              # Gerar relatórios
│   │   ├── pdf/                  # Gerar PDF
│   │   └── whatsapp/             # Enviar mensagem WhatsApp
│   │
│   ├── components/               # Pedaços reutilizáveis (botões, cards, etc)
│   │   ├── CanvasDrawer.tsx      # ← Aqui é o desenho! Tablet pen
│   │   ├── CompetenciaSlider.tsx # Sliders das competências
│   │   ├── PDFExport.tsx         # Gera PDF
│   │   └── ...
│   │
│   └── layout.tsx                # Layout geral (navbar, sidebar)
│
├── lib/                          # Funções utilitárias
│   ├── prisma.ts                 # Conexão com banco
│   ├── api.ts                    # Funções pra chamar API
│   ├── whatsapp.ts               # Funções do WhatsApp
│   └── pdf.ts                    # Funções de PDF
│
├── prisma/
│   └── schema.prisma             # ← Definição do banco de dados
│
├── public/
│   └── uploads/                  # Onde fica as imagens das redações
│
├── .env.local                    # ← SEGREDOS (não commit!)
├── package.json                  # Dependências do projeto
└── tsconfig.json                 # Configurações TypeScript
```

---

## 🎨 Fluxo de Uso (como funciona na prática)

### Para VOCÊ (Professora):

1. **Acessa o site:** `http://localhost:3000`
2. **Faz login** com seu email/senha
3. **Clica em "Redações"** → vê lista de redações pendentes
4. **Clica em uma redação** → abre o painel de correção
5. **Avalia as 5 competências** (move os sliders de 0 a 200)
6. **DESENHA em cima** da redação (se for imagem) - usa sua caneta de tablet!
7. **Adiciona comentários** gerais
8. **Clica "Salvar Correção"** → tudo salva no banco
9. **Clica "Enviar no WhatsApp"** → aluno recebe a nota + PDF no WhatsApp

### Para os ALUNOS:

1. **Fazem upload** de redação (foto ou texto)
2. **Veem status** em tempo real
3. **Recebem no WhatsApp** quando você termina
4. **Acessam o PDF** com todas as anotações

---

## 🔑 Chaves de Acesso (Guarda com cuidado!)

Essas coisas são **super secretas**. Nunca coloca no GitHub:

- `DATABASE_URL` - Acesso ao banco de dados
- `WHATSAPP_BUSINESS_ACCESS_TOKEN` - Token do WhatsApp
- `NEXTAUTH_SECRET` - Senha das sessões

Essas ficam no arquivo `.env.local` que fica **só no seu computador**.

---

## 📊 O Banco de Dados (Supabase)

O Supabase cria automaticamente essas tabelas:

| Tabela | O que guarda |
|--------|-------------|
| `users` | Seus dados (email, senha, nome) |
| `students` | Dados dos alunos |
| `essays` | As redações (arquivo + data) |
| `corrections` | As notas + comentários |
| `pre_comments` | Seus comentários salvos reutilizáveis |
| `groups` | Turmas (VIP 2026, etc) |
| `themes` | Temas das redações |

---

## 🚀 Próximos Passos (Semana 1)

- [ ] Instalar Node.js + Git
- [ ] Criar conta Supabase
- [ ] Criar conta WhatsApp Business
- [ ] Clonar este repositório
- [ ] Configurar `.env.local`
- [ ] Rodar `npm install`
- [ ] Rodar `npx prisma migrate dev`
- [ ] Testar login em http://localhost:3000

---

## 🆘 Erros Comuns

### "npm command not found"
→ Node.js não está instalado. Baixa em nodejs.org

### "DATABASE_URL inválida"
→ Copia errado do Supabase. Vai em https://supabase.com → Project → Database → Connection string

### "WhatsApp não funciona"
→ Checa se o token está certo em `.env.local`

### Porta 3000 já em uso
→ Fecha outras abas do navegador ou usa: `npm run dev -- -p 3001`

---

## 💬 Suporte

Qualquer dúvida durante o setup, é só chamar! Temos documentação pra tudo.

---

## 📝 Checklist Antes de Usar

- [ ] Node.js instalado
- [ ] Git instalado
- [ ] Conta Supabase criada
- [ ] WhatsApp Business vinculado
- [ ] `.env.local` preenchido
- [ ] `npm install` rodado
- [ ] Banco criado (`npx prisma migrate dev`)
- [ ] Site abrindo em `http://localhost:3000`

---

**Pronto! Vamo lá! 🚀**

Qualquer coisa, era só mandar mensagem. A plataforma vai estar lindinha e pronta pra você usar.
