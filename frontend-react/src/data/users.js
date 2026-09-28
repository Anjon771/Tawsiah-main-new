const USERS_KEY = 'Users';

export function getUsers() {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveUser(newUser) {
  const users = getUsers();
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUserByEmail(email) {
  const users = getUsers();
  return users.find((u) => u.email === email) || null;
}

export function emailExists(email) {
  return findUserByEmail(email) !== null;
}