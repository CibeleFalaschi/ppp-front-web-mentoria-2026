const API_BASE_URL = 'http://localhost:4000';

const state = {
  token: localStorage.getItem('crm-jwt') || '',
  currentFilters: {},
};

const elements = {
  loginPage: document.getElementById('login-page'),
  appPage: document.getElementById('app-page'),
  loginForm: document.getElementById('login-form'),
  loginMessage: document.getElementById('login-message'),
  globalMessage: document.getElementById('global-message'),
  logoutButton: document.getElementById('logout-button'),
  loader: document.getElementById('loader'),
  dashboard: {
    total: document.getElementById('total-clientes'),
    abertos: document.getElementById('abertos'),
    fechados: document.getElementById('fechados'),
    perdidos: document.getElementById('perdidos'),
  },
  tableBody: document.getElementById('clientes-table-body'),
  usuariosTableBody: document.getElementById('usuarios-table-body'),
  btnPesquisar: document.getElementById('btn-pesquisar'),
  btnLimpar: document.getElementById('btn-limpar'),
  btnNovo: document.getElementById('btn-novo'),
  btnUsuarios: document.getElementById('btn-usuarios'),
  btnNovoUsuario: document.getElementById('btn-novo-usuario'),
  modal: document.getElementById('client-modal'),
  modalTitle: document.getElementById('modal-title'),
  form: document.getElementById('client-form'),
  cancelForm: document.getElementById('cancel-form'),
  userModal: document.getElementById('user-modal'),
  userModalTitle: document.getElementById('user-modal-title'),
  userForm: document.getElementById('user-form'),
  cancelUserForm: document.getElementById('cancel-user-form'),
  filters: {
    nome: document.getElementById('filtro-nome'),
    email: document.getElementById('filtro-email'),
    telefone: document.getElementById('filtro-telefone'),
    status: document.getElementById('filtro-status'),
  },
};

function showLoader() {
  elements.loader.classList.remove('is-hidden');
}

function hideLoader() {
  elements.loader.classList.add('is-hidden');
}

function setMessage(element, message, type = 'is-danger') {
  element.className = `notification ${type}`;
  element.textContent = message;
  element.classList.remove('is-hidden');
}

function clearMessage(element) {
  element.className = 'notification is-hidden';
  element.textContent = '';
}

function togglePages() {
  if (state.token) {
    elements.loginPage.classList.add('is-hidden');
    elements.appPage.classList.remove('is-hidden');
  } else {
    elements.loginPage.classList.remove('is-hidden');
    elements.appPage.classList.add('is-hidden');
  }
}

function redirectToLogin() {
  state.token = '';
  localStorage.removeItem('crm-jwt');
  togglePages();
  clearMessage(elements.globalMessage);
}

