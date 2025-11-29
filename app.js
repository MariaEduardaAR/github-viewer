// ==========================================
// CONFIGURAÇÃO OAUTH
// ==========================================
const CONFIG = {
  CLIENT_ID: 'Ov23liP7RJTx5g95uGCr',
  REDIRECT_URI: window.location.origin + window.location.pathname,
  SCOPE: 'read:user',
  AUTH_URL: 'https://github.com/login/oauth/authorize',
  API_URL: 'https://api.github.com',
  BACKEND_URL: 'http://localhost:3001'
};

// ==========================================
// VARIÁVEIS GLOBAIS
// ==========================================
let allRepositories = [];
let currentSearchTerm = '';
let currentToken = null;

// ==========================================
// UTILITÁRIOS PKCE
// ==========================================

function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values)
    .map(x => possible[x % possible.length])
    .join('');
}

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await crypto.subtle.digest('SHA-256', data);
}

function base64urlencode(buffer) {
  const bytes = new Uint8Array(buffer);
  let str = '';
  bytes.forEach(byte => str += String.fromCharCode(byte));
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

async function generateCodeChallenge(verifier) {
  const hashed = await sha256(verifier);
  return base64urlencode(hashed);
}

// ==========================================
// FLUXO OAUTH REAL
// ==========================================

async function startOAuthFlow() {
  try {
    console.log('🔐 Iniciando fluxo OAuth REAL...');

    const codeVerifier = generateRandomString(64);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateRandomString(16);

    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('code_verifier', codeVerifier);

    const params = new URLSearchParams({
      client_id: CONFIG.CLIENT_ID,
      redirect_uri: CONFIG.REDIRECT_URI,
      scope: CONFIG.SCOPE,
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    const authUrl = `${CONFIG.AUTH_URL}?${params.toString()}`;
    console.log('🚀 Redirecionando para GitHub...');
    window.location.href = authUrl;
    
  } catch (error) {
    console.error('❌ Erro ao iniciar OAuth:', error);
    showMessage('error', 'Erro: ' + error.message, 'loginMessage');
  }
}

async function handleOAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const error = urlParams.get('error');

  if (!code) return null;

  if (error) {
    throw new Error(`GitHub retornou erro: ${error}`);
  }

  try {
    const savedState = sessionStorage.getItem('oauth_state');
    if (!savedState || state !== savedState) {
      throw new Error('Falha na validação de segurança');
    }

    const codeVerifier = sessionStorage.getItem('code_verifier');
    if (!codeVerifier) {
      throw new Error('Code verifier não encontrado');
    }

    console.log('🔄 Obtendo token REAL do backend...');

    // 🔥 AGORA USANDO BACKEND REAL!
    const tokenResponse = await fetch(`${CONFIG.BACKEND_URL}/api/exchange-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        code_verifier: codeVerifier
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`Erro no backend: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.success) {
      throw new Error(tokenData.error || 'Erro ao obter token');
    }

    const accessToken = tokenData.access_token;
    console.log('✅ Token REAL obtido com sucesso!');

    // Limpar
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('code_verifier');
    window.history.replaceState({}, '', window.location.pathname);

    return accessToken;
    
  } catch (error) {
    sessionStorage.clear();
    console.error('❌ Erro no callback:', error);
    throw error;
  }
}

// ==========================================
// API GITHUB REAL
// ==========================================

async function fetchWithAuth(endpoint, token) {
  const url = endpoint.startsWith('http') ? endpoint : `${CONFIG.API_URL}${endpoint}`;
  
  console.log('🌐 Fazendo requisição para:', endpoint);
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-OAuth-Viewer'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

async function loadUserData(token) {
  console.log('👤 Buscando dados REAIS do usuário...');
  const user = await fetchWithAuth('/user', token);
  console.log('✅ Usuário REAL:', user.login);
  return user;
}

async function loadRepositories(token) {
  console.log('📚 Buscando repositórios REAIS...');
  const repos = await fetchWithAuth('/user/repos?sort=updated&per_page=50', token);
  console.log(`✅ ${repos.length} repositórios REAIS encontrados`);
  return repos;
}

// ==========================================
// FUNÇÕES DE BUSCA
// ==========================================

function filterRepositories(searchTerm) {
  if (!searchTerm.trim()) {
    return allRepositories;
  }

  const term = searchTerm.toLowerCase().trim();
  
  return allRepositories.filter(repo => {
    const nameMatch = repo.name.toLowerCase().includes(term);
    const descMatch = repo.description && repo.description.toLowerCase().includes(term);
    const langMatch = repo.language && repo.language.toLowerCase().includes(term);
    
    return nameMatch || descMatch || langMatch;
  });
}

function performSearch() {
  const searchTerm = document.getElementById('searchInput').value;
  currentSearchTerm = searchTerm;
  
  const filteredRepos = filterRepositories(searchTerm);
  updateResultsInfo(filteredRepos.length, searchTerm);
  displayRepositories(filteredRepos);
}

function updateResultsInfo(resultCount, searchTerm) {
  const resultsInfoEl = document.getElementById('resultsInfo');
  
  if (!searchTerm.trim()) {
    resultsInfoEl.classList.add('hidden');
    return;
  }
  
  if (resultCount === 0) {
    resultsInfoEl.innerHTML = `❌ Nenhum repositório encontrado para "<strong>${searchTerm}</strong>"`;
    resultsInfoEl.style.background = '#ffebee';
    resultsInfoEl.style.borderColor = '#ef9a9a';
    resultsInfoEl.style.color = '#c62828';
  } else {
    resultsInfoEl.innerHTML = `🔍 ${resultCount} repositório(s) encontrado(s) para "<strong>${searchTerm}</strong>"`;
    resultsInfoEl.style.background = '#e8f5e9';
    resultsInfoEl.style.borderColor = '#a5d6a7';
    resultsInfoEl.style.color = '#2e7d32';
  }
  
  resultsInfoEl.classList.remove('hidden');
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  currentSearchTerm = '';
  document.getElementById('resultsInfo').classList.add('hidden');
  displayRepositories(allRepositories);
}

// ==========================================
// UI FUNCTIONS
// ==========================================

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.add('hidden');
  });
  
  if (pageId) {
    document.getElementById(pageId).classList.remove('hidden');
  }
}

