import api from '../../utils/api';

export default class InventoryModel {
  static async fetchAll() {
    try {
      const response = await api.get('/items'); // Endpoint GET items tetap sama
      return response.data;
    } catch (error) {
      throw new Error('Gagal mengambil data dari server');
    }
  }

  static async create(itemData) {
    try {
      const response = await api.post('/items', itemData);
      return response.data;
    } catch (error) {
      throw new Error('Gagal menyimpan barang baru');
    }
  }

  // PERBAIKAN: PISAHKAN ENDPOINT UNTUK IN & OUT
  // Backend sekarang membedakan /upload/in dan /upload/out
  static async uploadStock(type, data) {
    try {
      // Tentukan endpoint berdasarkan tipe (in/out)
      const endpoint = type === 'in' ? '/items/upload/in' : '/items/upload/out';
      
      // Kirim data (bisa single object atau array)
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal upload barang');
    }
  }

  static async fetchHistory(itemCode) {
    try {
      const response = await api.get(`/items/history/${itemCode}`);
      return response.data;
    } catch (error) {
      throw new Error('Gagal mengambil riwayat barang');
    }
  }

  static async updateItem(id, itemData) {
    try {
      const response = await api.put(`/items/${id}`, itemData);
      return response.data;
    } catch (error) {
      throw new Error('Gagal update barang');
    }
  }

  static async deleteItem(id) {
    try {
      const response = await api.delete(`/items/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Gagal menghapus barang');
    }
  }
}