import { useState } from 'react';
import {
  useCreateCategoriaMutation,
  useCreateProductoMutation,
  useDeleteCategoriaMutation,
  useDeleteProductoMutation,
  useGetCategoriasQuery,
  useGetConfigQuery,
  useGetProductosQuery,
  useUpdateProductoMutation,
} from '../../services/api';
import { Modal, Spinner } from '../../components/Modal';
import { useToast } from '../../components/Toast';

const ICONOS = ['🍕', '⭐', '🍝', '🥤', '🍰', '🥗', '🍔', '🌮', '🍟', '🥙'];

export default function CategoriasProductosPage() {
  const { data: categorias = [], isLoading: loadingCats } = useGetCategoriasQuery();
  const { data: productos = [], isLoading: loadingProds } = useGetProductosQuery();
  const { data: sistemaCfg } = useGetConfigQuery('sistema');
  const [createCategoria] = useCreateCategoriaMutation();
  const [deleteCategoria] = useDeleteCategoriaMutation();
  const [createProducto] = useCreateProductoMutation();
  const [updateProducto] = useUpdateProductoMutation();
  const [deleteProducto] = useDeleteProductoMutation();
  const toast = useToast();
  const currency = sistemaCfg?.currency || 'S/';

  const [catModal, setCatModal] = useState(false);
  const [catNombre, setCatNombre] = useState('');
  const [catIcon, setCatIcon] = useState('🍕');

  const [prodModal, setProdModal] = useState<{ id?: string } | null>(null);
  const [prodNombre, setProdNombre] = useState('');
  const [prodPrecio, setProdPrecio] = useState('');
  const [prodCategoryId, setProdCategoryId] = useState('');

  const openNuevoProducto = (categoryId?: string) => {
    setProdNombre('');
    setProdPrecio('');
    setProdCategoryId(categoryId || categorias[0]?.id || '');
    setProdModal({});
  };

  const openEditarProducto = (p: (typeof productos)[number]) => {
    setProdNombre(p.nombre);
    setProdPrecio(String(p.precio));
    setProdCategoryId(p.categoryId);
    setProdModal({ id: p.id });
  };

  const guardarCategoria = async () => {
    if (!catNombre.trim()) return toast('Ingresa un nombre', 'err');
    try {
      await createCategoria({ nombre: catNombre, icon: catIcon }).unwrap();
      toast('✅ Categoría creada');
      setCatModal(false);
      setCatNombre('');
    } catch (e: any) {
      toast('Error: ' + (e?.data?.detail || e.message), 'err');
    }
  };

  const guardarProducto = async () => {
    if (!prodNombre.trim() || !prodPrecio || !prodCategoryId) return toast('Completa todos los campos', 'err');
    try {
      const body = { nombre: prodNombre, precio: Number(prodPrecio), categoryId: prodCategoryId };
      if (prodModal?.id) {
        await updateProducto({ id: prodModal.id, ...body }).unwrap();
        toast('✅ Producto actualizado');
      } else {
        await createProducto(body).unwrap();
        toast('✅ Producto creado');
      }
      setProdModal(null);
    } catch (e: any) {
      toast('Error: ' + (e?.data?.detail || e.message), 'err');
    }
  };

  if (loadingCats || loadingProds) return <Spinner label="Cargando catálogo..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">📦 Categorías y Productos</h2>
        <div className="flex gap-2">
          <button onClick={() => setCatModal(true)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-sm font-bold transition-colors">
            + Categoría
          </button>
          <button onClick={() => openNuevoProducto()} className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-sm font-bold transition-colors">
            + Producto
          </button>
        </div>
      </div>

      {categorias.map((cat) => {
        const prods = productos.filter((p) => p.categoryId === cat.id);
        return (
          <div key={cat.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <span className="text-lg">{cat.icon}</span> {cat.nombre}
                <span className="text-xs font-normal text-slate-400">({prods.length})</span>
              </h3>
              <div className="flex gap-1.5">
                <button onClick={() => openNuevoProducto(cat.id)} className="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg px-2 py-1">
                  + Producto
                </button>
                <button
                  onClick={async () => {
                    if (!confirm(`¿Eliminar "${cat.nombre}" y todos sus productos?`)) return;
                    await deleteCategoria(cat.id);
                    toast('Categoría eliminada');
                  }}
                  className="text-xs text-red-600 hover:text-red-800 border border-red-200 rounded-lg px-2 py-1"
                >
                  🗑️
                </button>
              </div>
            </div>
            {prods.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">Sin productos en esta categoría</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {prods.map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-slate-50/70 border border-slate-100 rounded-xl px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{p.nombre}</p>
                      <p className="text-xs text-emerald-700 font-bold">
                        {currency} {p.precio.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => openEditarProducto(p)} className="text-xs text-blue-600 border border-blue-200 rounded px-1.5 py-0.5">
                        ✏️
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
                          await deleteProducto(p.id);
                          toast('Producto eliminado');
                        }}
                        className="text-xs text-red-600 border border-red-200 rounded px-1.5 py-0.5"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Modal nueva categoría */}
      <Modal open={catModal} onClose={() => setCatModal(false)}>
        <h3 className="text-lg font-bold text-slate-800 mb-4">📦 Nueva Categoría</h3>
        <input
          value={catNombre}
          onChange={(e) => setCatNombre(e.target.value)}
          placeholder="Nombre de la categoría"
          className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
        />
        <div className="flex flex-wrap gap-2 mb-5">
          {ICONOS.map((icon) => (
            <button
              key={icon}
              onClick={() => setCatIcon(icon)}
              className={`w-10 h-10 rounded-xl border-2 text-lg flex items-center justify-center ${
                catIcon === icon ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => setCatModal(false)} className="flex-1 border border-slate-300 text-slate-700 py-2.5 rounded-xl text-sm font-medium">
            Cancelar
          </button>
          <button onClick={guardarCategoria} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-sm">
            Crear
          </button>
        </div>
      </Modal>

      {/* Modal producto */}
      <Modal open={!!prodModal} onClose={() => setProdModal(null)}>
        <h3 className="text-lg font-bold text-slate-800 mb-4">{prodModal?.id ? '✏️ Editar' : '🍕 Nuevo'} Producto</h3>
        <div className="space-y-3 mb-5">
          <input
            value={prodNombre}
            onChange={(e) => setProdNombre(e.target.value)}
            placeholder="Nombre del producto"
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
          <input
            value={prodPrecio}
            onChange={(e) => setProdPrecio(e.target.value)}
            type="number"
            min={0}
            step="0.10"
            placeholder={`Precio (${currency})`}
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
          <select
            value={prodCategoryId}
            onChange={(e) => setProdCategoryId(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          >
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setProdModal(null)} className="flex-1 border border-slate-300 text-slate-700 py-2.5 rounded-xl text-sm font-medium">
            Cancelar
          </button>
          <button onClick={guardarProducto} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-sm">
            Guardar
          </button>
        </div>
      </Modal>
    </div>
  );
}
