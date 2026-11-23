import { useEffect, useState } from 'react';
import { LoginForm } from '../components/LoginForm';

/**
 * Landing pública de Pizzería Gabriel.
 *
 * Todo el contenido "de marca" (textos de Nosotros, menú, horarios, dirección,
 * fotos) está marcado con 📝 como placeholder — en cuanto Gabriel pase la
 * info real de su pizzería se reemplaza directo acá, sin tocar estructura
 * ni estilos.
 */

const NAV_LINKS = [
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#menu', label: 'Menú' },
  { href: '#contacto', label: 'Contacto' },
];

const FEATURES = [
  { icon: '🔥', title: 'Horno a leña', desc: 'Pizzas horneadas al estilo tradicional, con el sabor ahumado de siempre.' },
  { icon: '🌿', title: 'Ingredientes frescos', desc: 'Seleccionamos insumos del día para que cada pizza salga perfecta.' },
  { icon: '⚡', title: 'Entrega rápida', desc: 'Pedidos preparados y despachados en tiempo récord, calientitos.' },
  { icon: '⭐', title: 'Hecho con cariño', desc: 'Más de una receta familiar, perfeccionada con los años.' },
];

const MENU_CATEGORIAS = [
  { icon: '🍕', nombre: 'Pizzas Clásicas' },
  { icon: '⭐', nombre: 'Pizzas Especiales' },
  { icon: '🍝', nombre: 'Pastas' },
  { icon: '🥤', nombre: 'Bebidas' },
  { icon: '🍰', nombre: 'Postres' },
  { icon: '🥗', nombre: 'Entradas' },
];

const STATS = [
  { value: '+500', label: 'pizzas servidas' },
  { value: '4.9★', label: 'valoración promedio' },
  { value: '15 min', label: 'tiempo de entrega' },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Si llegamos con un #ancla (p. ej. redirigidos desde una ruta protegida
  // hacia /#login), hacemos scroll suave a esa sección al montar.
  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* ── Navbar ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/70">
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-red-500" />
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-amber-400 to-red-500 shadow flex items-center justify-center text-lg">
              🍕
            </div>
            <span className="font-black text-slate-800 tracking-tight">
              Pizzería <span className="text-blue-600">Gabriel</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#login"
              className="hidden sm:inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow"
            >
              Ingresar <span>→</span>
            </a>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600"
              aria-label="Abrir menú"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 flex flex-col gap-1 fade-in">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="px-2 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#login"
              onClick={() => setMenuOpen(false)}
              className="mt-1 text-center bg-blue-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl"
            >
              Ingresar →
            </a>
          </div>
        )}
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section id="top" className="relative overflow-hidden scroll-mt-16">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 -right-24 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="fade-in">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Sistema de pedidos y gestión
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.05]">
              La mejor pizza de la ciudad,{' '}
              <span className="bg-gradient-to-r from-blue-600 via-amber-500 to-red-600 bg-clip-text text-transparent">
                recién salida del horno
              </span>
            </h1>
            <p className="mt-5 text-slate-500 text-base sm:text-lg leading-relaxed max-w-lg">
              📝 Acá va una descripción corta y cálida de la pizzería: desde cuándo existen, qué las hace
              diferentes, y por qué la gente vuelve. Cuéntame la historia real y la dejamos lista.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#menu"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-sm hover:shadow"
              >
                Ver el menú 🍕
              </a>
              <a
                href="#login"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-6 py-3.5 rounded-xl border border-slate-200 transition-all"
              >
                Soy del equipo →
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-slate-900">{s.value}</div>
                  <div className="text-xs font-medium text-slate-400">{s.label} 📝</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative fade-in">
            <div className="aspect-square max-w-md mx-auto rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-amber-400 to-red-500 p-1.5 shadow-2xl shadow-amber-900/20">
              <div className="w-full h-full rounded-[2.2rem] bg-white flex items-center justify-center">
                <span className="text-[10rem] leading-none select-none drop-shadow-sm">🍕</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-2.5">
              <span className="text-2xl">🚴</span>
              <div className="leading-tight">
                <div className="text-sm font-black text-slate-800">Delivery express</div>
                <div className="text-[11px] text-slate-400 font-medium">📝 zona de reparto</div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-2.5">
              <span className="text-2xl">⭐</span>
              <div className="leading-tight">
                <div className="text-sm font-black text-slate-800">4.9 / 5.0</div>
                <div className="text-[11px] text-slate-400 font-medium">📝 reseñas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nosotros / features ──────────────────────────────── */}
      <section id="nosotros" className="py-20 bg-slate-50 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Nosotros</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">¿Por qué elegirnos?</h2>
            <p className="mt-3 text-slate-500">
              📝 Espacio para contar qué hace especial a tu pizzería — tradición, ingredientes, premios, años de barrio.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center text-2xl mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-800 mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Menú (teaser) ────────────────────────────────────── */}
      <section id="menu" className="py-20 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">Nuestro menú</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Algo para cada antojo</h2>
            <p className="mt-3 text-slate-500">
              📝 Cuando me pases tus productos y precios reales, aquí va el catálogo completo con fotos.
              Por ahora, estas son las categorías que ya tienes cargadas en el sistema:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {MENU_CATEGORIAS.map((c) => (
              <div
                key={c.nombre}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 text-center hover:border-blue-200 hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-2">{c.icon}</div>
                <div className="text-xs font-bold text-slate-700">{c.nombre}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contacto ─────────────────────────────────────────── */}
      <section id="contacto" className="py-20 bg-slate-900 text-white scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Visítanos</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">Te esperamos</h2>
            <p className="mt-3 text-slate-400 max-w-md">
              📝 Dirección, horario de atención y teléfono real van aquí apenas me los compartas.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <span className="text-slate-300 text-sm">📝 Av. Principal 123, tu distrito, tu ciudad</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🕒</span>
                <span className="text-slate-300 text-sm">📝 Lun a Dom · 12:00 pm – 11:00 pm</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">📞</span>
                <span className="text-slate-300 text-sm">📝 (01) 234-5678 / WhatsApp</span>
              </div>
            </div>
          </div>

          <div className="aspect-video rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 text-sm font-medium">
            📝 Mapa / ubicación próximamente
          </div>
        </div>
      </section>

      {/* ── Login ────────────────────────────────────────────── */}
      <section id="login" className="relative py-20 overflow-hidden scroll-mt-16">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Panel interno</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">¿Eres del equipo?</h2>
            <p className="mt-3 text-slate-500 max-w-md mx-auto lg:mx-0">
              Ingresa con tu usuario para gestionar pedidos, ventas, gastos y el catálogo de la pizzería.
            </p>
            <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-2.5">
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600">👑 Admin</span>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600">👔 Jefe</span>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600">🧑 Cajero</span>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <LoginForm />
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 via-amber-400 to-red-500 flex items-center justify-center text-sm">
              🍕
            </div>
            <span className="text-sm font-bold text-slate-700">Pizzería Gabriel</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            © {new Date().getFullYear()} Pizzería Gabriel · Sistema de Gestión
          </span>
        </div>
      </footer>
    </div>
  );
}
