import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Landing pública de Pizzería Gabriel (Nuevo Chimbote).
 * Contenido real tomado de la ficha de Google Maps y del material de marca
 * que pasó Gabriel. El login vive aparte, en /login — esta página es solo
 * presentación del negocio.
 */

const NAV_LINKS = [
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#menu', label: 'Menú' },
  { href: '#contacto', label: 'Contacto' },
];

const FEATURES = [
  { icon: '🍕', title: 'Masa casera original', desc: 'La misma receta de masa desde el 2005: crujiente, delgada y abundante.' },
  { icon: '🍅', title: 'Salsa de tomates frescos', desc: 'Procesada a base de tomates frescos y naturales, sin atajos.' },
  { icon: '👨‍🍳', title: 'Elaboración artesanal', desc: 'Ingredientes naturales, selectos y del día, preparados a mano.' },
  { icon: '❤️', title: '17 años de pasión', desc: '"La pasión por lo que hacemos" — nuestro único secreto desde siempre.' },
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
  { value: '17 años', label: 'desde enero del 2005' },
  { value: '86%', label: 'recomendado (7 opiniones)' },
  { value: '$', label: 'precio accesible' },
];

const DIRECCION = 'Urb. Las Casuarinas II Etapa Mz Q Lt 12, Nuevo Chimbote, Perú, 02710';
const MAPS_URL =
  'https://www.google.com.pe/maps/place/pizzeria+gabriel/data=!4m2!3m1!1s0x91ab85b201fe6635:0x9e7e4648abe45448?sa=X&ved=1t:242&ictx=111';
const MAPS_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(DIRECCION)}&output=embed`;

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* ── Navbar ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/70">
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-amber-400 to-red-500" />
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 shrink-0">
            <img src="/brand/logo-circular.png" alt="Pizzería Gabriel" className="w-9 h-9 rounded-full object-cover shadow" />
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
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow"
            >
              Ingresar <span>→</span>
            </Link>
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
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-1 text-center bg-blue-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl"
            >
              Ingresar →
            </Link>
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
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Desde el 2005 en Nuevo Chimbote
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.05]">
              La pasión por{' '}
              <span className="bg-gradient-to-r from-blue-600 via-amber-500 to-red-600 bg-clip-text text-transparent">
                lo que hacemos
              </span>
            </h1>
            <p className="mt-5 text-slate-500 text-base sm:text-lg leading-relaxed max-w-lg">
              Desde los primeros días de enero del 2005, hemos sabido preservar la receta original y única de
              nuestra masa casera: crujiente, delgada y abundante, acompañada de una salsa a base de tomates
              frescos y naturales. Elaborada artesanalmente, con ingredientes selectos y del día.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#menu"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-sm hover:shadow"
              >
                Ver el menú 🍕
              </a>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-6 py-3.5 rounded-xl border border-slate-200 transition-all"
              >
                📍 Cómo llegar
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-slate-900">{s.value}</div>
                  <div className="text-xs font-medium text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative fade-in">
            <div className="aspect-square max-w-md mx-auto rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-amber-400 to-red-500 p-2 shadow-2xl shadow-amber-900/20">
              <div className="w-full h-full rounded-[2.2rem] bg-black flex items-center justify-center overflow-hidden">
                <img src="/brand/logo-wordmark.png" alt="Pizzería Gabriel" className="w-4/5 object-contain" />
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-2.5">
              <span className="text-2xl">⭐</span>
              <div className="leading-tight">
                <div className="text-sm font-black text-slate-800">86% recomendado</div>
                <div className="text-[11px] text-slate-400 font-medium">7 opiniones en Google</div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-2.5">
              <span className="text-2xl">🕒</span>
              <div className="leading-tight">
                <div className="text-sm font-black text-slate-800">Abierto ahora</div>
                <div className="text-[11px] text-slate-400 font-medium">según Google Maps</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nosotros ─────────────────────────────────────────── */}
      <section id="nosotros" className="py-20 bg-slate-50 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Nosotros</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">17 años contigo</h2>
              <p className="mt-4 text-slate-500 leading-relaxed">
                Desde los primeros días de enero del 2005, año en que Gabriel Pizza llegó a Nuevo Chimbote, hemos
                sabido preservar, durante todo ese tiempo, la receta original y única de nuestra masa casera.
              </p>
              <p className="mt-3 text-slate-500 leading-relaxed">
                Con su textura crujiente, delgada, abundante y acompañada a la vez de una salsa procesada a base de
                tomates frescos y naturales, hacen de nuestra pizza una delicia que nos enorgullece compartir con
                ustedes. Elaborada artesanalmente, pizza Gabriel se prepara empleando ingredientes naturales,
                selectos y del día, apelando a nuestro único secreto: <em>"la pasión por lo que hacemos"</em>.
              </p>
            </div>
            <img
              src="/brand/historia-17-anios.png"
              alt="Gabriel, 17 años contigo"
              className="rounded-2xl shadow-xl border border-slate-200/60 w-full"
            />
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
              📝 Cuando me pases tus productos y precios reales, aquí va el catálogo completo con fotos. Por
              ahora, estas son las categorías que ya tienes cargadas en el sistema:
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
            <p className="mt-3 text-slate-400 max-w-md">86% de recomendación con 7 opiniones en Google Maps.</p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="text-slate-300 text-sm hover:text-white underline underline-offset-2">
                  {DIRECCION}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🕒</span>
                <span className="text-slate-300 text-sm">Abierto ahora · horario según Google Maps</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">⭐</span>
                <span className="text-slate-300 text-sm">86% recomendado por 7 opiniones</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">💲</span>
                <span className="text-slate-300 text-sm">Precio accesible ($)</span>
              </div>
            </div>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-white text-slate-900 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-all"
            >
              Ver en Google Maps →
            </a>
          </div>

          <div className="aspect-video rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
            <iframe
              title="Ubicación Pizzería Gabriel"
              src={MAPS_EMBED_URL}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src="/brand/logo-circular.png" alt="Pizzería Gabriel" className="w-7 h-7 rounded-full object-cover" />
            <span className="text-sm font-bold text-slate-700">Pizzería Gabriel</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            © {new Date().getFullYear()} Pizzería Gabriel · Nuevo Chimbote
          </span>
        </div>
      </footer>
    </div>
  );
}