function showMessage(type, text, elementId = 'dashboardMessage') {
  const messageEl = document.getElementById(elementId);
  messageEl.textContent = text;
  messageEl.className = `message ${type} show`;
}

function hideMessage(elementId = 'dashboardMessage') {
  const messageEl = document.getElementById(elementId);
  messageEl.classList.remove('show');
}

function displayUserInfo(user) {
  const userInfoEl = document.getElementById('userInfo');
  userInfoEl.innerHTML = `
    <img src="${user.avatar_url}" alt="${user.login}" crossorigin="anonymous">
    <div class="user-details">
      <h2>${user.name || user.login}</h2>
      <p>@${user.login}</p>
      <span class="badge">👁️ Perfil Viewer</span>
      <span class="demo-tag" style="background: #4caf50;">✅ CONECTADO</span>
    </div>
  `;
  userInfoEl.classList.remove('hidden');
}

function displayRepositories(repos) {
  const repoList = document.getElementById('repoList');
  repoList.innerHTML = '';

  if (repos.length === 0) {
    if (currentSearchTerm) {
      repoList.innerHTML = `
        <div class="no-results">
          <h3>🔍 Nenhum repositório encontrado</h3>
          <p>Nenhum repositório corresponde à busca "<strong>${currentSearchTerm}</strong>"</p>
          <button onclick="clearSearch()" class="btn btn-primary" style="margin-top: 15px;">
            Limpar Busca
          </button>
        </div>
      `;
    } else {
      showMessage('info', 'Nenhum repositório encontrado');
    }
    return;
  }

  hideMessage();

  repos.forEach(repo => {
    const li = document.createElement('li');
    li.className = 'repo-item';

    const stars = repo.stargazers_count || 0;
    const forks = repo.forks_count || 0;
    const language = repo.language || 'N/A';
    const privateLabel = repo.private ? '<span class="repo-private">🔒 Privado</span>' : '';

    li.innerHTML = `
      <a href="${repo.html_url}" target="_blank" rel="noopener">
        ${repo.name} ↗
      </a>
      ${privateLabel}
      <div class="repo-description">
        ${repo.description || 'Repositório sem descrição.'}
      </div>
      <div class="repo-meta">
        <span>⭐ ${stars}</span>
        <span>🍴 ${forks}</span>
        <span>💻 ${language}</span>
        <span>📅 ${new Date(repo.updated_at).toLocaleDateString('pt-BR')}</span>
      </div>
    `;

    repoList.appendChild(li);
  });
}

