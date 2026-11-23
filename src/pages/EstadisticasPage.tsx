import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { useGetConfigQuery, useGetVentasQuery } from '../services/api';
import { Spinner } from '../components/Modal';

const COLORS = ['#1d4ed8', '#d97706', '#dc2626', '#059669', '#7c3aed'];

function startOf(period: 'hoy' | 'semana' | 'mes' | 'anio') {
  const d = new Date();
  if (period === 'hoy') {
    d.setHours(0, 0, 0, 0);
  } else if (period === 'semana') {
    d.setDate(d.getDate() - 7);
  } else if (period === 'mes') {
    d.setDate(d.getDate() - 30);
  } else {
    d.setFullYear(d.getFullYear() - 1);
  }
  return d;
}

export default function EstadisticasPage() {
  const { data: ventas = [], isLoading } = useGetVentasQuery();
  const { data: sistemaCfg } = useGetConfigQuery('sistema');
  const currency = sistemaCfg?.currency || 'S/';

  const stats = useMemo(() => {
    const now = new Date();
    const hoy = ventas.filter((v) => new Date(v.createdAt) >= startOf('hoy'));
    const semana = ventas.filter((v) => new Date(v.createdAt) >= startOf('semana'));
    const mes = ventas.filter((v) => new Date(v.createdAt) >= startOf('mes'));
    const anio = ventas.filter((v) => new Date(v.createdAt) >= startOf('anio'));

    const sum = (arr: typeof ventas) => arr.reduce((s, v) => s + v.total, 0);

    // Histograma últimos 7 días
    const dias: { label: string; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('es-PE', { weekday: 'short' });
      const total = ventas
        .filter((v) => new Date(v.createdAt).toDateString() === d.toDateString())
        .reduce((s, v) => s + v.total, 0);
      dias.push({ label, total: Math.round(total * 100) / 100 });
    }

    // Top productos
    const porProducto: Record<string, { nombre: string; cantidad: number; total: number }> = {};
    for (const v of ventas) {
      for (const it of v.items) {
        if (!porProducto[it.productId]) porProducto[it.productId] = { nombre: it.producto, cantidad: 0, total: 0 };
        porProducto[it.productId].cantidad += it.cantidad;
        porProducto[it.productId].total += it.precio * it.cantidad;
      }
    }
    const topProductos = Object.values(porProducto)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    // Delivery vs Local
    const deliveryCount = ventas.filter((v) => v.delivery).length;
    const localCount = ventas.length - deliveryCount;

    // Por método de pago
    const porMetodo: Record<string, number> = {};
    for (const v of ventas) porMetodo[v.metodoPago] = (porMetodo[v.metodoPago] || 0) + v.total;

    return {
      hoy: { count: hoy.length, total: sum(hoy) },
      semana: { count: semana.length, total: sum(semana) },
      mes: { count: mes.length, total: sum(mes) },
      anio: { count: anio.length, total: sum(anio) },
      dias,
      topProductos,
      deliveryVsLocal: [
        { name: 'Delivery', value: deliveryCount },
        { name: 'Local', value: localCount },
      ],
      porMetodo: Object.entries(porMetodo).map(([name, value]) => ({ name, value })),
    };
  }, [ventas]);

  if (isLoading) return <Spinner label="Calculando estadísticas..." />;

  const Card = ({ label, data }: { label: string; data: { count: number; total: number } }) => (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-800">
        {currency} {data.total.toFixed(2)}
      </p>
      <p className="text-xs text-slate-400 mt-1">{data.count} venta(s)</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800 tracking-tight">📈 Estadísticas</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card label="Hoy" data={stats.hoy} />
        <Card label="Semana" data={stats.semana} />
        <Card label="Mes" data={stats.mes} />
        <Card label="Año" data={stats.anio} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
          <h3 className="font-bold text-slate-800 text-sm mb-4">Ventas últimos 7 días</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.dias}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => [`${currency} ${v.toFixed(2)}`, 'Total']} />
              <Bar dataKey="total" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
          <h3 className="font-bold text-slate-800 text-sm mb-4">Top 5 productos más vendidos</h3>
          {stats.topProductos.length === 0 ? (
            <p className="text-sm text-slate-400 py-10 text-center">Aún no hay ventas registradas</p>
          ) : (
            <div className="space-y-2.5">
              {stats.topProductos.map((p, i) => (
                <div key={p.nombre} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{p.nombre}</p>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ width: `${(p.cantidad / stats.topProductos[0].cantidad) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500 shrink-0">{p.cantidad}u</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
          <h3 className="font-bold text-slate-800 text-sm mb-4">Delivery vs. Local</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={stats.deliveryVsLocal} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {stats.deliveryVsLocal.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
          <h3 className="font-bold text-slate-800 text-sm mb-4">Distribución por método de pago</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={stats.porMetodo} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {stats.porMetodo.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `${currency} ${v.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
