# 🚀 Guia de Deploy - Vercel

## Pré-requisitos
- Conta na Vercel (gratuita)
- Projeto no GitHub/GitLab/Bitbucket (recomendado)

## Opção 1: Deploy via GitHub (Recomendado)

### 1. Preparar o Repositório
```bash
# Se ainda não tem um repositório Git
git init
git add .
git commit -m "Initial commit - Central de Dashboards"

# Criar repositório no GitHub e fazer push
git remote add origin https://github.com/seu-usuario/nome-do-repo.git
git push -u origin main
```

### 2. Conectar na Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta
3. Clique em **"New Project"**
4. Conecte sua conta do GitHub
5. Selecione o repositório do projeto
6. Clique em **"Import"**

### 3. Configurar o Projeto
A Vercel detectará automaticamente que é um projeto Vite. As configurações já estão no `vercel.json`:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Deploy
1. Clique em **"Deploy"**
2. Aguarde o build (2-3 minutos)
3. Seu site estará disponível em: `https://seu-projeto.vercel.app`

## Opção 2: Deploy Manual (Upload)

### 1. Fazer o Build
```bash
npm run build
```

### 2. Fazer Upload
1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"New Project"**
3. Escolha **"Upload"**
4. Arraste a pasta `dist` para o upload
5. Clique em **"Deploy"**

## Configurações Importantes

### Variáveis de Ambiente (se necessário)
Se precisar de variáveis de ambiente:
1. Vá para **Settings** > **Environment Variables**
2. Adicione as variáveis necessárias

### Domínio Customizado (Opcional)
1. Vá para **Settings** > **Domains**
2. Adicione seu domínio
3. Configure os DNS conforme instruções

## Monitoramento

### Logs
- Acesse **Functions** para ver logs de build
- **Analytics** para métricas de performance

### Deploy Automático
- Cada push para `main` gera um novo deploy
- Pull requests geram previews automáticos

## Troubleshooting

### Erro de Build
- Verifique se todas as dependências estão no `package.json`
- Confirme se o Node.js está na versão correta

### Erro de Roteamento
- O `vercel.json` já está configurado para SPA
- Todas as rotas redirecionam para `index.html`

### Performance
- Assets são automaticamente otimizados
- CDN global da Vercel
- Cache configurado para assets estáticos

## Próximos Passos

1. **Teste o site**: Verifique se tudo funciona
2. **Configure domínio**: Adicione um domínio personalizado se desejar
3. **Monitore**: Use os analytics da Vercel
4. **Atualize**: Faça pushes para atualizar automaticamente

---

## Links Úteis
- [Documentação Vercel](https://vercel.com/docs)
- [Guia Vite + Vercel](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Suporte Vercel](https://vercel.com/support) 