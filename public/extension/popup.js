const BASE_URL = 'https://api.mail.tm';

let state = {
  email: '',
  password: '',
  token: '',
  messages: [],
  currentMessageId: null
};

const $ = (selector) => document.querySelector(selector);

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2000);
}

function showLoading(show) {
  const indicator = $('#loading-indicator');
  if (show) indicator.classList.remove('hidden');
  else indicator.classList.add('hidden');
}

async function getDomains() {
  const response = await fetch(`${BASE_URL}/domains`);
  const data = await response.json();
  return data['hydra:member'];
}

async function createAccount(address, password) {
  const response = await fetch(`${BASE_URL}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, password })
  });
  return response.json();
}

async function getToken(address, password) {
  const response = await fetch(`${BASE_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, password })
  });
  return response.json();
}

async function getMessages(token) {
  const response = await fetch(`${BASE_URL}/messages`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  return data['hydra:member'];
}

async function getMessage(id, token) {
  const response = await fetch(`${BASE_URL}/messages/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
}

async function deleteMessage(id, token) {
  await fetch(`${BASE_URL}/messages/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
}

async function generateEmail() {
  $('#refresh-btn').disabled = true;
  $('#email-display').textContent = 'Generating...';
  
  try {
    const domains = await getDomains();
    if (!domains || domains.length === 0) throw new Error('No domains');
    
    const domain = domains[0].domain;
    const username = Math.random().toString(36).substring(2, 10);
    const password = Math.random().toString(36).substring(2, 15);
    const address = `${username}@${domain}`;
    
    await createAccount(address, password);
    const tokenData = await getToken(address, password);
    
    state.email = address;
    state.password = password;
    state.token = tokenData.token;
    state.messages = [];
    
    chrome.storage.local.set({
      email: address,
      password: password,
      token: tokenData.token
    });
    
    $('#email-display').textContent = address;
    renderMessages();
    showToast('New email generated!');
  } catch (error) {
    console.error(error);
    showToast('Generation failed');
    $('#email-display').textContent = 'Error - try again';
  } finally {
    $('#refresh-btn').disabled = false;
  }
}

async function fetchMessages() {
  if (!state.token) return;
  
  showLoading(true);
  try {
    state.messages = await getMessages(state.token);
    renderMessages();
  } catch (error) {
    console.error(error);
  } finally {
    showLoading(false);
  }
}

function renderMessages() {
  const list = $('#messages-list');
  
  if (state.messages.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        </div>
        <p>Listening for emails...</p>
      </div>
    `;
    return;
  }
  
  list.innerHTML = state.messages.map(msg => `
    <div class="message-item" data-id="${msg.id}">
      <div class="message-item-header">
        <span class="message-from">${msg.from.address}</span>
        <span class="message-time">${new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div class="message-subject ${msg.seen ? 'seen' : ''}">${msg.subject || '(No Subject)'}</div>
    </div>
  `).join('');
  
  list.querySelectorAll('.message-item').forEach(item => {
    item.addEventListener('click', () => viewMessage(item.dataset.id));
  });
}

async function viewMessage(id) {
  try {
    const msg = await getMessage(id, state.token);
    state.currentMessageId = id;
    
    $('#message-subject').textContent = msg.subject || '(No Subject)';
    $('#message-from').textContent = `From: ${msg.from.address}`;
    
    if (msg.html && msg.html[0]) {
      $('#message-body').innerHTML = msg.html[0];
    } else {
      $('#message-body').textContent = msg.text || 'No content';
    }
    
    $('#main-view').classList.add('hidden');
    $('#message-view').classList.remove('hidden');
  } catch (error) {
    showToast('Failed to load message');
  }
}

async function handleDelete() {
  if (!state.currentMessageId) return;
  
  try {
    await deleteMessage(state.currentMessageId, state.token);
    state.messages = state.messages.filter(m => m.id !== state.currentMessageId);
    state.currentMessageId = null;
    
    $('#message-view').classList.add('hidden');
    $('#main-view').classList.remove('hidden');
    renderMessages();
    showToast('Message deleted');
  } catch (error) {
    showToast('Delete failed');
  }
}

function copyEmail() {
  navigator.clipboard.writeText(state.email);
  showToast('Copied!');
}

function goBack() {
  state.currentMessageId = null;
  $('#message-view').classList.add('hidden');
  $('#main-view').classList.remove('hidden');
}

async function init() {
  chrome.storage.local.get(['email', 'password', 'token'], async (data) => {
    if (data.email && data.token) {
      state.email = data.email;
      state.password = data.password;
      state.token = data.token;
      $('#email-display').textContent = data.email;
      fetchMessages();
    } else {
      await generateEmail();
    }
  });
  
  $('#copy-btn').addEventListener('click', copyEmail);
  $('#refresh-btn').addEventListener('click', generateEmail);
  $('#check-btn').addEventListener('click', fetchMessages);
  $('#back-btn').addEventListener('click', goBack);
  $('#delete-btn').addEventListener('click', handleDelete);
  
  setInterval(fetchMessages, 10000);
}

document.addEventListener('DOMContentLoaded', init);
