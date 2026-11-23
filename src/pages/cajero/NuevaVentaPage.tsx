import { useMemo, useState } from 'react';
import { useGetCategoriasQuery, useGetProductosQuery, useCreateVentaMutation, useGetConfigQuery } from '../../services/api';
import { useAppSelector } from '../../app/hooks';
import { useToast } from '../../components/Toast';
import type { Producto, VentaItem } from '../../types';

const METODOS_PAGO = [
  { id: 'efectivo', label: '💵 Efectivo' },
  { id: 'tarjeta', label: '💳 Tarjeta' },
  { id: 'yape', label: '📱 Yape' },
  { id: 'plin', label: '📱 Plin' },
  { id: 'mixto', label: '🔀 Mixto' },
];

export default function NuevaVentaPage() {
  const { data: categorias = [] } = useGetCategoriasQuery();
  const { data: productos = [] } = useGetProductosQuery();
  const { data: sistemaCfg } = useGetConfigQuery('sistema');
  const [createVenta, { isLoading: guardando }] = useCreateVentaMutation();
  const { username } = useAppSelector((s) => s.auth);
  const toast = useToast();

  const currency = sistemaCfg?.currency || 'S/';

  const [items, setItems] = useState<VentaItem[]>([]);
  const [search, setSearch] = useState('');
  const [tipoComprobante, setTipoComprobante] = useState<'boleta' | 'factura'>('boleta');
  const [clienteDocumento, setClienteDocumento] = useState('');
  const [clienteNombre, setClienteNombre] = useState('');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [esDelivery, setEsDelivery] = useState(false);
  const [deliveryDireccion, setDeliveryDireccion] = useState('');
  const [deliveryContacto, setDeliveryContacto] = useState('');

  const total = useMemo(() => items.reduce((s, i) => s + i.precio * i.cantidad, 0), [items]);

  const resultados = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return [];
    return productos.filter((p) => p.nombre.toLowerCase().includes(q)).slice(0, 8);
  }, [search, productos]);

  const catNombre = (categoryId?: string) => categorias.find((c) => c.id === categoryId);

  const addProducto = (p: Producto) => {
    const cat = catNombre(p.categoryId);
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === p.id);
      if (existing) {
        return prev.map((i) => (i.productId === p.id ? { ...i, cantidad: i.cantidad + 1 } : i));
      }
      return [...prev, { productId: p.id, producto: p.nombre, precio: p.precio, categoryId: p.categoryId, categoria: cat?.nombre, cantidad: 1 }];
    });
    setSearch('');
  };

  const changeCantidad = (idx: number, cantidad: number) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, cantidad: Math.max(1, cantidad) } : it)));
  };

  const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));
  const clearOrder = () => setItems([]);

  const procesarVenta = async () => {
    if (items.length === 0) {
      toast('Agrega al menos un producto al pedido', 'err');
      return;
    }
    if (esDelivery && !deliveryDireccion.trim()) {
      toast('Ingresa la dirección de delivery', 'err');
      return;
    }
    try {
      const res = await createVenta({
        tipoComprobante,
        metodoPago,
        delivery: esDelivery,
        deliveryDireccion: esDelivery ? deliveryDireccion : undefined,
        deliveryContacto: esDelivery ? deliveryContacto : undefined,
        clienteDocumento: clienteDocumento || undefined,
        clienteNombre: clienteNombre || undefined,
        cajero: username || undefined,
        items,
        total,
      }).unwrap();
      toast(`✅ Venta registrada: ${res.numeroComprobante}`);
      clearOrder();
      setClienteDocumento('');
      setClienteNombre('');
      setDeliveryDireccion('');
      setDeliveryContacto('');
      setEsDelivery(false);
    } catch (e: any) {
      toast('Error al procesar la venta: ' + (e?.data?.detail || e.message), 'err');
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
      {/* Izquierda: búsqueda + pedido */}
      <div className="xl:col-span-3">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-3.5 mb-4 relative">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Buscar pizza, plato o bebida..."
              className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-slate-50/50"
            />
            {resultados.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 max-h-60 overflow-y-auto">
                {resultados.map((p) => {
                  const cat = catNombre(p.categoryId);
                  return (
                    <div
                      key={p.id}
                      onClick={() => addProducto(p)}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
                    >
                      <div className="font-medium text-gray-800 text-sm">{p.nombre}</div>
                      <div className="text-xs text-gray-400">
                        {cat ? `${cat.icon} ${cat.nombre}` : ''} ·{' '}
                        <span className="text-green-600 font-semibold">
                          {currency} {p.precio.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm">📋 Pedido actual</h3>
            </div>
            {items.length > 0 && (
              <button onClick={clearOrder} className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg px-2.5 py-1 font-medium transition-colors">
                🗑️ Limpiar
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <div className="text-4xl mb-2">🛒</div>
              <p className="text-sm">No hay items en el pedido</p>
              <p className="text-xs mt-0.5">Busca un producto arriba para agregarlo</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center bg-slate-50/60 border border-gray-200 rounded-xl p-2.5 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 text-sm truncate">{item.producto}</div>
                  <div className="text-xs text-gray-400">
                    {currency} {item.precio.toFixed(2)} c/u
                  </div>
                </div>
                <input
                  type="number"
                  min={1}
                  value={item.cantidad}
                  onChange={(e) => changeCantidad(idx, parseInt(e.target.value) || 1)}
                  className="w-14 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-emerald-700 w-20 text-right whitespace-nowrap">
                  {currency} {(item.precio * item.cantidad).toFixed(2)}
                </span>
                <button onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700 text-xs border border-red-200 rounded px-1.5 py-1">
                  ✕
                </button>
              </div>
            ))
          )}

          {items.length > 0 && (
            <div className="mt-4 pt-3.5 border-t border-slate-200 flex justify-between items-center bg-slate-50/80 -mx-4 -mb-4 p-4 rounded-b-2xl">
              <span className="font-black text-slate-700 text-sm uppercase tracking-wide">Total pedido:</span>
              <span className="text-2xl font-black text-emerald-700">
                {currency} {total.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Derecha: comprobante, cliente, pago, delivery */}
      <div className="xl:col-span-2 space-y-4">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-4">
          <h3 className="font-bold text-slate-800 text-sm mb-2.5">🧾 Tipo de Comprobante</h3>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setTipoComprobante('boleta')}
              className={`flex-1 py-2 rounded-lg border-2 font-semibold text-xs transition-colors ${
                tipoComprobante === 'boleta' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-300'
              }`}
            >
              🧾 Boleta (DNI)
            </button>
            <button
              onClick={() => setTipoComprobante('factura')}
              className={`flex-1 py-2 rounded-lg border-2 font-semibold text-xs transition-colors ${
                tipoComprobante === 'factura' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-300'
              }`}
            >
              📄 Factura (RUC)
            </button>
          </div>
          <div className="space-y-2">
            <input
              value={clienteDocumento}
              onChange={(e) => setClienteDocumento(e.target.value.replace(/\D/g, ''))}
              placeholder={tipoComprobante === 'boleta' ? 'DNI (8 dígitos)' : 'RUC (11 dígitos)'}
              maxLength={tipoComprobante === 'boleta' ? 8 : 11}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              placeholder={tipoComprobante === 'boleta' ? 'Nombre del cliente' : 'Razón social'}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-4">
          <h3 className="font-bold text-slate-800 text-sm mb-2.5">💳 Método de Pago</h3>
          <div className="grid grid-cols-3 gap-2">
            {METODOS_PAGO.map((m) => (
              <button
                key={m.id}
                onClick={() => setMetodoPago(m.id)}
                className={`py-2 rounded-lg border-2 text-xs font-semibold transition-colors ${
                  metodoPago === m.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-blue-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-4">
          <label className="flex items-center gap-2 cursor-pointer mb-2">
            <input type="checkbox" checked={esDelivery} onChange={(e) => setEsDelivery(e.target.checked)} className="w-4 h-4" />
            <span className="font-bold text-slate-800 text-sm">🛵 Es un pedido Delivery</span>
          </label>
          {esDelivery && (
            <div className="space-y-2 mt-2">
              <input
                value={deliveryDireccion}
                onChange={(e) => setDeliveryDireccion(e.target.value)}
                placeholder="Dirección de entrega"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                value={deliveryContacto}
                onChange={(e) => setDeliveryContacto(e.target.value)}
                placeholder="Teléfono de contacto"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        <button
          onClick={procesarVenta}
          disabled={guardando || items.length === 0}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow hover:shadow-md text-sm"
        >
          {guardando ? 'Procesando...' : `✅ Procesar Venta · ${currency} ${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
