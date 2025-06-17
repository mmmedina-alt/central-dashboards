# Central de Dashboards - Gestão de Editais

**Central de Dashboards** é uma aplicação web para gerenciar e acessar dashboards de editais de pesquisa, com controle de acesso por PIN, CRUD de dashboards, backup/restauração, tema escuro/claro, responsividade e acessibilidade.

---

## Funcionalidades

- **Acesso por PIN:** Tela de acesso do gestor protegida por PIN (padrão: `2024`).
- **CRUD de Dashboards:** Adicione, edite e remova dashboards facilmente.
- **Backup e Restauração:** Exporte e importe todos os dashboards em JSON.
- **Tema Escuro/Claro:** Alternância rápida de tema.
- **Responsivo:** Funciona em desktop, tablet e mobile.
- **Acessibilidade:** Foco visível, navegação por teclado, contraste aprimorado.
- **Feedback Visual:** Toasts para ações de sucesso/erro.
- **Compartilhamento:** Modal para compartilhar dashboards por link ou redes sociais.

---

## Como rodar localmente

1. **Pré-requisitos:**  
   - Node.js 20.17.0 ou superior  
   - npm 11.4.2 ou superior

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Rode o projeto:**
   ```bash
   npm run dev
   ```
   O app estará disponível em [http://localhost:3000](http://localhost:3000) (ou próxima porta livre).

---

## 🚀 Deploy

### Build de Produção
```bash
npm run build
npm run preview
```

### Deploy na Vercel (Recomendado)

#### Opção 1: Via GitHub (Automático)
1. **Crie um repositório no GitHub** e faça push do código
2. **Acesse [vercel.com](https://vercel.com)** e faça login
3. **Clique em "New Project"** e conecte sua conta GitHub
4. **Selecione o repositório** e clique em "Import"
5. **Clique em "Deploy"** - a Vercel detectará automaticamente as configurações

#### Opção 2: Upload Manual
1. **Execute o build:** `npm run build`
2. **Acesse [vercel.com](https://vercel.com)**
3. **Clique em "New Project"** → **"Upload"**
4. **Arraste a pasta `dist`** para o upload
5. **Clique em "Deploy"**

### Configurações Automáticas
- ✅ Framework detectado: Vite
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ SPA routing configurado
- ✅ Cache otimizado para assets

### Domínio
Após o deploy, seu site estará disponível em:
- `https://seu-projeto.vercel.app`
- Você pode adicionar um domínio customizado nas configurações

---

## Estrutura de Pastas

```
src/
  components/    # Componentes React (DashboardCard, DashboardForm, PinAccess, etc)
  hooks/         # Hooks customizados (useDashboards, etc)
  pages/         # Páginas principais (Dashboard, Login)
  theme/         # Tema customizado Chakra UI
  types/         # Tipos TypeScript
  App.tsx        # Componente principal
  main.tsx       # Entry point
```

---

## Observações

- O PIN padrão do gestor é `2024`.
- O botão "Voltar" só aparece na tela de gestão.
- O modal de PIN e o de edição são totalmente acessíveis e responsivos.
- O código está limpo, sem variáveis/imports não usados.

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Feito com ❤️ Matheus Medina 