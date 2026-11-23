import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Rol } from '../../types';

export interface AuthState {
  token: string | null;
  role: Rol | null;
  nombre: string | null;
  username: string | null;
}

const STORAGE_KEY = 'pz_auth';

function loadInitialState(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignorar */
  }
  return { token: null, role: null, nombre: null, username: null };
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    credentialsSet(state, action: PayloadAction<AuthState>) {
      Object.assign(state, action.payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      (globalThis as any).__pz_authToken = state.token;
    },
    loggedOut(state) {
      state.token = null;
      state.role = null;
      state.nombre = null;
      state.username = null;
      localStorage.removeItem(STORAGE_KEY);
      (globalThis as any).__pz_authToken = undefined;
    },
  },
});

// Sincroniza el token en una variable global para que el mock de RTK Query
// (que no tiene acceso directo al store) pueda simular la sesión autenticada.
(globalThis as any).__pz_authToken = loadInitialState().token;

export const { credentialsSet, loggedOut } = authSlice.actions;
export default authSlice.reducer;
