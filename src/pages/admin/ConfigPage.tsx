import { useEffect, useState } from 'react';
import { useGetConfigQuery, useGetTokensApiQuery, useSetConfigMutation, useSetTokensApiMutation } from '../../services/api';
import { Spinner } from '../../components/Modal';
import { useToast } from '../../components/Toast';
import type { ComprobanteCfg, SistemaCfg } from '../../types';

type Seccion = 'boleta' | 'factura' | 'sistema' | 'apis';

const DEFAULT_COMP: ComprobanteCfg = { ruc: '', razonSocial: '', direccion: '', telefono: '', email: '', serie: '', correlativo: 1, leyenda: '' };
const DEFAULT_SIS: SistemaCfg = { pdfFolder: '', autoPrint: false, printerName: '', currency: 'S/', igv: 18, apisToken: '' };

export default function ConfigPage() {
  const [seccion, setSeccion] = useState<Seccion>('boleta');

  return (
    <div>
      <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-5">⚙️ Configuración</h2>
      <div className="flex gap-2 mb-5 flex-wrap">
        {(
          [
            ['boleta', '🧾 Boleta'],
            ['factura', '📄 Factura'],
            ['sistema', '⚙️ Sistema'],
            ['apis', '🔑 APIs DNI/RUC'],
          ] as [Seccion, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setSeccion(id)}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold border transition-colors ${
              seccion === id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {seccion === 'boleta' && <ComprobanteForm tipo="boleta" />}
      {seccion === 'factura' && <ComprobanteForm tipo="factura" />}
      {seccion === 'sistema' && <SistemaForm />}
      {seccion === 'apis' && <ApisForm />}
    </div>
  );
}

function ComprobanteForm({ tipo }: { tipo: 'boleta' | 'factura' }) {
  const { data, isLoading } = useGetConfigQuery(tipo);
  const [setConfig, { isLoading: saving }] = useSetConfigMutation();
  const toast = useToast();
  const [form, setForm] = useState<ComprobanteCfg>(DEFAULT_COMP);

  useEffect(() => {
    if (data) setForm({ ...DEFAULT_COMP, ...data });
  }, [data]);

  if (isLoading) return <Spinner label="Cargando..." />;

  const field = (key: keyof ComprobanteCfg, label: string, type = 'text') => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">{label}</label>
      <input
        type={type}
        value={form[key] as any}
        onChange={(e) => setForm({ ...form, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
        className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
      />
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 max-w-2xl">
      <h3 className="font-bold text-slate-800 mb-4">Datos de {tipo === 'boleta' ? 'Boleta' : 'Factura'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('ruc', 'RUC')}
        {field('razonSocial', 'Razón Social')}
        {field('direccion', 'Dirección')}
        {field('telefono', 'Teléfono')}
        {field('email', 'Email')}
        {field('serie', 'Serie')}
        {field('correlativo', 'Próximo correlativo', 'number')}
      </div>
      <div className="mt-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Leyenda del comprobante</label>
        <textarea
          value={form.leyenda}
          onChange={(e) => setForm({ ...form, leyenda: e.target.value })}
          rows={2}
          className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
        />
      </div>
      <button
        onClick={async () => {
          await setConfig({ tipo, data: form }).unwrap();
          toast('✅ Configuración guardada');
        }}
        disabled={saving}
        className="mt-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl text-sm"
      >
        {saving ? 'Guardando...' : 'Guardar Cambios'}
      </button>
    </div>
  );
}

function SistemaForm() {
  const { data, isLoading } = useGetConfigQuery('sistema');
  const [setConfig, { isLoading: saving }] = useSetConfigMutation();
  const toast = useToast();
  const [form, setForm] = useState<SistemaCfg>(DEFAULT_SIS);

  useEffect(() => {
    if (data) setForm({ ...DEFAULT_SIS, ...data });
  }, [data]);

  if (isLoading) return <Spinner label="Cargando..." />;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 max-w-xl">
      <h3 className="font-bold text-slate-800 mb-4">Configuración General</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Moneda</label>
          <input
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">IGV (%)</label>
          <input
            type="number"
            value={form.igv}
            onChange={(e) => setForm({ ...form, igv: Number(e.target.value) })}
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-4">
        La selección de impresora y carpeta de comprobantes se gestiona desde el sistema operativo al desplegar en un
        equipo específico (no aplica en un despliegue web general).
      </p>
      <button
        onClick={async () => {
          await setConfig({ tipo: 'sistema', data: form }).unwrap();
          toast('✅ Configuración guardada');
        }}
        disabled={saving}
        className="mt-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl text-sm"
      >
        {saving ? 'Guardando...' : 'Guardar Cambios'}
      </button>
    </div>
  );
}

function ApisForm() {
  const { data: tokens = [], isLoading } = useGetTokensApiQuery();
  const [setTokens, { isLoading: saving }] = useSetTokensApiMutation();
  const toast = useToast();
  const [token, setToken] = useState('');

  useEffect(() => {
    if (tokens[0]) setToken(tokens[0].token);
  }, [tokens]);

  if (isLoading) return <Spinner label="Cargando..." />;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 max-w-xl">
      <h3 className="font-bold text-slate-800 mb-2">🔑 Token de ApisPerú (DNI/RUC)</h3>
      <p className="text-xs text-slate-400 mb-4">
        Se usa para la búsqueda automática de clientes por DNI u RUC al registrar una venta.
      </p>
      <input
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Token de ApisPerú"
        className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
      />
      <button
        onClick={async () => {
          await setTokens([{ id: tokens[0]?.id || 'apisperu_principal', proveedor: 'apisperu', nombre: 'ApisPerú Principal', token, activo: true }]).unwrap();
          toast('✅ Token guardado');
        }}
        disabled={saving}
        className="mt-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl text-sm"
      >
        {saving ? 'Guardando...' : 'Guardar Token'}
      </button>
    </div>
  );
}
