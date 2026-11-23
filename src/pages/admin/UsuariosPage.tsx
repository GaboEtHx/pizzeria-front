import { useState } from 'react';
import {
  useCreateUsuarioMutation,
  useDeleteUsuarioMutation,
  useGetUsuariosQuery,
  useUpdateUsuarioMutation,
} from '../../services/api';
import { Modal, Spinner } from '../../components/Modal';
import { useToast } from '../../components/Toast';
import type { Rol, Usuario } from '../../types';

const ROL_BADGE: Record<Rol, { bg: string; icon: string; label: string }> = {
  admin: { bg: 'bg-red-50 text-red-700 border-red-200', icon: '👑', label: 'Administrador' },
  jefe: { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: '👔', label: 'Jefe' },
  cajero: { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: '🧑‍💼', label: 'Cajero' },
};

export default function UsuariosPage() {
  const { data: usuarios = [], isLoading } = useGetUsuariosQuery();
  const [createUsuario] = useCreateUsuarioMutation();
  const [updateUsuario] = useUpdateUsuarioMutation();
  const [deleteUsuario] = useDeleteUsuarioMutation();
  const toast = useToast();

  const [modal, setModal] = useState<{ editing?: Usuario } | null>(null);
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<Rol>('cajero');
  const [activo, setActivo] = useState(true);

  const openNuevo = () => {
    setNombre('');
    setUsername('');
    setPassword('');
    setRol('cajero');
    setActivo(true);
    setModal({});
  };

  const openEditar = (u: Usuario) => {
    setNombre(u.nombre);
    setUsername(u.username);
    setPassword('');
    setRol(u.rol);
    setActivo(u.activo);
    setModal({ editing: u });
  };

  const guardar = async () => {
    if (!nombre.trim()) return toast('El nombre es obligatorio', 'err');
    try {
      if (modal?.editing) {
        await updateUsuario({ id: modal.editing.id, data: { nombre, rol, activo, password: password || undefined } }).unwrap();
        toast(`✅ Usuario "${nombre}" actualizado`);
      } else {
        if (!username.trim() || !password) return toast('Completa usuario y contraseña', 'err');
        if (password.length < 4) return toast('La contraseña debe tener al menos 4 caracteres', 'err');
        await createUsuario({ nombre, username, password, rol }).unwrap();
        toast(`✅ Usuario "${nombre}" creado`);
      }
      setModal(null);
    } catch (e: any) {
      toast('Error: ' + (e?.data?.detail || e.message), 'err');
    }
  };

  const eliminar = async (u: Usuario) => {
    if (!confirm(`¿Eliminar al usuario "${u.nombre}"? Quedará inactivo.`)) return;
    await deleteUsuario(u.id);
    toast(`Usuario "${u.nombre}" eliminado`);
  };

  if (isLoading) return <Spinner label="Cargando usuarios..." />;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">👥 Gestión de Usuarios</h2>
          <p className="text-xs text-slate-400 mt-0.5">Crea cuentas, asigna roles y gestiona accesos al sistema</p>
        </div>
        <button onClick={openNuevo} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
          <span>+</span> <span>Nuevo Usuario</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Usuario</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Rol</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => {
                const badge = ROL_BADGE[u.rol];
                return (
                  <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-800">{u.nombre}</td>
                    <td className="px-4 py-3 font-mono text-slate-600 text-xs">{u.username}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                        {badge.icon} {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${
                          u.activo ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {u.activo ? '✅ Activo' : '⛔ Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => openEditar(u)} className="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg px-2 py-1">
                          ✏️ Editar
                        </button>
                        <button onClick={() => eliminar(u)} className="text-xs text-red-600 hover:text-red-800 border border-red-200 rounded-lg px-2 py-1">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
        <strong>💡 Nota:</strong> Los usuarios inician sesión con su usuario y contraseña propios.
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)}>
        <h3 className="text-lg font-bold text-slate-800 mb-5">{modal?.editing ? '✏️ Editar Usuario' : '👤 Nuevo Usuario'}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Nombre completo</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
          </div>
          {modal?.editing ? (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Usuario</label>
              <div className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm bg-slate-50 font-mono text-slate-500">{username}</div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Nombre de usuario</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Ej: maria.garcia o DNI" className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600" />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              {modal?.editing ? 'Nueva contraseña (opcional)' : 'Contraseña'}
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder={modal?.editing ? 'Dejar vacío para no cambiar' : 'Mínimo 4 caracteres'}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Rol</label>
            <select value={rol} onChange={(e) => setRol(e.target.value as Rol)} className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600">
              <option value="cajero">🧑‍💼 Cajero</option>
              <option value="jefe">👔 Jefe</option>
              <option value="admin">👑 Administrador</option>
            </select>
          </div>
          {modal?.editing && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Estado</label>
              <select value={activo ? '1' : '0'} onChange={(e) => setActivo(e.target.value === '1')} className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600">
                <option value="1">✅ Activo</option>
                <option value="0">⛔ Inactivo</option>
              </select>
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setModal(null)} className="flex-1 border border-slate-300 text-slate-700 py-2.5 rounded-xl text-sm font-medium">
            Cancelar
          </button>
          <button onClick={guardar} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-sm">
            {modal?.editing ? 'Guardar Cambios' : 'Crear Usuario'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
