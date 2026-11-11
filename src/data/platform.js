export const merchants = [
  { id: 'm1', name: 'Aïssatou Diop', email: 'aissatou@maam-couture.sn', phone: '+221 77 123 45 67', stores: 1, status: 'active', createdAt: '2026-04-21', lastLogin: '2026-11-11' },
  { id: 'm2', name: 'Mariam Ndiaye', email: 'mariam@terangabeauty.com', phone: '+221 70 555 02 18', stores: 1, status: 'active', createdAt: '2026-10-28', lastLogin: '2026-11-10' },
  { id: 'm3', name: 'Ibrahima Faye', email: 'ibrahima@baobab.home', phone: '+221 77 820 44 10', stores: 1, status: 'suspended', createdAt: '2025-07-10', lastLogin: '2026-10-02' },
  { id: 'm4', name: 'Ousmane Sow', email: 'osow@mail.sn', phone: '+221 76 010 99 02', stores: 2, status: 'active', createdAt: '2026-08-02', lastLogin: '2026-11-09' },
  { id: 'm5', name: 'Diarra Cissé', email: 'diarra.c@mail.sn', phone: '+221 78 442 10 33', stores: 1, status: 'pending', createdAt: '2026-11-08', lastLogin: null },
];

export const auditLogs = [
  { id: 'log-01', at: '2026-11-11T09:12:00', actor: 'Admin (Papa S.)', action: 'Suspension boutique', target: 'Baobab Home', reason: 'Non-renouvellement' },
  { id: 'log-02', at: '2026-11-10T14:03:00', actor: 'Admin (Papa S.)', action: 'Changement d’offre', target: 'Maam Couture → Pro', reason: 'Demande commerçant' },
  { id: 'log-03', at: '2026-11-09T18:21:00', actor: 'Système', action: 'Expiration essai', target: 'Teranga Beauty', reason: 'Fin de période' },
  { id: 'log-04', at: '2026-11-08T10:08:00', actor: 'Support (Dieynaba)', action: 'Réinitialisation accès', target: 'Ousmane Sow', reason: 'Support utilisateur' },
  { id: 'log-05', at: '2026-11-06T08:43:00', actor: 'Admin (Papa S.)', action: 'Création offre', target: 'Business', reason: 'Nouveau palier' },
];

export const platformStats = {
  merchants: 128,
  stores: 142,
  activeStores: 118,
  suspendedStores: 6,
  trials: 14,
  activeSubs: 94,
  expiredSubs: 11,
  orders: 5842,
  gmv: 89420000,
};
