import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppSelector } from './app/hooks';
import { ToastProvider } from './components/Toast';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout, type TabDef } from './components/Layout';
import LandingPage from './pages/LandingPage';
import NuevaVentaPage from './pages/cajero/NuevaVentaPage';
import VentasPage from './pages/VentasPage';
import EstadisticasPage from './pages/EstadisticasPage';
import GastosPage from './pages/GastosPage';
import CategoriasProductosPage from './pages/admin/CategoriasProductosPage';
import UsuariosPage from './pages/admin/UsuariosPage';
import ConfigPage from './pages/admin/ConfigPage';

const TABS_CAJERO: TabDef[] = [
  { to: '/nueva-venta', icon: '🛒', label: 'Nueva Venta' },
  { to: '/ventas', icon: '📊', label: 'Ventas' },
];

const TABS_JEFE: TabDef[] = [
  { to: '/estadisticas', icon: '📈', label: 'Estadísticas' },
  { to: '/ventas', icon: '📊', label: 'Historial de Ventas' },
  { to: '/gastos', icon: '💰', label: 'Gastos/Compras' },
];

const TABS_ADMIN: TabDef[] = [
  { to: '/estadisticas', icon: '📈', label: 'Estadísticas' },
  { to: '/categorias', icon: '📦', label: 'Categorías y Productos' },
  { to: '/ventas', icon: '📊', label: 'Ventas' },
  { to: '/gastos', icon: '💰', label: 'Gastos/Compras' },
  { to: '/usuarios', icon: '👥', label: 'Usuarios' },
  { to: '/config', icon: '⚙️', label: 'Configuración' },
];

function Dashboard() {
  const role = useAppSelector((s) => s.auth.role);

  if (role === 'cajero') {
    return (
      <Layout tabs={TABS_CAJERO}>
        <Routes>
          <Route path="/nueva-venta" element={<NuevaVentaPage />} />
          <Route path="/ventas" element={<VentasPage />} />
          <Route path="*" element={<Navigate to="/nueva-venta" replace />} />
        </Routes>
      </Layout>
    );
  }

  if (role === 'jefe') {
    return (
      <Layout tabs={TABS_JEFE}>
        <Routes>
          <Route path="/estadisticas" element={<EstadisticasPage />} />
          <Route path="/ventas" element={<VentasPage />} />
          <Route path="/gastos" element={<GastosPage />} />
          <Route path="*" element={<Navigate to="/estadisticas" replace />} />
        </Routes>
      </Layout>
    );
  }

  // admin
  return (
    <Layout tabs={TABS_ADMIN}>
      <Routes>
        <Route path="/estadisticas" element={<EstadisticasPage />} />
        <Route path="/categorias" element={<CategoriasProductosPage />} />
        <Route path="/ventas" element={<VentasPage />} />
        <Route path="/gastos" element={<GastosPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/config" element={<ConfigPage />} />
        <Route path="*" element={<Navigate to="/estadisticas" replace />} />
      </Routes>
    </Layout>
  );
}

const HOME_BY_ROLE: Record<string, string> = {
  cajero: '/nueva-venta',
  jefe: '/estadisticas',
  admin: '/estadisticas',
};

/** Ruta raíz: si ya hay sesión, va directo al panel; si no, muestra la landing (con el login como sección). */
function RootRoute() {
  const { token, role } = useAppSelector((s) => s.auth);
  if (token) return <Navigate to={HOME_BY_ROLE[role || ''] || '/estadisticas'} replace />;
  return <LandingPage />;
}

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        {/* Compatibilidad con el antiguo enlace /login: ahora el login vive en /#login */}
        <Route path="/login" element={<Navigate to="/#login" replace />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<Dashboard />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}
