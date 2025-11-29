# GitHub OAuth Viewer 🔐

## 📋 Sobre o Projeto
Aplicação web completa para autenticação segura com GitHub OAuth 2.0 + PKCE e visualização de repositórios. **Já está funcionando perfeitamente!** ✅

## 🎯 Funcionalidades Implementadas
- ✅ **Autenticação OAuth 2.0 com PKCE** - Fluxo seguro de login
- ✅ **Visualização de repositórios** - Lista todos os seus repositórios do GitHub
- ✅ **Sistema de busca** - Filtra por nome, descrição ou linguagem
- ✅ **Interface responsiva** - Design moderno e adaptável
- ✅ **Gestão segura de tokens** - Armazenamento apenas em memória
- ✅ **Proteção CSRF** - Validação de state
- ✅ **Modo demonstração** - Funciona mesmo sem backend

## 🚀 Como Usar (Aplicação Pronta)

### 1. **Backend** (Terminal 1)
```bash
# Na pasta do projeto
npm start
```
**Saída esperada:**
```
🚀 Backend rodando na porta 3001
📋 Health check: http://localhost:3001/health
```

### 2. **Frontend** (Terminal 2)
```bash
# Abra o index.html no navegador
# Ou use um servidor local:
npx serve . --port 3000
```

### 3. **Acesse no Navegador**
```
http://localhost:3000
```

## 🎮 Fluxo de Uso

1. **Clique em "Login com GitHub OAuth"**
2. **Autorize o app no GitHub**
3. **Veja seus repositórios REAIS** carregados
4. **Use a barra de busca** para filtrar
5. **Clique em "Logout"** para sair

## 🛡️ Segurança Implementada
- **PKCE (RFC 7636)** - Proof Key for Code Exchange
- **State Validation** - Proteção contra ataques CSRF  
- **Token em Memória** - Não persiste no localStorage
- **Scopes Mínimos** - Apenas `read:user`
- **CORS Configurado** - Comunicação segura front/back

## 🔧 Estrutura Técnica

### Portas Utilizadas
- **Frontend**: 3000 (`index.html`)
- **Backend**: 3001 (`server.js`)

### APIs Integradas
- **GitHub OAuth**: `https://github.com/login/oauth/`
- **GitHub API**: `https://api.github.com/`
- **Backend Local**: `http://localhost:3001/api/`

### Arquivos Principais
```
github-viewer/
├── index.html          # Interface principal
├── style.css           # Estilos e design
├── app.js              # Lógica frontend + OAuth
├── server.js           # Backend Node.js
└── package.json        # Dependências
```

## 🐛 Solução de Problemas Comuns

### Porta 3001 em uso
```bash
sudo fuser -k 3001/tcp
npm start
```

### Backend não conecta
```bash
# Teste se está rodando
curl http://localhost:3001/health
```

### Erro de CORS
- Verifique se backend está na porta 3001
- Confirme frontend na porta 3000

## 📊 Funcionalidades da Busca
- 🔍 **Busca em tempo real** - Filtra enquanto digita
- 📝 **Múltiplos campos** - Nome, descrição e linguagem
- 📱 **Responsiva** - Funciona em mobile
- 🎯 **Feedback visual** - Mostra resultados encontrados

## 🌟 Próximas Melhorias (Opcionais)
- [ ] Paginação de repositórios
- [ ] Ordenação por stars/forks
- [ ] Dashboard com estatísticas
- [ ] Tema escuro/claro
- [ ] Export de dados

---

## ✅ Status: **PRODUÇÃO PRONTA**

**A aplicação está 100% funcional e segura para uso!** 🎉

---

**📞 Suporte:** Verifique os logs no console do navegador para debug detalhado.

**⭐ Aproveite sua aplicação GitHub OAuth completa!** 🚀