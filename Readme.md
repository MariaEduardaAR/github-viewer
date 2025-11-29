# GitHub Viewer - Backend ✅

## 📋 Sobre o Projeto

O **GitHub Viewer** é uma aplicação web completa que permite visualizar e explorar repositórios do GitHub de forma intuitiva. A aplicação utiliza OAuth para autenticação segura e fornece uma interface rica para navegar por repositórios, usuários e conteúdos da plataforma GitHub.

---

## 🏗️ Arquitetura do Sistema

### Estrutura do Projeto
```
github-viewer/
├── 📁 node_modules/          # Dependências do Node.js
├── 🚀 server.js              # Servidor backend principal (Express.js)
├── 📦 package.json           # Configurações e dependências do projeto
├── 🔒 package-lock.json      # Versões travadas das dependências
├── 🌐 index.html             # Página principal do frontend
├── 🎨 style.css              # Estilos CSS responsivos
├── ⚡ app.js                 # Lógica JavaScript do frontend
└── 📖 README.md              # Documentação completa
```

### Tecnologias Utilizadas
- **Backend:** Node.js + Express.js
- **Frontend:** HTML5 + CSS3 + JavaScript Vanilla
- **Autenticação:** OAuth 2.0 com GitHub
- **Sessões:** Express Session
- **Requisições HTTP:** Axios

---

## ⚙️ Configuração e Instalação

### Pré-requisitos
- Node.js 18.x ou superior
- npm ou yarn
- Conta no GitHub
- Aplicação OAuth registrada no GitHub

### Passo a Passo de Instalação

1. **Clone e instalação:**
```bash
git clone <url-do-repositorio>
cd github-viewer
npm install
```

2. **Configuração do OAuth App no GitHub:**
   - Acesse [GitHub Developer Settings](https://github.com/settings/developers)
   - Clique em **"OAuth Apps"** → **"New OAuth App"**
   - Preencha os campos:
     - **Application name:** `GitHub Viewer - Seu Nome`
     - **Homepage URL:** `http://localhost:3000`
     - **Application description:** `Aplicação para visualização de repositórios GitHub`
     - **Authorization callback URL:** `http://localhost:3002/auth/github/callback`
   - Registre e anote o **Client ID** e **Client Secret**

3. **Configuração das variáveis de ambiente:**
```bash
# Criar arquivo .env na raiz do projeto
touch .env
```

```env
# Configurações do Servidor
PORT=3002
SESSION_SECRET=sua_chave_secreta_super_segura_aqui

# Configurações GitHub OAuth
GITHUB_CLIENT_ID=seu_client_id_obtido_no_github
GITHUB_CLIENT_SECRET=seu_client_secret_obtido_no_github
GITHUB_CALLBACK_URL=http://localhost:3002/auth/github/callback

# Configurações de Ambiente
NODE_ENV=development
```

---

## 🚀 Execução da Aplicação

### Desenvolvimento
```bash
# Iniciar servidor backend
npm start

# Ou para desenvolvimento com auto-reload
npm run dev
```

### Acesso às Aplicações
- **Frontend:** `http://localhost:3000` (abra index.html no navegador)
- **Backend API:** `http://localhost:3002`
- **Health Check:** `http://localhost:3002/health`

---

## 🔌 API Endpoints Disponíveis

### 🔐 Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/auth/github` | Inicia fluxo de autenticação OAuth |
| `GET` | `/auth/github/callback` | Callback do GitHub (processa login) |
| `GET` | `/auth/logout` | Encerra sessão do usuário |
| `GET` | `/auth/user` | Retorna dados do usuário logado |

### 📊 Repositórios
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/repos` | Lista todos os repositórios do usuário |
| `GET` | `/api/repos/:owner/:repo` | Detalhes específicos de um repositório |
| `GET` | `/api/repos/:owner/:repo/contents` | Conteúdo de diretórios/arquivos |
| `GET` | `/api/repos/:owner/:repo/readme` | README do repositório |

### 🔍 Busca
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/search/repositories?q=query` | Busca repositórios no GitHub |
| `GET` | `/api/search/users?q=query` | Busca usuários no GitHub |

### ℹ️ Utilitários
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/health` | Status da API e saúde do servidor |

---

## 🎯 Funcionalidades Implementadas

### Backend (server.js)
- ✅ Servidor Express.js com configurações robustas
- ✅ Sistema de autenticação OAuth 2.0 com GitHub
- ✅ Gestão de sessões de usuário com express-session
- ✅ Middlewares de CORS para comunicação frontend/backend
- ✅ API RESTful com endpoints organizados
- ✅ Tratamento de erros centralizado
- ✅ Integração com GitHub API v3
- ✅ Logs de console para debugging

### Frontend
- ✅ Interface responsiva e moderna
- ✅ Integração real-time com backend
- ✅ Navegação por repositórios
- ✅ Visualização de perfil de usuário
- ✅ Design intuitivo e user-friendly
- ✅ Gestão de estado da aplicação

---

## 🔒 Segurança

- **Autenticação:** OAuth 2.0 com GitHub
- **Sessões:** Cookies seguros com secret configurável
- **CORS:** Configurado para origens específicas
- **Variáveis sensíveis:** Armazenadas em .env
- **Rate Limiting:** Implementado via GitHub API limits

---

## 🛠️ Desenvolvimento

### Estrutura de Desenvolvimento
```javascript
// Fluxo de autenticação
Usuário → /auth/github → GitHub OAuth → /callback → Sessão → API Access

// Fluxo de dados
Frontend → Backend (3002) → GitHub API → Resposta → Frontend
```

### Scripts Disponíveis
```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "echo 'Implementar testes'"
}
```

---

## 📈 Próximas Melhorias

- [ ] Implementação de cache para requests
- [ ] Paginação de resultados
- [ ] Dashboard administrativo
- [ ] Métricas de uso da aplicação
- [ ] Suporte a temas dark/light
- [ ] Exportação de dados
- [ ] Notificações em tempo real

---

## 🐛 Solução de Problemas

### Erro Comum: Porta em Uso
```bash
# Linux/Mac
sudo kill -9 $(sudo lsof -t -i:3002)

# Windows
netstat -ano | findstr :3002
taskkill /PID <PID> /F
```

### Erro de Autenticação
- Verificar Client ID e Secret no .env
- Confirmar Callback URL no GitHub OAuth App
- Checar se o .env está na raiz do projeto

---

## 📞 Suporte

Para issues e dúvidas:
1. Verifique se todas as variáveis de ambiente estão configuradas
2. Confirme que as portas 3000 e 3002 estão livres
3. Valide as credenciais do GitHub OAuth App

---

**🚀 Desenvolvido com Node.js + Express + GitHub API**