export type Rol = 'admin' | 'jefe' | 'cajero';

export interface Usuario {
  id: string;
  nombre: string;
  username: string;
  rol: Rol;
  activo: boolean;
  createdAt: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  icon: string;
  orden: number;
}

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  categoryId: string;
}

export interface VentaItem {
  productId: string;
  producto: string;
  precio: number;
  categoryId?: string;
  categoria?: string;
  cantidad: number;
}

export interface Venta {
  id: string;
  numeroComprobante: string;
  tipoComprobante: 'boleta' | 'factura';
  metodoPago: string;
  delivery: boolean;
  deliveryDireccion?: string;
  deliveryReferencia?: string;
  deliveryContacto?: string;
  deliveryNombre?: string;
  clienteDocumento?: string;
  clienteNombre?: string;
  clienteRazonSocial?: string;
  cajero?: string;
  sunatEstado: string;
  items: VentaItem[];
  total: number;
  createdAt: string;
}

export interface Gasto {
  id: string;
  fecha: string;
  insumo: string;
  cantidad?: string;
  monto: number;
  hora?: string;
  registradoPor?: string;
  createdAt: string;
}

export interface ComprobanteCfg {
  ruc: string;
  razonSocial: string;
  direccion: string;
  telefono: string;
  email: string;
  serie: string;
  correlativo: number;
  leyenda: string;
}

export interface SistemaCfg {
  pdfFolder: string;
  autoPrint: boolean;
  printerName: string;
  currency: string;
  igv: number;
  apisToken: string;
}

export interface Jornada {
  fecha: string;
  estado: 'abierta' | 'finalizada';
  finalizadoAt?: string;
  reabiertoAt?: string;
  reabiertoPor?: string;
  [key: string]: any;
}

export interface ApiToken {
  id: string;
  proveedor: string;
  nombre: string;
  token: string;
  activo: boolean;
}

export interface ClienteCacheEntry {
  nombre?: string;
  razonSocial?: string;
  [key: string]: any;
}

export interface LoginResponse {
  ok: boolean;
  token: string;
  role: Rol;
  nombre: string;
  username: string;
}
