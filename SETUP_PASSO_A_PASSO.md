# 🚀 SETUP COMPLETO: CORREÇÃO VIP

## ⏱️ Tempo: ~30 minutos (primeira vez)

---

## PASSO 1: Instalar os Programas Base

### 1️⃣ Instalar Node.js (inclui npm)

1. Vai em https://nodejs.org/
2. Clica em **"LTS"** (a versão recomendada, mais estável)
3. Baixa e instala normalmente (next, next, finish)
4. Abre terminal/CMD e testa:

```bash
node --version
npm --version
```

Se aparecer versões (tipo `v20.10.0`), ✅ funcionou!

### 2️⃣ Instalar Git

1. Vai em https://git-scm.com/
2. Baixa e instala (default é ok)
3. Abre terminal/CMD e testa:

```bash
git --version
```

Se aparecer versão (tipo `git version 2.42.0`), ✅ funcionou!

---

## PASSO 2: Criar Contas Online

### 🔵 Supabase (Banco de Dados Grátis)

#### Por que Supabase?
- Banco PostgreSQL hospedado (você não precisa instalar nada)
- Grátis até 500 MB de dados
- Suporta até 500MB de storage
- Autenticação pronta

#### Como criar:

1. Va em https://supabase.com/
2. Clica em **"Get Started"**
3. Faz login com **GitHub** (ou email)
4. Clica em **"+ New project"**

   ![image](https://imgur.com/step1.png)

5. Preenche assim:
   - **Organization**: Deixa default
   - **Project name**: `correcao-vip`
   - **Database password**: Coloca uma senha forte (algo tipo: `Vivi@Correcao2024`)
   - **Region**: Brasil (São Paulo)

6. Clica em **"Create new project"** (vai demorar 1-2 minutos)

7. Quando acabar, entra no projeto e vai em **"Database"** (lado esquerdo)

8. Clica em **"Connection strings"**

9. Seleciona **URI** e copia tudo (começa com `postgresql://...`)

10. Coloca em um notepad seguro (vamos usar depois)

### 💚 WhatsApp Business

#### Por que WhatsApp Business?
- Integração oficial com Facebook/Meta
- Grátis até X mensagens (depois cobra bem pouco)
- Notificações automáticas pro aluno
- Aumenta engajamento

#### Como criar:

1. Va em https://www.whatsapp.com/business/
2. Clica em **"Get Started"**
3. Completa o cadastro (vai pedirr Email, Nome, etc)
4. Verifica seu email
5. Após aprovação, você recebe via email:
   - **Account ID** (tipo: `1234567890`)
   - **Phone ID** (tipo: `9876543210`)
   - **Access Token** (tipo: `EAABs...`)

6. Guarda isso também no notepad

---

## PASSO 3: Baixar o Projeto

### 1️⃣ Criar pasta do projeto

Abre terminal/CMD na pasta que quer guardar o projeto:

```bash
# No Windows, em C:\ ou Documentos
# No Mac, em ~/ (home)

mkdir meus-projetos
cd meus-projetos
```

### 2️⃣ Baixar o código

```bash
git clone https://github.com/seu-usuario/correcao-vip.git
cd correcao-vip
```

Isso vai baixar toda a estrutura pronta!

### 3️⃣ Instalar dependências

```bash
npm install
```

Vai demorar 2-3 minutos. É normal ver muito texto! Deixa rodar tranquilo.

---

## PASSO 4: Configurar Variáveis

### 1️⃣ Criar arquivo `.env.local`

Na pasta do projeto, cria um arquivo chamado `.env.local`

**⚠️ IMPORTANTE:** Este arquivo é **secreto**. Nunca faz upload pro GitHub!

### 2️⃣ Preencher com os dados

Abre `.env.local` com um editor (Notepad, VS Code, etc) e coloca:

```env
# ========== DATABASE ==========
DATABASE_URL="postgresql://seu_email:sua_senha@db.xxxxxx.supabase.co:5432/postgres"

# ========== WHATSAPP BUSINESS ==========
WHATSAPP_BUSINESS_ACCOUNT_ID="123456789"
WHATSAPP_BUSINESS_PHONE_ID="987654321"
WHATSAPP_BUSINESS_ACCESS_TOKEN="EAABs...sua_token_aqui"
WHATSAPP_PHONE="558899310114"

# ========== SEGURANÇA ==========
NEXTAUTH_SECRET="uma-senha-super-segura-aqui-coloca-qualquer-coisa-bem-longa-mesmo"
NEXTAUTH_URL="http://localhost:3000"

# ========== URLs ==========
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 3️⃣ Onde pegar cada coisa?

| Variável | Onde encontrar |
|----------|--------------|
| `DATABASE_URL` | Supabase → Project → Database → Connection Strings → URI |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Email do WhatsApp |
| `WHATSAPP_BUSINESS_PHONE_ID` | Email do WhatsApp |
| `WHATSAPP_BUSINESS_ACCESS_TOKEN` | Email do WhatsApp |
| `WHATSAPP_PHONE` | Seu número WhatsApp (com país) |
| `NEXTAUTH_SECRET` | Gera um valor aleatório bem longo |

---

## PASSO 5: Criar o Banco de Dados

No terminal, na pasta do projeto:

```bash
npx prisma migrate dev --name init
```

Vai aparecer umas coisas, aproveita e digita:

```
✔ Enter a name for this migration: » init
```

Pronto! Todas as tabelas foram criadas no Supabase! ✅

---

## PASSO 6: Rodar o Servidor Localmente

```bash
npm run dev
```

Quando acabar, você vê isso:

```
> ready started server on [::]:3000, url: http://localhost:3000
```

Agora **abre seu navegador** em:

```
http://localhost:3000
```

E você vê a tela de login! 🎉

---

## PASSO 7: Primeiro Acesso

### 1️⃣ Criar sua conta

Na tela de login, clica em **"Criar Conta"**

Preenche:
- Email: `vivi@correcaovip.com`
- Senha: `Senha123`
- Nome: `Vivi Isber`

Clica em **"Cadastrar"**

### 2️⃣ Fazer login

Volta pra tela de login e entra com:
- Email: `vivi@correcaovip.com`
- Senha: `Senha123`

Clica em **"Entrar"**

### 3️⃣ Voilà! 🎉

Você entra no dashboard! Vê seus stats, últimas correções, etc.

---

## PASSO 8: Testar Tudo

### Upload de Redação

1. Vai em **"Redações"**
2. Clica em **"+ Nova Redação"**
3. Faz upload de uma foto/PDF de uma redação
4. Clica em **"Enviar"**

### Corrigir Redação

1. Vai na redação que fez upload
2. Clica em **"Corrigir"**
3. Move os sliders das competências
4. **DESENHA** em cima (se for imagem)
5. Clica em **"Salvar Correção"**
6. Clica em **"Enviar WhatsApp"**

### Gerar PDF

1. Ainda na tela de correção
2. Clica em **"📄 Gerar PDF"**
3. Um PDF é baixado pro seu computador

---

## 🆘 ERROS COMUNS (e soluções)

### ❌ "npm: command not found"
**Solução:** Node.js não está instalado. Vai em nodejs.org, baixa e instala de novo.

### ❌ "DATABASE_URL inválida"
**Solução:** Você copiou errado do Supabase. Va em Supabase → Database → Connection strings → URI e copia TUDO.

### ❌ "Port 3000 already in use"
**Solução:** Outra coisa está usando a porta 3000. Roda assim:
```bash
npm run dev -- -p 3001
```
Agora entra em http://localhost:3001

### ❌ "WhatsApp não funciona"
**Solução:** Verifica se o token está certo em `.env.local`. Se não, copia do email do WhatsApp de novo.

### ❌ "Banco não criou tabelas"
**Solução:** Rode:
```bash
npx prisma migrate dev --name init
```
E se der erro, checa se `DATABASE_URL` está correto.

---

## 📊 Checklist de Setup

- [ ] Node.js instalado
- [ ] Git instalado
- [ ] Conta Supabase criada
- [ ] Projeto Supabase criado
- [ ] Connection String copiada
- [ ] WhatsApp Business criado
- [ ] Token do WhatsApp copiado
- [ ] Projeto clonado
- [ ] `npm install` rodado
- [ ] `.env.local` preenchido
- [ ] `npx prisma migrate dev` rodado
- [ ] `npm run dev` rodando
- [ ] Login funcionando em `http://localhost:3000`

---

## 🎯 Próximos Passos

Depois que tudo está rodando:

1. **Adicione seus alunos** em Configurações
2. **Crie turmas** (VIP 2024, etc)
3. **Inicie upload** de redações
4. **Comece a corrigir!** ✏️

---

**Dúvidas? É só chamar! Tamo junto nessa.** 💜
