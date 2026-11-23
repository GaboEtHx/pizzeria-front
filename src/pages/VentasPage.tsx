import { useMemo, useState } from 'react';
import { useDeleteVentaMutation, useGetConfigQuery, useGetVentasQuery } from '../services/api';
import { useAppSelector } from '../app/hooks';
import { Spinner } from '../components/Modal';
import { useToast } from '../components/Toast';

type Filtro = 'hoy' | 'semana' | 'mes' | 'todo';

function dentroDeFiltro(fechaISO: string, filtro: Filtro) {
  const fecha = new Date(fechaISO);
  const ahora = new Date();
  if (filtro === 'todo') return true;
  if (filtro === 'hoy') return fecha.toDateString() === ahora.toDateString();
  const diffDias = (ahora.getTime() - fecha.getTime()) / 86400000;
  if (filtro === 'semana') return diffDias <= 7;
  if (filtro === 'mes') return diffDias <= 31;
  return true;
}

export default function VentasPage() {
  const { data: ventas = [], isLoading } = useGetVentasQuery();
  const { data: sistemaCfg } = useGetConfigQuery('sistema');
  const [deleteVenta] = useDeleteVentaMutation();
  const { role } = useAppSelector((s) => s.auth);
  const toast = useToast();

  const [filtro, setFiltro] = useState<Filtro>('hoy');
  const [busqueda, setBusqueda] = useState('');

  const currency = sistemaCfg?.currency || 'S/';
  const puedeEliminar = role === 'admin' || role === 'jefe';

  const filtradas = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return [...ventas]
      .filter((v) => dentroDeFiltro(v.createdAt, filtro))
      .filter(
        (v) =>
          !q ||
          v.numeroComprobante.toLowerCase().includes(q) ||
          (v.clienteNombre || '').toLowerCase().includes(q) ||
          (v.cajero || '').toLowerCase().includes(q),
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [ventas, filtro, busqueda]);

  const totalFiltrado = filtradas.reduce((s, v) => s + v.total, 0);

  const onDelete = async (id: string, numero: string) => {
    if (!confirm(`¿Eliminar la venta ${numero}? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteVenta(id).unwrap();
      toast('Venta eliminada');
    } catch (e: any) {
      toast('Error: ' + (e?.data?.detail || e.message), 'err');
    }
  };

  if (isLoading) return <Spinner label="Cargando ventas..." />;

  return (
    <div>
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">📊 Historial de Ventas</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {filtradas.length} venta(s) · Total {currency} {totalFiltrado.toFixed(2)}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['hoy', 'semana', 'mes', 'todo'] as Filtro[]).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                filtro === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
              }`}
            >
              {f === 'hoy' ? 'Hoy' : f === 'semana' ? '7 días' : f === 'mes' ? '30 días' : 'Todo'}
            </button>
          ))}
        </div>
      </div>

      <input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por comprobante, cliente o cajero..."
        className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
      />

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Comprobante</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Pago</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Cajero</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Total</th>
                {puedeEliminar && <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    Sin ventas en este rango
                  </td>
                </tr>
              ) : (
                filtradas.map((v) => (
                  <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700">
                      {v.tipoComprobante === 'boleta' ? '🧾' : '📄'} {v.numeroComprobante}
                      {v.delivery && <span className="ml-1 text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">🛵 Delivery</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{new Date(v.createdAt).toLocaleString('es-PE')}</td>
                    <td className="px-4 py-3 text-slate-700">{v.clienteNombre || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs capitalize">{v.metodoPago}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{v.cajero || '—'}</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-700">
                      {currency} {v.total.toFixed(2)}
                    </td>
                    {puedeEliminar && (
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onDelete(v.id, v.numeroComprobante)}
                          className="text-xs text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 rounded-lg px-2 py-1 transition-colors"
                        >
                          🗑️
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
