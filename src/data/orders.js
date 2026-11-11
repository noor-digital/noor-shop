export const orderStatuses = [
  { key: 'pending', label: 'En attente', tone: 'warning' },
  { key: 'confirmed', label: 'Confirmée', tone: 'info' },
  { key: 'preparing', label: 'En préparation', tone: 'info' },
  { key: 'ready', label: 'Prête', tone: 'success' },
  { key: 'completed', label: 'Terminée', tone: 'success' },
  { key: 'cancelled', label: 'Annulée', tone: 'danger' },
];

export const paymentStatuses = [
  { key: 'unpaid', label: 'Non payé', tone: 'warning' },
  { key: 'paid', label: 'Payé', tone: 'success' },
  { key: 'refunded', label: 'Remboursé', tone: 'muted' },
];

export const orders = [
  {
    id: 'NS-2026-1041',
    storeSlug: 'maam-couture',
    date: '2026-11-10T09:32:00',
    customer: { name: 'Awa Diallo', phone: '+221 77 820 11 22', address: 'Mermoz, Dakar' },
    items: [
      { productId: 'p-boubou-wax', name: 'Boubou wax Linguère', variant: 'Taille M · Noir', price: 36500, quantity: 1 },
      { productId: 'p-foulard-indigo', name: 'Foulard indigo', variant: 'Unique', price: 12000, quantity: 1 },
    ],
    delivery: 2000,
    total: 50500,
    status: 'pending',
    payment: 'unpaid',
    mode: 'delivery',
    instructions: 'Livrer après 18h svp.',
    history: [
      { at: '2026-11-10T09:32:00', from: null, to: 'pending', by: 'Client' },
    ],
  },
  {
    id: 'NS-2026-1040',
    storeSlug: 'maam-couture',
    date: '2026-11-09T18:11:00',
    customer: { name: 'Fatou Sarr', phone: '+221 70 123 00 45', address: 'Point E, Dakar' },
    items: [
      { productId: 'p-sac-raphia', name: 'Sac raphia Thiossane', variant: 'Unique', price: 18500, quantity: 2 },
    ],
    delivery: 1500,
    total: 38500,
    status: 'confirmed',
    payment: 'unpaid',
    mode: 'pickup',
    history: [
      { at: '2026-11-09T18:11:00', from: null, to: 'pending', by: 'Client' },
      { at: '2026-11-10T08:05:00', from: 'pending', to: 'confirmed', by: 'Aïssatou (commerçante)' },
    ],
  },
  {
    id: 'NS-2026-1039',
    storeSlug: 'maam-couture',
    date: '2026-11-08T14:02:00',
    customer: { name: 'Khady Ndiaye', phone: '+221 78 001 55 10', address: 'Almadies, Dakar' },
    items: [
      { productId: 'p-tenue-tiss', name: 'Tenue brodée Teranga', variant: 'Taille L · Blanc', price: 58000, quantity: 1 },
    ],
    delivery: 2500,
    total: 60500,
    status: 'preparing',
    payment: 'paid',
    mode: 'delivery',
    history: [],
  },
  {
    id: 'NS-2026-1038',
    storeSlug: 'maam-couture',
    date: '2026-11-07T10:40:00',
    customer: { name: 'Mamadou Ba', phone: '+221 77 456 90 01', address: 'Rufisque' },
    items: [
      { productId: 'p-chemise-lin', name: 'Chemise lin Sahel', variant: 'Taille L · Beige', price: 24000, quantity: 2 },
    ],
    delivery: 3000,
    total: 51000,
    status: 'completed',
    payment: 'paid',
    mode: 'delivery',
    history: [],
  },
  {
    id: 'NS-2026-1037',
    storeSlug: 'maam-couture',
    date: '2026-11-06T12:21:00',
    customer: { name: 'Ndeye Gueye', phone: '+221 76 220 33 09', address: 'Yoff' },
    items: [
      { productId: 'p-mules-cuir', name: 'Mules cuir Ngor', variant: '38 · Marron', price: 32000, quantity: 1 },
    ],
    delivery: 2000,
    total: 34000,
    status: 'cancelled',
    payment: 'refunded',
    mode: 'delivery',
    history: [],
  },
  {
    id: 'NS-2026-1036',
    storeSlug: 'maam-couture',
    date: '2026-11-05T16:48:00',
    customer: { name: 'Aissatou Kane', phone: '+221 77 010 03 67', address: 'VDN' },
    items: [
      { productId: 'p-boubou-wax', name: 'Boubou wax Linguère', variant: 'S · Violet', price: 42000, quantity: 1 },
    ],
    delivery: 2000,
    total: 44000,
    status: 'ready',
    payment: 'unpaid',
    mode: 'pickup',
    history: [],
  },
];

export const customers = [
  { id: 'c1', storeSlug: 'maam-couture', name: 'Awa Diallo', phone: '+221 77 820 11 22', email: 'awa.diallo@mail.sn', orders: 4, spent: 184000, lastOrder: '2026-11-10' },
  { id: 'c2', storeSlug: 'maam-couture', name: 'Fatou Sarr', phone: '+221 70 123 00 45', orders: 7, spent: 342000, lastOrder: '2026-11-09' },
  { id: 'c3', storeSlug: 'maam-couture', name: 'Khady Ndiaye', phone: '+221 78 001 55 10', email: 'kndiaye@mail.sn', orders: 2, spent: 118000, lastOrder: '2026-11-08' },
  { id: 'c4', storeSlug: 'maam-couture', name: 'Mamadou Ba', phone: '+221 77 456 90 01', orders: 5, spent: 234000, lastOrder: '2026-11-07' },
  { id: 'c5', storeSlug: 'maam-couture', name: 'Ndeye Gueye', phone: '+221 76 220 33 09', orders: 1, spent: 34000, lastOrder: '2026-11-06' },
];

export const stockMovements = [
  { id: 'sm1', storeSlug: 'maam-couture', productId: 'p-boubou-wax', variant: 'M · Noir', delta: -1, reason: 'Vente', ref: 'NS-2026-1041', at: '2026-11-10T09:32:00' },
  { id: 'sm2', storeSlug: 'maam-couture', productId: 'p-sac-raphia', variant: 'Unique', delta: -2, reason: 'Vente', ref: 'NS-2026-1040', at: '2026-11-09T18:11:00' },
  { id: 'sm3', storeSlug: 'maam-couture', productId: 'p-tenue-tiss', variant: 'L · Blanc', delta: 10, reason: "Arrivage atelier", ref: 'ARR-224', at: '2026-11-05T09:00:00' },
  { id: 'sm4', storeSlug: 'maam-couture', productId: 'p-chemise-lin', variant: 'L · Beige', delta: -2, reason: 'Vente', ref: 'NS-2026-1038', at: '2026-11-07T10:40:00' },
  { id: 'sm5', storeSlug: 'maam-couture', productId: 'p-mules-cuir', variant: '38 · Marron', delta: 1, reason: 'Retour', ref: 'NS-2026-1037', at: '2026-11-06T18:00:00' },
];
