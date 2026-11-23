import { Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';

/** Página de acceso al panel, separada de la landing pública. */
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm fade-in">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-4 transition-colors"
        >
          ← Volver al inicio
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
