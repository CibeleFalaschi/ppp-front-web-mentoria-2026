const express = require('express');
const path = require('path');

const app = express();
const PORT = 4000;
const API_BASE_URL = 'http://localhost:3000';

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function getTokenFromAuthHeader(header) {
  if (!header) return null;
  const [type, token] = header.split(' ');
  return type?.toLowerCase() === 'bearer' ? token : null;
}

function getErrorMessage(response) {
  return response?.message || response?.error || 'Ocorreu um erro inesperado na API.';
}

async function apiRequest(endpoint, options = {}, token = '') {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') && text ? JSON.parse(text) : text;

  if (!response.ok) {
    const message = getErrorMessage(payload);
    const error = new Error(message);
    error.statusCode = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

app.post('/api/login', async (req, res) => {
  try {
    const result = await apiRequest('/login', {
      method: 'POST',
      body: JSON.stringify(req.body),
    });

    return res.json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
      statusCode: error.statusCode || 500,
    });
  }
});

app.get('/api/dashboard', async (req, res) => {
  try {
    const token = getTokenFromAuthHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ message: 'Token JWT ausente.', statusCode: 401 });
    }

    const payload = await apiRequest('/dashboard', { method: 'GET' }, token);
    return res.json(payload);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
      statusCode: error.statusCode || 500,
    });
  }
});

app.get('/api/usuarios', async (req, res) => {
  try {
    const token = getTokenFromAuthHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ message: 'Token JWT ausente.', statusCode: 401 });
    }

    const payload = await apiRequest('/usuarios', { method: 'GET' }, token);
    return res.json(payload);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
      statusCode: error.statusCode || 500,
    });
  }
});

app.post('/api/usuarios', async (req, res) => {
  try {
    const token = getTokenFromAuthHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ message: 'Token JWT ausente.', statusCode: 401 });
    }

    const payload = await apiRequest('/usuarios', {
      method: 'POST',
      body: JSON.stringify(req.body),
    }, token);

    return res.status(201).json(payload);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
      statusCode: error.statusCode || 500,
    });
  }
});

app.get('/api/usuarios/:id', async (req, res) => {
  try {
    const token = getTokenFromAuthHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ message: 'Token JWT ausente.', statusCode: 401 });
    }

    const payload = await apiRequest(`/usuarios/${req.params.id}`, { method: 'GET' }, token);
    return res.json(payload);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
      statusCode: error.statusCode || 500,
    });
  }
});

app.put('/api/usuarios/:id', async (req, res) => {
  try {
    const token = getTokenFromAuthHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ message: 'Token JWT ausente.', statusCode: 401 });
    }

    const payload = await apiRequest(`/usuarios/${req.params.id}`, {
      method: 'PUT',
      body: JSON.stringify(req.body),
    }, token);

    return res.json(payload);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
      statusCode: error.statusCode || 500,
    });
  }
});

app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    const token = getTokenFromAuthHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ message: 'Token JWT ausente.', statusCode: 401 });
    }

    const payload = await apiRequest(`/usuarios/${req.params.id}`, { method: 'DELETE' }, token);
    return res.json(payload);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
      statusCode: error.statusCode || 500,
    });
  }
});

app.get('/api/clientes', async (req, res) => {
  try {
    const token = getTokenFromAuthHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ message: 'Token JWT ausente.', statusCode: 401 });
    }

    const query = new URLSearchParams(req.query).toString();
    const payload = await apiRequest(`/clientes${query ? `?${query}` : ''}`, { method: 'GET' }, token);
    return res.json(payload);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
      statusCode: error.statusCode || 500,
    });
  }
});

app.post('/api/clientes', async (req, res) => {
  try {
    const token = getTokenFromAuthHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ message: 'Token JWT ausente.', statusCode: 401 });
    }

    const payload = await apiRequest('/clientes', {
      method: 'POST',
      body: JSON.stringify(req.body),
    }, token);
    return res.status(201).json(payload);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
      statusCode: error.statusCode || 500,
    });
  }
});

app.get('/api/clientes/:id', async (req, res) => {
  try {
    const token = getTokenFromAuthHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ message: 'Token JWT ausente.', statusCode: 401 });
    }

    const payload = await apiRequest(`/clientes/${req.params.id}`, { method: 'GET' }, token);
    return res.json(payload);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
      statusCode: error.statusCode || 500,
    });
  }
});

app.put('/api/clientes/:id', async (req, res) => {
  try {
    const token = getTokenFromAuthHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ message: 'Token JWT ausente.', statusCode: 401 });
    }

    const payload = await apiRequest(`/clientes/${req.params.id}`, {
      method: 'PUT',
      body: JSON.stringify(req.body),
    }, token);
    return res.json(payload);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
      statusCode: error.statusCode || 500,
    });
  }
});

app.delete('/api/clientes/:id', async (req, res) => {
  try {
    const token = getTokenFromAuthHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ message: 'Token JWT ausente.', statusCode: 401 });
    }

    const payload = await apiRequest(`/clientes/${req.params.id}`, { method: 'DELETE' }, token);
    return res.json(payload);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message,
      statusCode: error.statusCode || 500,
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
