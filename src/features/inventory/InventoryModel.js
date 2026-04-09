// src/features/inventory/InventoryModel.js
import api from '../../utils/api';

export default class InventoryModel {
  static async fetchAll() { const r = await api.get('/items'); return r.data; }
  static async create(itemData) { const r = await api.post('/items', itemData); return r.data; }
  static async uploadStock(type, data) { const r = await api.post(type === 'in' ? '/items/upload/in' : '/items/upload/out', data); return r.data; }
  static async fetchHistory(itemCode) { const r = await api.get(`/items/history/${itemCode}`); return r.data; }
  static async updateItem(id, itemData) { const r = await api.put(`/items/${id}`, itemData); return r.data; }
  static async deleteItem(id) { const r = await api.delete(`/items/${id}`); return r.data; }
  static async bulkDelete(ids) { const r = await api.post('/items/bulk-delete', { ids }); return r.data; }
}