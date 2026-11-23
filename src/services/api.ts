import { createApi, fetchBaseQuery, type BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';
import { mockBaseQuery } from '../mocks/mockBaseQuery';
import type {
  ApiToken,
  Categoria,
  ClienteCacheEntry,
  ComprobanteCfg,
  Gasto,
  Jornada,
  LoginResponse,
  Producto,
  SistemaCfg,
  Usuario,
  Venta,
} from '../types';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

const realBaseQuery = fetchBaseQuery({
  baseUrl: '/api/',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

// Selecciona en tiempo de ejecución el motor del API: datos simulados (mock,
// por defecto) o el backend NestJS real. Los endpoints de abajo no cambian.
const dynamicBaseQuery: BaseQueryFn = (args, api, extraOptions) =>
  USE_MOCKS ? mockBaseQuery(args as any, api, extraOptions) : realBaseQuery(args as any, api, extraOptions);

export const api = createApi({
  reducerPath: 'api',
  baseQuery: dynamicBaseQuery,
  tagTypes: ['Usuarios', 'Categorias', 'Productos', 'Ventas', 'Gastos', 'Jornadas', 'Config', 'Tokens'],
  endpoints: (builder) => ({
    // ── AUTH ──
    login: builder.mutation<LoginResponse, { username: string; password: string }>({
      query: (body) => ({ url: 'auth/login', method: 'POST', body }),
    }),

    // ── USUARIOS ──
    getUsuarios: builder.query<Usuario[], void>({
      query: () => ({ url: 'usuarios' }),
      providesTags: ['Usuarios'],
    }),
    createUsuario: builder.mutation<{ ok: boolean; id: string }, Partial<Usuario> & { password: string }>({
      query: (body) => ({ url: 'usuarios', method: 'POST', body }),
      invalidatesTags: ['Usuarios'],
    }),
    updateUsuario: builder.mutation<{ ok: boolean }, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `usuarios/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Usuarios'],
    }),
    deleteUsuario: builder.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `usuarios/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Usuarios'],
    }),

    // ── CATEGORÍAS ──
    getCategorias: builder.query<Categoria[], void>({
      query: () => ({ url: 'categorias' }),
      providesTags: ['Categorias'],
    }),
    createCategoria: builder.mutation<{ ok: boolean; id: string }, { nombre: string; icon?: string }>({
      query: (body) => ({ url: 'categorias', method: 'POST', body }),
      invalidatesTags: ['Categorias'],
    }),
    updateCategoria: builder.mutation<{ ok: boolean }, { id: string; nombre: string; icon?: string }>({
      query: ({ id, ...body }) => ({ url: `categorias/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Categorias'],
    }),
    deleteCategoria: builder.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `categorias/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Categorias', 'Productos'],
    }),

    // ── PRODUCTOS ──
    getProductos: builder.query<Producto[], void>({
      query: () => ({ url: 'productos' }),
      providesTags: ['Productos'],
    }),
    createProducto: builder.mutation<{ ok: boolean; id: string }, { nombre: string; precio: number; categoryId: string }>({
      query: (body) => ({ url: 'productos', method: 'POST', body }),
      invalidatesTags: ['Productos'],
    }),
    updateProducto: builder.mutation<{ ok: boolean }, { id: string; nombre: string; precio: number; categoryId: string }>({
      query: ({ id, ...body }) => ({ url: `productos/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Productos'],
    }),
    deleteProducto: builder.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `productos/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Productos'],
    }),

    // ── VENTAS ──
    getVentas: builder.query<Venta[], void>({
      query: () => ({ url: 'ventas' }),
      providesTags: ['Ventas'],
    }),
    createVenta: builder.mutation<{ ok: boolean; id: string; numeroComprobante: string }, Partial<Venta>>({
      query: (body) => ({ url: 'ventas', method: 'POST', body }),
      invalidatesTags: ['Ventas'],
    }),
    deleteVenta: builder.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `ventas/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Ventas'],
    }),

    // ── GASTOS ──
    getGastos: builder.query<Gasto[], void>({
      query: () => ({ url: 'gastos' }),
      providesTags: ['Gastos'],
    }),
    createGasto: builder.mutation<{ ok: boolean; id: string }, Partial<Gasto>>({
      query: (body) => ({ url: 'gastos', method: 'POST', body }),
      invalidatesTags: ['Gastos'],
    }),
    updateGasto: builder.mutation<{ ok: boolean }, { id: string; data: Partial<Gasto> }>({
      query: ({ id, data }) => ({ url: `gastos/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['Gastos'],
    }),
    deleteGasto: builder.mutation<{ ok: boolean }, string>({
      query: (id) => ({ url: `gastos/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Gastos'],
    }),

    // ── JORNADAS ──
    getJornadas: builder.query<Record<string, Jornada>, void>({
      query: () => ({ url: 'jornadas' }),
      providesTags: ['Jornadas'],
    }),
    setJornada: builder.mutation<{ ok: boolean }, { fecha: string; data: Partial<Jornada> }>({
      query: ({ fecha, data }) => ({ url: `jornadas/${fecha}`, method: 'PUT', body: data }),
      invalidatesTags: ['Jornadas'],
    }),

    // ── CONFIG ──
    getConfig: builder.query<any, 'boleta' | 'factura' | 'sistema' | 'auth'>({
      query: (tipo) => ({ url: `config/${tipo}` }),
      providesTags: ['Config'],
    }),
    setConfig: builder.mutation<{ ok: boolean }, { tipo: 'boleta' | 'factura' | 'sistema' | 'auth'; data: ComprobanteCfg | SistemaCfg | any }>({
      query: ({ tipo, data }) => ({ url: `config/${tipo}`, method: 'PUT', body: data }),
      invalidatesTags: ['Config'],
    }),

    // ── TOKENS API (DNI/RUC) ──
    getTokensApi: builder.query<ApiToken[], void>({
      query: () => ({ url: 'tokens-api' }),
      providesTags: ['Tokens'],
    }),
    setTokensApi: builder.mutation<{ ok: boolean }, ApiToken[]>({
      query: (tokens) => ({ url: 'tokens-api', method: 'PUT', body: tokens }),
      invalidatesTags: ['Tokens'],
    }),

    // ── DNI/RUC ──
    consultarDni: builder.query<any, { numero: string; token: string }>({
      query: ({ numero, token }) => ({ url: `proxy/dni/${numero}?token=${encodeURIComponent(token)}` }),
    }),
    consultarRuc: builder.query<any, { numero: string; token: string }>({
      query: ({ numero, token }) => ({ url: `proxy/ruc/${numero}?token=${encodeURIComponent(token)}` }),
    }),
    getClienteCache: builder.query<ClienteCacheEntry, string>({
      query: (docKey) => ({ url: `cliente-cache/${docKey}` }),
    }),
    setClienteCache: builder.mutation<{ ok: boolean }, { docKey: string; data: ClienteCacheEntry }>({
      query: ({ docKey, data }) => ({ url: `cliente-cache/${docKey}`, method: 'PUT', body: data }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetUsuariosQuery,
  useCreateUsuarioMutation,
  useUpdateUsuarioMutation,
  useDeleteUsuarioMutation,
  useGetCategoriasQuery,
  useCreateCategoriaMutation,
  useUpdateCategoriaMutation,
  useDeleteCategoriaMutation,
  useGetProductosQuery,
  useCreateProductoMutation,
  useUpdateProductoMutation,
  useDeleteProductoMutation,
  useGetVentasQuery,
  useCreateVentaMutation,
  useDeleteVentaMutation,
  useGetGastosQuery,
  useCreateGastoMutation,
  useUpdateGastoMutation,
  useDeleteGastoMutation,
  useGetJornadasQuery,
  useSetJornadaMutation,
  useGetConfigQuery,
  useSetConfigMutation,
  useGetTokensApiQuery,
  useSetTokensApiMutation,
  useLazyConsultarDniQuery,
  useLazyConsultarRucQuery,
} = api;
