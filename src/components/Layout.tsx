import { useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loggedOut } from '../features/auth/authSlice';

export interface TabDef {
  to: string;
  icon: string;
  label: string;
}

const ROLE_BADGE: Record<string, { icon: string; label: string }> = {
  admin: { icon: '👑', label: 'Admin' },
  jefe: { icon: '👔', label: 'Jefe' },
  cajero: { icon: '🧑', label: 'Cajero' },
};

export function Layout({ tabs, children }: { tabs: TabDef[]; children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { role, nombre } = useAppSelector((s) => s.auth);
  const badge = ROLE_BADGE[role || 'cajero'];

  const doLogout = () => dispatch(loggedOut());

  return (
    <div className="min-h-screen">
      {/* Overlay móvil */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-[45]" onClick={() => setDrawerOpen(false)} />
      )}

      {/* Drawer lateral móvil */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-[46] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-red-500 shrink-0" />
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 shrink-0">
          <div className="leading-tight">
            <span className="font-black text-slate-800 text-base tracking-tight block">
              Pizzería <span className="text-blue-600">Gabriel</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Control &amp; Ventas</span>
          </div>
          <button onClick={() => setDrawerOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100">
            ✕
          </button>
        </div>
        <div className="px-4 py-3 border-b border-slate-100 shrink-0">
          <span className="inline-flex items-center gap-1.5 text-xs bg-amber-50 text-amber-900 border border-amber-200/80 font-semibold px-2.5 py-1 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {badge.icon} {badge.label}
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-2">Secciones</p>
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              onClick={() => setDrawerOpen(false)}
              className={({ isActive }) =>
                `w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-semibold transition-all ${
                  isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'
                }`
              }
            >
              <span className="text-base w-6 text-center">{t.icon}</span>
              <span>{t.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-slate-200 shrink-0">
          <button
            onClick={doLogout}
            className="w-full text-xs font-semibold text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg px-3 py-2 transition-all"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <header className="bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200 sticky top-0 z-40">
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-red-500" />
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-all shadow-sm shrink-0"
            aria-label="Abrir menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="leading-tight">
              <span className="font-black text-slate-800 text-base sm:text-lg tracking-tight block">
                Pizzería <span className="text-blue-600">Gabriel</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase hidden sm:block">
                {nombre}
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex gap-1.5 flex-wrap flex-1 justify-center">
            {tabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-700/20' : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'
                  }`
                }
              >
                {t.icon} {t.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs bg-amber-50 text-amber-900 border border-amber-200/80 font-semibold px-2.5 py-1 rounded-lg hidden md:inline-flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {badge.icon} {badge.label}
            </span>
            <button
              onClick={doLogout}
              className="hidden lg:block text-xs font-semibold text-slate-500 hover:text-red-600 bg-white hover:bg-red-50/80 border border-slate-200 hover:border-red-200 rounded-lg px-3 py-1.5 transition-all shadow-2xs"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 fade-in">{children}</main>
    </div>
  );
}
