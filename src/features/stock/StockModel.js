import api from '../../utils/api';

export default class StockModel {
  // Ambil semua barang untuk Dropdown
  static async fetchAllItems() {
    const response = await api.get('/items');
    return response.data.data; 
  }

  // Update Stok (Masuk/Keluar)
  // delta: positif untuk masuk, negatif untuk keluar
  static async updateStock(itemId, delta, note) {
    const payload = {
      stock_delta: parseInt(delta),
      note: note
    };
    // Endpoint contoh: PATCH /items/:id/stock
    const response = await api.patch(`/items/${itemId}/stock`, payload);
    return response.data;
  }
}