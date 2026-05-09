// src/features/shipping/ShippingModel.js
import api from '../../utils/api';
export default class ShippingModel {
  static async fetchAll() { const r = await api.get('/shipping'); return r.data; }
  static async bulkDelete(ids) { const r = await api.post('/shipping/bulk-delete', { ids }); return r.data; }
}