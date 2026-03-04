// DEPRECATED: Use /services/auth.js instead
// This file is kept for backward compatibility only

import { signup as apiSignup, login as apiLogin } from '../services/auth';

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function signUp(name, email, password) {
  try {
    await apiSignup(name, email, password);
    return { success: true, user: { name, email } };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function login(email, password) {
  try {
    const data = await apiLogin(email, password);
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