async function apiFetch(path, { method = 'GET', body = null, headers = {} } = {}) {
  showLoader();
  const defaultHeaders = { Accept: 'application/json' };

  if (state.token) {
    defaultHeaders.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...defaultHeaders,
      ...headers,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : null,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  hideLoader();

  if (!response.ok) {
    const message = payload?.message || 'Ocorreu um erro inesperado na API.';
    if (response.status === 401 || response.status === 403) {
      redirectToLogin();
    }
    throw new Error(message);
  }

  return payload;
}

async function login(event) {
  event.preventDefault();
  clearMessage(elements.loginMessage);

  const formData = new FormData(elements.loginForm);
  const username = formData.get('username');
  const password = formData.get('password');

  try {
    const result = await apiFetch('/api/login', {
      method: 'POST',
      body: { username, password },
    });

    state.token = result.token;
    localStorage.setItem('crm-jwt', state.token);
    togglePages();
    await loadDashboard();
    await loadClients();
    await loadUsers().catch(() => {
      setMessage(elements.globalMessage, 'Lista de usuários indisponível no momento.', 'is-warning');
    });
  } catch (error) {
    setMessage(elements.loginMessage, error.message);
  }
}

async function loadDashboard() {
  const dashboard = await apiFetch('/api/dashboard');
  elements.dashboard.total.textContent = dashboard.totalClientes ?? 0;
  elements.dashboard.abertos.textContent = dashboard.abertos ?? 0;
  elements.dashboard.fechados.textContent = dashboard.fechados ?? 0;
  elements.dashboard.perdidos.textContent = dashboard.perdidos ?? 0;
}

async function loadUsers() {
  const response = await apiFetch('/api/usuarios');

  if (!Array.isArray(response)) {
    elements.usuariosTableBody.innerHTML = '';
    return;
  }

  elements.usuariosTableBody.innerHTML = response
    .map(
      (user) => `
        <tr>
          <td>${user.username || '-'}</td>
          <td>${user.role || '-'}</td>
          <td><span class="tag is-light">${user.status || '-'}</span></td>
          <td class="has-text-right">
            <div class="buttons is-right">
              <button class="button is-small is-info" data-user-action="view" data-user-id="${user.id}">Consultar</button>
              <button class="button is-small is-warning" data-user-action="edit" data-user-id="${user.id}">Editar</button>
              <button class="button is-small is-danger" data-user-action="delete" data-user-id="${user.id}">Excluir</button>
            </div>
          </td>
        </tr>
      `
    )
    .join('');
}

async function loadClients() {
  const params = new URLSearchParams();
  Object.entries(state.currentFilters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  const query = params.toString();
  const response = await apiFetch(`/api/clientes${query ? `?${query}` : ''}`);

  if (!Array.isArray(response)) {
    elements.tableBody.innerHTML = '';
    return;
  }

  elements.tableBody.innerHTML = response
    .map(
      (client) => `
        <tr>
          <td>${client.nome || '-'}</td>
          <td>${client.email || '-'}</td>
          <td>${client.telefone || '-'}</td>
          <td>${client.empresa || '-'}</td>
          <td><span class="tag is-light">${client.status || '-'}</span></td>
          <td class="has-text-right">
            <div class="buttons is-right">
              <button class="button is-small is-info" data-action="view" data-id="${client.id}">Consultar</button>
              <button class="button is-small is-warning" data-action="edit" data-id="${client.id}">Editar</button>
              <button class="button is-small is-danger" data-action="delete" data-id="${client.id}">Excluir</button>
            </div>
          </td>
        </tr>
      `
    )
    .join('');
}

function openUserModal(user = null) {
  elements.userModal.classList.add('is-active');
  elements.userForm.reset();

  if (user) {
    elements.userModalTitle.textContent = 'Editar usuário';
    elements.userForm.querySelector('[name="id"]').value = user.id;
    elements.userForm.querySelector('[name="username"]').value = user.username || '';
    elements.userForm.querySelector('[name="password"]').value = user.password || '';
    elements.userForm.querySelector('[name="role"]').value = user.role || '';
    elements.userForm.querySelector('[name="status"]').value = user.status || '';
  } else {
    elements.userModalTitle.textContent = 'Novo usuário';
  }
}

function closeUserModal() {
  elements.userModal.classList.remove('is-active');
}

function openModal(client = null) {
  elements.modal.classList.add('is-active');
  elements.form.reset();

  if (client) {
    elements.modalTitle.textContent = 'Editar cliente';
    elements.form.querySelector('[name="id"]').value = client.id;
    elements.form.querySelector('[name="nome"]').value = client.nome || '';
    elements.form.querySelector('[name="email"]').value = client.email || '';
    elements.form.querySelector('[name="telefone"]').value = client.telefone || '';
    elements.form.querySelector('[name="empresa"]').value = client.empresa || '';
    elements.form.querySelector('[name="logradouro"]').value = client.endereco?.logradouro || '';
    elements.form.querySelector('[name="numero"]').value = client.endereco?.numero || '';
    elements.form.querySelector('[name="complemento"]').value = client.endereco?.complemento || '';
    elements.form.querySelector('[name="bairro"]').value = client.endereco?.bairro || '';
    elements.form.querySelector('[name="cidade"]').value = client.endereco?.cidade || '';
    elements.form.querySelector('[name="estado"]').value = client.endereco?.estado || '';
    elements.form.querySelector('[name="cep"]').value = client.endereco?.cep || '';
    elements.form.querySelector('[name="observacoes"]').value = client.observacoes || '';
    elements.form.querySelector('[name="status"]').value = client.status || '';
  } else {
    elements.modalTitle.textContent = 'Novo cliente';
  }
}

function closeModal() {
  elements.modal.classList.remove('is-active');
}

function validateClientForm(formData) {
  const requiredFields = ['nome', 'email', 'telefone', 'empresa', 'status'];
  const missing = requiredFields.filter((field) => !formData.get(field)?.toString().trim());

  if (missing.length) {
    throw new Error('Preencha os campos obrigatórios: nome, e-mail, telefone, empresa e status.');
  }
}

function validateUserForm(formData) {
  const requiredFields = ['username', 'password', 'role', 'status'];
  const missing = requiredFields.filter((field) => !formData.get(field)?.toString().trim());

  if (missing.length) {
    throw new Error('Preencha os campos obrigatórios: usuário, senha, perfil e status.');
  }
}

async function handleUserFormSubmit(event) {
  event.preventDefault();
  clearMessage(elements.globalMessage);

  const formData = new FormData(elements.userForm);

  try {
    validateUserForm(formData);

    const payload = {
      id: Number(formData.get('id')) || undefined,
      username: formData.get('username').trim(),
      password: formData.get('password').trim(),
      role: formData.get('role').trim(),
      status: formData.get('status').trim(),
    };

    const userId = payload.id;
    if (userId) {
      await apiFetch(`/api/usuarios/${userId}`, { method: 'PUT', body: payload });
      setMessage(elements.globalMessage, 'Usuário atualizado com sucesso.', 'is-success');
    } else {
      await apiFetch('/api/usuarios', { method: 'POST', body: payload });
      setMessage(elements.globalMessage, 'Usuário cadastrado com sucesso.', 'is-success');
    }

    closeUserModal();
    await loadUsers();
  } catch (error) {
    setMessage(elements.globalMessage, error.message, 'is-danger');
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();
  clearMessage(elements.globalMessage);

  const formData = new FormData(elements.form);

  try {
    validateClientForm(formData);

    const payload = {
      id: Number(formData.get('id')) || undefined,
      nome: formData.get('nome').trim(),
      email: formData.get('email').trim(),
      telefone: formData.get('telefone').trim(),
      empresa: formData.get('empresa').trim(),
      endereco: {
        logradouro: formData.get('logradouro').trim(),
        numero: formData.get('numero').trim(),
        complemento: formData.get('complemento').trim(),
        bairro: formData.get('bairro').trim(),
        cidade: formData.get('cidade').trim(),
        estado: formData.get('estado').trim(),
        cep: formData.get('cep').trim(),
      },
      observacoes: formData.get('observacoes').trim(),
      status: formData.get('status').trim(),
    };

    const clientId = payload.id;
    if (clientId) {
      await apiFetch(`/api/clientes/${clientId}`, { method: 'PUT', body: payload });
      setMessage(elements.globalMessage, 'Cliente atualizado com sucesso.', 'is-success');
    } else {
      await apiFetch('/api/clientes', { method: 'POST', body: payload });
      setMessage(elements.globalMessage, 'Cliente cadastrado com sucesso.', 'is-success');
    }

    closeModal();
    await loadDashboard();
    await loadClients();
  } catch (error) {
    setMessage(elements.globalMessage, error.message, 'is-danger');
  }
}

async function handleUserActionClick(event) {
  const button = event.target.closest('button[data-user-action]');
  if (!button) return;

  const id = Number(button.dataset.userId);
  const action = button.dataset.userAction;

  if (action === 'view') {
    const user = await apiFetch(`/api/usuarios/${id}`);
    openUserModal(user);
    setMessage(elements.globalMessage, `Consulta do usuário ${user.username} aberta.`, 'is-info');
    return;
  }

  if (action === 'edit') {
    const user = await apiFetch(`/api/usuarios/${id}`);
    openUserModal(user);
    return;
  }

  if (action === 'delete') {
    const confirmed = window.confirm('Deseja realmente excluir este usuário?');
    if (!confirmed) return;

    await apiFetch(`/api/usuarios/${id}`, { method: 'DELETE' });
    setMessage(elements.globalMessage, 'Usuário excluído com sucesso.', 'is-success');
    await loadUsers();
  }
}

async function handleActionClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === 'view') {
    const client = await apiFetch(`/api/clientes/${id}`);
    openModal(client);
    setMessage(elements.globalMessage, `Consulta do cliente ${client.nome} aberta.`, 'is-info');
    return;
  }

  if (action === 'edit') {
    const client = await apiFetch(`/api/clientes/${id}`);
    openModal(client);
    return;
  }

  if (action === 'delete') {
    const confirmed = window.confirm('Deseja realmente excluir este cliente?');
    if (!confirmed) return;

    await apiFetch(`/api/clientes/${id}`, { method: 'DELETE' });
    setMessage(elements.globalMessage, 'Cliente excluído com sucesso.', 'is-success');
    await loadDashboard();
    await loadClients();
  }
}

function applyFilters() {
  state.currentFilters = {
    nome: elements.filters.nome.value.trim(),
    email: elements.filters.email.value.trim(),
    telefone: elements.filters.telefone.value.trim(),
    status: elements.filters.status.value.trim(),
  };
}

async function searchClients() {
  applyFilters();
  await loadClients();
}

function clearFilters() {
  elements.filters.nome.value = '';
  elements.filters.email.value = '';
  elements.filters.telefone.value = '';
  elements.filters.status.value = '';
  state.currentFilters = {};
  loadClients();
}

function registerEvents() {
  elements.loginForm.addEventListener('submit', login);
  elements.logoutButton.addEventListener('click', redirectToLogin);
  elements.btnPesquisar.addEventListener('click', searchClients);
  elements.btnLimpar.addEventListener('click', clearFilters);
  elements.btnNovo.addEventListener('click', () => openModal());
  elements.btnUsuarios.addEventListener('click', () => loadUsers());
  elements.btnNovoUsuario.addEventListener('click', () => openUserModal());
  elements.cancelForm.addEventListener('click', closeModal);
  elements.cancelUserForm.addEventListener('click', closeUserModal);
  elements.form.addEventListener('submit', handleFormSubmit);
  elements.userForm.addEventListener('submit', handleUserFormSubmit);
  elements.tableBody.addEventListener('click', handleActionClick);
  elements.usuariosTableBody.addEventListener('click', handleUserActionClick);

  document.querySelectorAll('.delete').forEach((item) => {
    item.addEventListener('click', () => {
      closeModal();
      closeUserModal();
    });
  });

  document.querySelectorAll('.modal-background').forEach((item) => {
    item.addEventListener('click', () => {
      closeModal();
      closeUserModal();
    });
  });
}

async function initializeSession() {
  if (!state.token) {
    togglePages();
    return;
  }

  togglePages();
  try {
    await loadDashboard();
    await loadClients();
    await loadUsers();
  } catch (error) {
    redirectToLogin();
  }
}

registerEvents();
initializeSession();
