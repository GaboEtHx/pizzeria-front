import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import type { Rol } from '../types';

export function ProtectedRoute({ allow }: { allow?: Rol[] }) {
  const { token, role } = useAppSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  if (allow && role && !allow.includes(role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
