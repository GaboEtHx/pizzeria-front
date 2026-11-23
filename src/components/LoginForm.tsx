import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { useLoginMutation } from '../services/api';
import { credentialsSet } from '../features/auth/authSlice';

/**
 * Formulario de acceso, pensado para vivir dentro de la sección #login
 * de la landing (no es una página aparte). Mantiene la misma lógica de
 * autenticación que antes, con un look un poco más "producto" (tarjeta
 * flotante, estados de foco más suaves, microcopy de ayuda).
 */
export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Ingresa tu nombre de usuario.');
      return;
    }
    setError('');
    try {
      const res = await login({ username, password }).unwrap();
      dispatch(credentialsSet({ token: res.token, role: res.role, nombre: res.nombre, username: res.username }));
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err?.data?.detail || 'Usuario o contraseña incorrectos.');
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/80 p-8 w-full max-w-sm relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-amber-400 to-red-500" />

      <div className="text-center mb-6 pt-2">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-600 via-amber-400 to-red-500 shadow flex items-center justify-center text-3xl">
          🍕
        </div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Acceso al sistema</h2>
        <p className="text-slate-400 text-xs font-medium mt-1">Panel interno · Solo personal autorizado</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-xs font-medium fade-in">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Usuario</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="Ingresa tu nombre de usuario"
          autoComplete="username"
          autoCapitalize="none"
          className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
        />
      </div>

      <div className="mb-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Contraseña</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow hover:shadow-md flex items-center justify-center gap-2 text-sm"
      >
        <span>{isLoading ? 'Verificando...' : 'Ingresar al Sistema'}</span>
        {!isLoading && <span className="text-base">→</span>}
      </button>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-700 leading-relaxed">
        <strong>Demo:</strong> admin/1234 · jefe/5678 · cajero/0000
      </div>
    </form>
  );
}
