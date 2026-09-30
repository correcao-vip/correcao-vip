# 🚀 Como Subir pro GitHub (First Push)

## PASSO 1: Criar Repositório no GitHub

1. Va em https://github.com/new
2. Preenche assim:
   - **Repository name:** `correcao-vip`
   - **Description:** "Plataforma de correção de redações ENEM com desenho e WhatsApp"
   - **Public** (pra você ver código, ou **Private** se quer oculto)
   - ✅ Clica em "Add a README file" (NÃO clica)
   - ✅ Seleciona ".gitignore" → Node
   - ✅ Seleciona "License" → MIT

3. Clica em **"Create repository"**

Pronto! Seu repositório foi criado.

---

## PASSO 2: Copiar URL do Repositório

Na página do repositório que acabou de criar, clica em **"Code"** (botão verde):

```
https://github.com/seu-usuario/correcao-vip.git
```

Copia essa URL (você vai usar no terminal)

---

## PASSO 3: Terminal - Configurar Git Localmente

Abre terminal/CMD na pasta do seu projeto:

### 3.1 Inicializar Git

```bash
git init
```

Isso vai criar uma pasta `.git` (invisível).

### 3.2 Adicionar Remote (Conectar ao GitHub)

```bash
git remote add origin https://github.com/seu-usuario/correcao-vip.git
```

Substitui `seu-usuario` pelo seu usuário GitHub!

### 3.3 Verificar que conectou

```bash
git remote -v
```

Tem que aparecer:
```
origin  https://github.com/seu-usuario/correcao-vip.git (fetch)
origin  https://github.com/seu-usuario/correcao-vip.git (push)
```

---

## PASSO 4: Adicionar Tudo ao Git (Stage)

```bash
git add .
```

Isso "marca" todos os arquivos pra fazer upload.

Verifica o que vai subir:
```bash
git status
```

Tem que aparecer verde todos os arquivos.

---

## PASSO 5: Fazer Commit (Salvar Versão)

```bash
git commit -m "Initial commit: Setup Correção VIP"
```

Isso cria uma "versão" do seu código.

---

## PASSO 6: Upload (Push) pro GitHub

```bash
git branch -M main
git push -u origin main
```

A primeira vez, pode pedir seu **GitHub token** (tipo uma senha):

1. Abre https://github.com/settings/tokens/new
2. Clica em "Generate new token (classic)"
3. Deixa tudo default, só clica "Generate"
4. Copia o token (aparece só uma vez!)
5. Cola no terminal quando pedir "password"

---

## PASSO 7: Pronto! ✅

Refresh a página do GitHub e seu código está lá!

```
https://github.com/seu-usuario/correcao-vip
```

---

## 📝 Resumão dos Comandos

```bash
# Primeira vez (setup):
git init
git remote add origin https://github.com/seu-usuario/correcao-vip.git
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main

# Próximas vezes (você fez mudanças):
git add .
git commit -m "Descrição do que mudou"
git push
```

---

## 🔐 .gitignore Automático

O arquivo `.gitignore` que criei já tá configurado pra:
- ❌ NÃO fazer upload de `.env.local` (senhas!)
- ❌ NÃO fazer upload de `node_modules/`
- ❌ NÃO fazer upload de `.next/` (arquivos gerados)

Então é seguro fazer `git add .` — as coisas secretas não vão subir.

---

## ✨ Estrutura que Vai pro GitHub

```
correcao-vip/
├── app/
├── prisma/
├── public/
├── .gitignore           ← Já tá pronto!
├── package.json
├── tsconfig.json
├── README.md            ← README_GITHUB.md (renomeia pra README.md)
├── SETUP_PASSO_A_PASSO.md
├── CORRECAO_VIP_README.md
├── ARQUIVOS_CRIADOS.md
└── [node_modules/]      ← NÃO vai (porque .gitignore)
└── [.env.local]         ← NÃO vai (porque .gitignore)
```

---

## 📊 Checklist

- [ ] Criei repositório no GitHub
- [ ] Copiei URL do repositório
- [ ] Rodei `git init`
- [ ] Rodei `git remote add origin ...`
- [ ] Rodei `git add .`
- [ ] Rodei `git commit -m "Initial commit"`
- [ ] Rodei `git push -u origin main`
- [ ] Vi o código no GitHub!

---

## 🎯 Pronto Pro Deploy

Agora que tá no GitHub:

### Se quiser Deploy Automático (Recomendado)

1. Va em https://vercel.com
2. Clica "New Project"
3. Conecta GitHub
4. Seleciona `correcao-vip`
5. Vercel faz deploy automaticamente! 🚀

Toda vez que você faz `git push`, Vercel atualiza automaticamente.

---

**Bora lá! Seu código vai tá seguro no GitHub agora! 💜**
