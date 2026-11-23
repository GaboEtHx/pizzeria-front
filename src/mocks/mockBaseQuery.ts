import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { loadDb, persist } from './mockDb';

// ID simple para registros nuevos creados desde el mock
function uid() {
  return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export interface ApiArgs {
  url: string;
  method?: string;
  body?: any;
}

interface MockSession {
  token: string;
  role: string;
  username: string;
}

const SESSION_KEY = 'pz_mock_session';

function getSessionFromToken(token: string): MockSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as MockSession;
    return s.token === token ? s : null;
  } catch {
    return null;
  }
}

function latency() {
  // Simula la red para que loaders/spinners se vean como en producción
  return new Promise((r) => setTimeout(r, 180 + Math.random() * 220));
}

function err(status: number, data: any) {
  return { error: { status, data } };
}

/**
 * baseQuery "falso": interpreta las mismas rutas /api/* que expone el backend
 * NestJS real, pero resolviendo todo contra datos en memoria/localStorage.
 * Así los componentes y los endpoints de RTK Query quedan escritos una sola
 * vez: para pasar a producción solo hay que cambiar VITE_USE_MOCKS a false.
 */
export const mockBaseQuery: BaseQueryFn<ApiArgs, unknown, { status: number; data: any }> = async (args) => {
  await latency();
  const db = loadDb();
  const method = (args.method || 'GET').toUpperCase();
  const url = args.url.replace(/^\/+/, '');
  const parts = url.split('?')[0].split('/').filter(Boolean);
  const body = args.body;

  const authHeader = (globalThis as any).__pz_authToken as string | undefined;
  const session = authHeader ? getSessionFromToken(authHeader) : null;

  try {
    // ── AUTH ──
    if (parts[0] === 'auth' && parts[1] === 'login' && method === 'POST') {
      const username = String(body?.username || '').trim().toLowerCase();
      const password = String(body?.password || '');
      const user = db.usuarios.find((u) => u.username === username && u.activo);
      if (!user || db.passwords[username] !== password) {
        return err(401, { detail: 'Usuario o contraseña incorrectos' });
      }
      const token = uid();
      localStorage.setItem(SESSION_KEY, JSON.stringify({ token, role: user.rol, username: user.username }));
      return {
        data: { ok: true, token, role: user.rol, nombre: user.nombre, username: user.username },
      };
    }
    if (parts[0] === 'auth' && parts[1] === 'logout') {
      localStorage.removeItem(SESSION_KEY);
      return { data: { ok: true } };
    }

    // Todo lo demás requiere "sesión" simulada
    if (!session) return err(401, { detail: 'Sesión no válida o expirada' });
    const requireAdmin = () => session.role === 'admin';
    const requireAdminOrJefe = () => session.role === 'admin' || session.role === 'jefe';

    // ── USUARIOS ──
    if (parts[0] === 'usuarios') {
      if (!requireAdmin()) return err(403, { detail: 'Solo el administrador puede realizar esta acción' });
      if (method === 'GET' && parts.length === 1) {
        return { data: db.usuarios.map(({ ...u }) => u) };
      }
      if (method === 'POST' && parts.length === 1) {
        const username = String(body.username).trim().toLowerCase();
        if (db.usuarios.some((u) => u.username === username)) {
          return err(400, { detail: 'Ya existe un usuario con ese nombre de usuario' });
        }
        const user = {
          id: uid(),
          nombre: body.nombre.trim(),
          username,
          rol: body.rol,
          activo: true,
          createdAt: new Date().toISOString(),
        };
        db.usuarios.push(user);
        db.passwords[username] = body.password;
        persist();
        return { data: { ok: true, id: user.id } };
      }
      if (method === 'PUT' && parts.length === 2) {
        const u = db.usuarios.find((x) => x.id === parts[1]);
        if (!u) return err(404, { detail: 'Usuario no encontrado' });
        u.nombre = body.nombre;
        u.rol = body.rol;
        if (body.activo !== undefined) u.activo = body.activo;
        if (body.password) db.passwords[u.username] = body.password;
        persist();
        return { data: { ok: true } };
      }
      if (method === 'DELETE' && parts.length === 2) {
        const u = db.usuarios.find((x) => x.id === parts[1]);
        if (u) u.activo = false;
        persist();
        return { data: { ok: true } };
      }
    }

    // ── CATEGORIAS ──
    if (parts[0] === 'categorias') {
      if (method === 'GET' && parts.length === 1) return { data: db.categorias };
      if (!requireAdmin()) return err(403, { detail: 'Solo el administrador puede realizar esta acción' });
      if (method === 'POST' && parts.length === 1) {
        const maxOrden = db.categorias.reduce((m, c) => Math.max(m, c.orden), 0);
        const cat = { id: uid(), nombre: body.nombre, icon: body.icon || '🍕', orden: maxOrden + 1 };
        db.categorias.push(cat);
        persist();
        return { data: { ok: true, id: cat.id } };
      }
      if (method === 'PUT' && parts.length === 2) {
        const c = db.categorias.find((x) => x.id === parts[1]);
        if (c) {
          c.nombre = body.nombre;
          c.icon = body.icon || '🍕';
        }
        persist();
        return { data: { ok: true } };
      }
      if (method === 'DELETE' && parts.length === 2) {
        db.categorias = db.categorias.filter((x) => x.id !== parts[1]);
        db.productos = db.productos.filter((p) => p.categoryId !== parts[1]);
        persist();
        return { data: { ok: true } };
      }
    }

    // ── PRODUCTOS ──
    if (parts[0] === 'productos') {
      if (method === 'GET' && parts.length === 1) return { data: db.productos };
      if (!requireAdmin()) return err(403, { detail: 'Solo el administrador puede realizar esta acción' });
      if (method === 'POST' && parts.length === 1) {
        const prod = { id: uid(), nombre: body.nombre, precio: Number(body.precio), categoryId: body.categoryId };
        db.productos.push(prod);
        persist();
        return { data: { ok: true, id: prod.id } };
      }
      if (method === 'PUT' && parts.length === 2) {
        const p = db.productos.find((x) => x.id === parts[1]);
        if (p) {
          p.nombre = body.nombre;
          p.precio = Number(body.precio);
          p.categoryId = body.categoryId;
        }
        persist();
        return { data: { ok: true } };
      }
      if (method === 'DELETE' && parts.length === 2) {
        db.productos = db.productos.filter((x) => x.id !== parts[1]);
        persist();
        return { data: { ok: true } };
      }
    }

    // ── VENTAS ──
    if (parts[0] === 'ventas') {
      if (method === 'GET' && parts.length === 1) return { data: db.ventas };
      if (method === 'POST' && parts.length === 1) {
        const tipo: 'boleta' | 'factura' = body.tipoComprobante === 'factura' ? 'factura' : 'boleta';
        const cfg = db.config[tipo];
        const n = cfg.correlativo || 1;
        cfg.correlativo = n + 1;
        const venta = {
          id: uid(),
          numeroComprobante: `${cfg.serie}-${String(n).padStart(6, '0')}`,
          tipoComprobante: tipo,
          metodoPago: body.metodoPago,
          delivery: !!body.delivery,
          deliveryDireccion: body.deliveryDireccion,
          deliveryReferencia: body.deliveryReferencia,
          deliveryContacto: body.deliveryContacto,
          deliveryNombre: body.deliveryNombre,
          clienteDocumento: body.clienteDocumento,
          clienteNombre: body.clienteNombre,
          clienteRazonSocial: body.clienteRazonSocial,
          cajero: body.cajero || session.username,
          sunatEstado: 'PENDIENTE',
          items: body.items,
          total: Number(body.total),
          createdAt: new Date().toISOString(),
        };
        db.ventas.push(venta);
        persist();
        return { data: { ok: true, id: venta.id, numeroComprobante: venta.numeroComprobante } };
      }
      if (method === 'DELETE' && parts.length === 2) {
        if (!requireAdminOrJefe()) return err(403, { detail: 'No tienes permisos para eliminar ventas' });
        db.ventas = db.ventas.filter((v) => v.id !== parts[1]);
        persist();
        return { data: { ok: true } };
      }
    }

    // ── GASTOS ──
    if (parts[0] === 'gastos') {
      if (method === 'GET' && parts.length === 1) return { data: db.gastos };
      if (method === 'POST' && parts.length === 1) {
        const now = new Date();
        const gasto = {
          id: uid(),
          fecha: body.fecha || now.toISOString().slice(0, 10),
          insumo: body.insumo,
          cantidad: body.cantidad,
          monto: Number(body.monto),
          hora: body.hora || now.toTimeString().slice(0, 5),
          registradoPor: body.registradoPor || session.username,
          createdAt: now.toISOString(),
        };
        db.gastos.push(gasto);
        persist();
        return { data: { ok: true, id: gasto.id } };
      }
      if (method === 'PUT' && parts.length === 2) {
        const g = db.gastos.find((x) => x.id === parts[1]);
        if (g) Object.assign(g, body);
        persist();
        return { data: { ok: true } };
      }
      if (method === 'DELETE' && parts.length === 2) {
        db.gastos = db.gastos.filter((x) => x.id !== parts[1]);
        persist();
        return { data: { ok: true } };
      }
    }

    // ── JORNADAS ──
    if (parts[0] === 'jornadas') {
      if (method === 'GET' && parts.length === 1) return { data: db.jornadas };
      if (method === 'GET' && parts.length === 2) return { data: db.jornadas[parts[1]] || {} };
      if (method === 'PUT' && parts.length === 2) {
        db.jornadas[parts[1]] = { fecha: parts[1], ...body };
        persist();
        return { data: { ok: true } };
      }
    }

    // ── CONFIG ──
    if (parts[0] === 'config') {
      const tipo = parts[1];
      if (parts.length === 3 && parts[2] === 'next-correlativo' && method === 'PUT') {
        const cfg = db.config[tipo as 'boleta' | 'factura'];
        const n = cfg.correlativo || 1;
        cfg.correlativo = n + 1;
        persist();
        return { data: { correlativo: n } };
      }
      if (method === 'GET') return { data: db.config[tipo as keyof typeof db.config] || {} };
      if (method === 'PUT') {
        if (!requireAdmin()) return err(403, { detail: 'Solo el administrador puede realizar esta acción' });
        db.config[tipo as keyof typeof db.config] = body;
        persist();
        return { data: { ok: true } };
      }
    }

    // ── TOKENS API ──
    if (parts[0] === 'tokens-api') {
      if (method === 'GET') return { data: db.apiTokens };
      if (method === 'PUT') {
        if (!requireAdmin()) return err(403, { detail: 'Solo el administrador puede realizar esta acción' });
        db.apiTokens = body;
        persist();
        return { data: { ok: true } };
      }
    }

    // ── CLIENTE CACHE ──
    if (parts[0] === 'cliente-cache') {
      if (method === 'GET') return { data: db.clienteCache[parts[1]] || {} };
      if (method === 'PUT') {
        db.clienteCache[parts[1]] = body;
        persist();
        return { data: { ok: true } };
      }
    }

    // ── PROXY DNI/RUC (simulado: devuelve un nombre de ejemplo) ──
    if (parts[0] === 'proxy' && (parts[1] === 'dni' || parts[1] === 'ruc')) {
      const numero = parts[2];
      if (parts[1] === 'dni') {
        return { data: { success: true, dni: numero, nombres: 'Cliente', apellidoPaterno: 'De Prueba', apellidoMaterno: 'Mock' } };
      }
      return { data: { success: true, ruc: numero, razonSocial: 'EMPRESA DE PRUEBA MOCK S.A.C.', estado: 'ACTIVO' } };
    }

    return err(404, { detail: `Ruta mock no implementada: ${method} /${url}` });
  } catch (e: any) {
    return err(500, { detail: e?.message || 'Error inesperado en el mock' });
  }
};
