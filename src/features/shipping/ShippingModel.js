// src/features/shipping/ShippingModel.js
export default class ShippingModel {
  static async fetchAll() {
    // Placeholder
    return [];
  }
    static async bulkDelete(ids) { const r = await api.post('/shipping/bulk-delete', { ids }); return r.data; }
}