// ==========================================
// APP FLOW REAL
// ==========================================

async function loadDashboard(token) {
  try {
    showPage('loadingPage');
    showMessage('info', '🎯 Conectado! Carregando seus dados REAIS...');

    // 🔥 AGORA DADOS REAIS!
    const user = await loadUserData(token);
    const repos = await loadRepositories(token);

    allRepositories = repos;

    showPage('dashboardPage');
    displayUserInfo(user);
    displayRepositories(repos);

    showMessage('success', `✅ Conectado como ${user.login}! ${repos.length} repositórios carregados.`);

  } catch (error) {
    console.error('❌ Erro ao carregar dashboard:', error);
    showMessage('error', 'Erro: ' + error.message);
    showPage('dashboardPage');
  }
}

function logout() {
  currentToken = null;
  sessionStorage.clear();
  allRepositories = [];
  currentSearchTerm = '';
  showPage('loginPage');
  hideMessage('loginMessage');
  hideMessage('dashboardMessage');
}

async function initApp() {
  try {
    console.log('🚀 Iniciando aplicação REAL...');

    // Verificar se backend está rodando
    try {
      const healthResponse = await fetch(`${CONFIG.BACKEND_URL}/health`);
      if (healthResponse.ok) {
        console.log('✅ Backend conectado!');
      }
    } catch (error) {
      console.warn('⚠️ Backend não encontrado. Iniciando modo demonstração...');
      showMessage('info', '🔧 Backend não encontrado. Use "Ver Demonstração" para testar.', 'loginMessage');
    }

    const token = await handleOAuthCallback();

    if (token) {
      currentToken = token;
      await loadDashboard(token);
    } else {
      showPage('loginPage');
    }

  } catch (error) {
    console.error('❌ Erro na inicialização:', error);
    showMessage('error', error.message, 'loginMessage');
    showPage('loginPage');
  }
}

// ==========================================
// MODO DEMONSTRAÇÃO (fallback)
// ==========================================

function loadMockData() {
  const mockUser = {
    login: 'dev-user',
    name: 'Desenvolvedor Exemplo',
    avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
    html_url: 'https://github.com/octocat'
  };

  const mockRepos = [
    {
      name: 'meu-projeto',
      description: 'Um projeto incrível de exemplo em JavaScript',
      html_url: 'https://github.com/octocat/meu-projeto',
      stargazers_count: 42,
      forks_count: 8,
      language: 'JavaScript',
      private: false,
      updated_at: new Date().toISOString()
    }
  ];

  return { user: mockUser, repos: mockRepos };
}

function loadDemo() {
  showPage('loadingPage');
  setTimeout(() => {
    const mockData = loadMockData();
    allRepositories = mockData.repos;
    showPage('dashboardPage');
    displayUserInfo(mockData.user);
    displayRepositories(mockData.repos);
    showMessage('info', '🎭 Modo demonstração - Configure o backend para dados reais');
  }, 1000);
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
  // Event listeners
  document.getElementById('loginButton').addEventListener('click', startOAuthFlow);
  document.getElementById('logoutButton').addEventListener('click', logout);
  document.getElementById('demoButton').addEventListener('click', loadDemo);
  document.getElementById('clearSearch').addEventListener('click', clearSearch);
  
  // Busca em tempo real
  document.getElementById('searchInput').addEventListener('input', performSearch);
  
  // Busca com Enter
  document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      performSearch();
    }
  });

  // Iniciar app
  initApp();
});