const BASE_URL = 'https://api.mail.tm';

export async function getDomains() {
  const response = await fetch(`${BASE_URL}/domains`);
  const data = await response.json();
  return data['hydra:member'];
}

export async function createAccount(address: string, password: string) {
  const response = await fetch(`${BASE_URL}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, password }),
  });
  return response.json();
}

export async function getToken(address: string, password: string) {
  const response = await fetch(`${BASE_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, password }),
  });
  return response.json();
}

export async function getMessages(token: string) {
  const response = await fetch(`${BASE_URL}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data['hydra:member'];
}

export async function getMessage(id: string, token: string) {
  const response = await fetch(`${BASE_URL}/messages/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
}

export async function deleteMessage(id: string, token: string) {
  await fetch(`${BASE_URL}/messages/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
