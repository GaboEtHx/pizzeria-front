import type { ApiToken, Categoria, ClienteCacheEntry, Gasto, Jornada, Producto, Usuario, Venta } from '../types';
import {
  BOLETA_CFG_SEED,
  CATEGORIAS_SEED,
  FACTURA_CFG_SEED,
  GASTOS_SEED,
  PASSWORDS_SEED,
  PRODUCTOS_SEED,
  SISTEMA_CFG_SEED,
  USUARIOS_SEED,
  VENTAS_SEED,
} from './seedData';

const STORAGE_KEY = 'pz_mock_db_v1';

export interface MockDbShape {
  usuarios: Usuario[];
  passwords: Record<string, string>; // username -> password (solo para el mock; nunca así en un backend real)
  categorias: Categoria[];
  productos: Producto[];
  ventas: Venta[];
  gastos: Gasto[];
  jornadas: Record<string, Jornada>;
  config: { auth: any; boleta: any; factura: any; sistema: any };
  apiTokens: ApiToken[];
  clienteCache: Record<string, ClienteCacheEntry>;
}

function seedFresh(): MockDbShape {
  return {
    usuarios: structuredClone(USUARIOS_SEED),
    passwords: structuredClone(PASSWORDS_SEED),
    categorias: structuredClone(CATEGORIAS_SEED),
    productos: structuredClone(PRODUCTOS_SEED),
    ventas: structuredClone(VENTAS_SEED),
    gastos: structuredClone(GASTOS_SEED),
    jornadas: {},
    config: {
      auth: { adminPin: '1234', cajeroPin: '0000', jefePin: '5678' },
      boleta: structuredClone(BOLETA_CFG_SEED),
      factura: structuredClone(FACTURA_CFG_SEED),
      sistema: structuredClone(SISTEMA_CFG_SEED),
    },
    apiTokens: [
      { id: 'apisperu_principal', proveedor: 'apisperu', nombre: 'ApisPerú Principal', token: '', activo: true },
    ],
    clienteCache: {},
  };
}

let _cache: MockDbShape | null = null;

export function loadDb(): MockDbShape {
  if (_cache) return _cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      _cache = JSON.parse(raw);
      return _cache!;
    }
  } catch {
    /* ignora datos corruptos y re-siembra */
  }
  _cache = seedFresh();
  persist();
  return _cache;
}

export function persist() {
  if (!_cache) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_cache));
  } catch {
    /* localStorage lleno o no disponible: continuar solo en memoria */
  }
}

export function resetMockDb() {
  _cache = seedFresh();
  persist();
}
