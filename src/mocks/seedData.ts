import type { Categoria, ComprobanteCfg, Gasto, Producto, SistemaCfg, Usuario, Venta } from '../types';

// Mismos datos de demostración que siembra el backend NestJS (database/seed.service.ts)
// para que el frontend se pueda desarrollar y mostrar 100% funcional sin backend real.

let _uidCounter = 0;
export function uid(prefix = 'm'): string {
  _uidCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${_uidCounter}`;
}

export const USUARIOS_SEED: Usuario[] = [
  { id: uid('u'), nombre: 'Administrador', username: 'admin', rol: 'admin', activo: true, createdAt: new Date().toISOString() },
  { id: uid('u'), nombre: 'Cajero Principal', username: 'cajero', rol: 'cajero', activo: true, createdAt: new Date().toISOString() },
  { id: uid('u'), nombre: 'Jefe de Local', username: 'jefe', rol: 'jefe', activo: true, createdAt: new Date().toISOString() },
];

// Contraseñas de los usuarios mock (solo existen en el navegador, nunca en un backend real)
export const PASSWORDS_SEED: Record<string, string> = {
  admin: '1234',
  cajero: '0000',
  jefe: '5678',
};

const CATS_DEF: Array<[string, string]> = [
  ['Pizzas Clásicas', '🍕'],
  ['Pizzas Especiales', '⭐'],
  ['Pastas', '🍝'],
  ['Bebidas', '🥤'],
  ['Postres', '🍰'],
  ['Entradas', '🥗'],
];

export const CATEGORIAS_SEED: Categoria[] = CATS_DEF.map(([nombre, icon], i) => ({
  id: uid('cat'),
  nombre,
  icon,
  orden: i,
}));

function catId(nombre: string) {
  return CATEGORIAS_SEED.find((c) => c.nombre === nombre)!.id;
}

const PRODS_DEF: Array<[string, string, number]> = [
  ['Pizza Margherita Personal', 'Pizzas Clásicas', 18],
  ['Pizza Margherita Familiar', 'Pizzas Clásicas', 32],
  ['Pizza Napolitana Personal', 'Pizzas Clásicas', 20],
  ['Pizza Napolitana Familiar', 'Pizzas Clásicas', 36],
  ['Pizza Mozzarella Personal', 'Pizzas Clásicas', 19],
  ['Pizza Cuatro Quesos Personal', 'Pizzas Especiales', 25],
  ['Pizza Cuatro Quesos Familiar', 'Pizzas Especiales', 45],
  ['Pizza Hawaiana Personal', 'Pizzas Especiales', 22],
  ['Pizza Hawaiana Familiar', 'Pizzas Especiales', 40],
  ['Pizza BBQ Chicken Personal', 'Pizzas Especiales', 27],
  ['Pizza BBQ Chicken Familiar', 'Pizzas Especiales', 48],
  ['Pizza Pepperoni Personal', 'Pizzas Especiales', 24],
  ['Pizza Pepperoni Familiar', 'Pizzas Especiales', 42],
  ['Pasta Fettuccini Alfredo', 'Pastas', 22],
  ['Pasta Fettuccini Bolognesa', 'Pastas', 22],
  ['Pasta Penne Arrabbiata', 'Pastas', 20],
  ['Pasta Carbonara', 'Pastas', 24],
  ['Gaseosa Personal', 'Bebidas', 4],
  ['Gaseosa 1.5L', 'Bebidas', 8],
  ['Agua Mineral', 'Bebidas', 3],
  ['Jugo Natural', 'Bebidas', 7],
  ['Cerveza', 'Bebidas', 7],
  ['Tiramisú', 'Postres', 12],
  ['Brownie con Helado', 'Postres', 10],
  ['Panna Cotta', 'Postres', 10],
  ['Pan al Ajo (6 piezas)', 'Entradas', 8],
  ['Ensalada César', 'Entradas', 15],
  ['Alitas BBQ (8 piezas)', 'Entradas', 20],
];

export const PRODUCTOS_SEED: Producto[] = PRODS_DEF.map(([nombre, catNombre, precio]) => ({
  id: uid('prod'),
  nombre,
  precio,
  categoryId: catId(catNombre),
}));

function diasAtras(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function ventaDemo(diasAtrasN: number, horaH: number, total: number, metodo: string, delivery: boolean): Venta {
  const fecha = diasAtras(diasAtrasN);
  fecha.setHours(horaH, Math.floor(Math.random() * 59), 0, 0);
  const prods = PRODUCTOS_SEED.slice(0, 2 + Math.floor(Math.random() * 3));
  const items = prods.map((p) => ({
    productId: p.id,
    producto: p.nombre,
    precio: p.precio,
    categoryId: p.categoryId,
    cantidad: 1 + Math.floor(Math.random() * 2),
  }));
  const totalReal = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  return {
    id: uid('venta'),
    numeroComprobante: `B001-${String(Math.floor(Math.random() * 999) + 1).padStart(6, '0')}`,
    tipoComprobante: 'boleta',
    metodoPago: metodo,
    delivery,
    clienteNombre: delivery ? 'Cliente Delivery' : undefined,
    cajero: 'Cajero Principal',
    sunatEstado: 'PENDIENTE',
    items,
    total: Math.round(totalReal * (total ? 1 : 1) * 100) / 100,
    createdAt: fecha.toISOString(),
  };
}

export const VENTAS_SEED: Venta[] = [
  ventaDemo(0, 12, 0, 'efectivo', false),
  ventaDemo(0, 13, 0, 'yape', true),
  ventaDemo(0, 19, 0, 'tarjeta', false),
  ventaDemo(1, 20, 0, 'efectivo', true),
  ventaDemo(2, 13, 0, 'plin', false),
  ventaDemo(3, 21, 0, 'efectivo', false),
  ventaDemo(4, 14, 0, 'tarjeta', true),
  ventaDemo(5, 20, 0, 'efectivo', false),
  ventaDemo(6, 13, 0, 'yape', false),
];

export const GASTOS_SEED: Gasto[] = [
  {
    id: uid('gasto'),
    fecha: new Date().toISOString().slice(0, 10),
    insumo: 'Harina (25kg)',
    cantidad: '2 sacos',
    monto: 180,
    hora: '09:15',
    registradoPor: 'Jefe de Local',
    createdAt: new Date().toISOString(),
  },
  {
    id: uid('gasto'),
    fecha: new Date().toISOString().slice(0, 10),
    insumo: 'Queso Mozzarella',
    cantidad: '10kg',
    monto: 220,
    hora: '09:40',
    registradoPor: 'Jefe de Local',
    createdAt: new Date().toISOString(),
  },
];

export const BOLETA_CFG_SEED: ComprobanteCfg = {
  ruc: '20123456789',
  razonSocial: 'PIZZERÍA GABRIEL S.A.C.',
  direccion: 'Av. Principal 123, Miraflores, Lima',
  telefono: '01-234-5678',
  email: 'contacto@pizzeriagabriel.pe',
  serie: 'B001',
  correlativo: 1,
  leyenda: 'Gracias por su preferencia. ¡Vuelva pronto!',
};

export const FACTURA_CFG_SEED: ComprobanteCfg = {
  ...BOLETA_CFG_SEED,
  serie: 'F001',
  leyenda: 'Gracias por su preferencia.',
};

export const SISTEMA_CFG_SEED: SistemaCfg = {
  pdfFolder: '',
  autoPrint: false,
  printerName: '',
  currency: 'S/',
  igv: 18,
  apisToken: '',
};
