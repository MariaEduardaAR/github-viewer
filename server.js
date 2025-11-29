import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// 🔐 SUAS CREDENCIAIS - SUBSTITUA COM AS DO SEU APP GITHUB
const CLIENT_ID = 'Ov23liP7RJTx5g95uGCr';
const CLIENT_SECRET = '5e2d4e1051b286abd7cc7bcb6df1339ab6b24fc4'; // Você vai pegar isso no GitHub

// Rota para trocar código por token
app.post('/api/exchange-token', async (req, res) => {
  try {
    const { code, code_verifier } = req.body;
    
    console.log('🔄 Trocando código por token...');
    console.log('📝 Code:', code?.substring(0, 20) + '...');

    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: 'http://localhost:3000',
        code_verifier: code_verifier
      })
    });

    if (!response.ok) {
      throw new Error(`GitHub retornou status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Resposta do GitHub:', data);

    if (data.error) {
      throw new Error(data.error_description || data.error);
    }

    res.json({
      success: true,
      access_token: data.access_token,
      token_type: data.token_type,
      scope: data.scope
    });

  } catch (error) {
    console.error('❌ Erro no backend:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ status: '✅ Backend rodando!' });
});

app.listen(PORT, () => {
  console.log('🚀 Backend rodando na porta 3001');
  console.log('📋 Health check: http://localhost:3001/health');
  console.log('🔐 Token endpoint: http://localhost:3001/api/exchange-token');
});