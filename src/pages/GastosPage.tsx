import { useMemo, useState } from 'react';
import { useCreateGastoMutation, useDeleteGastoMutation, useGetConfigQuery, useGetGastosQuery } from '../services/api';
import { useAppSelector } from '../app/hooks';
import { Spinner } from '../components/Modal';
import { useToast } from '../components/Toast';

export default function GastosPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [fecha, setFecha] = useState(today);
  const { data: gastos = [], isLoading } = useGetGastosQuery();
  const { data: sistemaCfg } = useGetConfigQuery('sistema');
  const [createGasto, { isLoading: guardando }] = useCreateGastoMutation();
  const [deleteGasto] = useDeleteGastoMutation();
  const { username } = useAppSelector((s) => s.auth);
  const toast = useToast();

  const currency = sistemaCfg?.currency || 'S/';

  const [insumo, setInsumo] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [monto, setMonto] = useState('');

  const delDia = useMemo(() => gastos.filter((g) => g.fecha === fecha), [gastos, fecha]);
  const totalDia = delDia.reduce((s, g) => s + g.monto, 0);

  const agregar = async () => {
    if (!insumo.trim() || !monto || Number(monto) <= 0) {
      toast('Ingresa el insumo y un monto válido', 'err');
      return;
    }
    try {
      await createGasto({ fecha, insumo, cantidad, monto: Number(monto), registradoPor: username || undefined }).unwrap();
      toast('✅ Gasto registrado');
      setInsumo('');
      setCantidad('');
      setMonto('');
    } catch (e: any) {
      toast('Error: ' + (e?.data?.detail || e.message), 'err');
    }
  };

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar este gasto?')) return;
    await deleteGasto(id);
    toast('Gasto eliminado');
  };

  if (isLoading) return <Spinner label="Cargando gastos..." />;

  return (
    <div>
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">💰 Gastos / Compras de Insumos</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Total del día: <span className="font-bold text-red-600">{currency} {totalDia.toFixed(2)}</span>
          </p>
        </div>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 mb-5">
        <h3 className="font-bold text-slate-800 text-sm mb-3">➕ Registrar nuevo gasto</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <input
            value={insumo}
            onChange={(e) => setInsumo(e.target.value)}
            placeholder="Insumo (ej. Harina)"
            className="sm:col-span-2 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            placeholder="Cantidad (ej. 2 sacos)"
            className="border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            type="number"
            min={0}
            step="0.10"
            placeholder={`Monto (${currency})`}
            className="border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={agregar}
          disabled={guardando}
          className="mt-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          {guardando ? 'Guardando...' : '+ Agregar Gasto'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Hora</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Insumo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Cantidad</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Registrado por</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Monto</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {delDia.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Sin gastos registrados este día
                  </td>
                </tr>
              ) : (
                delDia.map((g) => (
                  <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="px-4 py-3 text-slate-500 text-xs">{g.hora}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{g.insumo}</td>
                    <td className="px-4 py-3 text-slate-500">{g.cantidad || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{g.registradoPor || '—'}</td>
                    <td className="px-4 py-3 text-right font-bold text-red-600">
                      {currency} {g.monto.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => eliminar(g.id)}
                        className="text-xs text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 rounded-lg px-2 py-1"
                      >
                        🗑️
                      </button>
                    </td>
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
