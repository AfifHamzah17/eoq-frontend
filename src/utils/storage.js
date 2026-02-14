const STORAGE_KEYS = {
  ITEMS: 'eoq_items',
  TRANSACTIONS: 'eoq_transactions',
  USER: 'eoq_user',
  TOKEN: 'eoq_token'
};

const DEFAULT_ITEMS = [
  { id: 1, code: 'BRG-001', name: 'Contoh Barang (Dari Prompt)', d: 10000, s: 150000, h: 3000, stock: 500 },
  { id: 2, code: 'BRG-002', name: 'Baut Baja 10mm', d: 5000, s: 50000, h: 1000, stock: 200 },
  { id: 3, code: 'BRG-003', name: 'Oli Mesin Drum', d: 1200, s: 200000, h: 50000, stock: 50 }
];

// PERBAIKAN: Ubah ke export default
export default { // <--- Tambahkan 'default'
  getItems: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS)) || DEFAULT_ITEMS,
  saveItems: (items) => localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items)),
  
  getTransactions: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) || [],
  saveTransactions: (trx) => localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(trx)),
  
  getUser: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)),
  setUser: (user) => localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
  clearUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },
  
  getToken: () => localStorage.getItem(STORAGE_KEYS.TOKEN),
  setToken: (token) => localStorage.setItem(STORAGE_KEYS.TOKEN, token)
};