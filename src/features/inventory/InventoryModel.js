// src/features/inventory/InventoryModel.js
import api from '../../utils/api';

export default class InventoryModel {
  static async fetchAll() {
    try {
      const response = await api.get('/items');
      return response.data;
    } catch (error) {
      throw new Error('Gagal mengambil data dari server');
    }
  }

  // Create Manual (Tanpa D,S,H)
  static async create(itemData) {
    try {
      const response = await api.post('/items', itemData);
      return response.data;
    } catch (error) {
      throw new Error('Gagal menyimpan barang baru');
    }
  }

  // Fungsi Upload Data (Support Single & CSV Array)
  static async uploadStock(data) {
    // data bisa berupa object {} atau array [{}]
    try {
      const response = await api.post('/items/upload', data);
      return response.data;
    } catch (error) {
      throw new Error('Gagal upload barang');
    }
  }

  // Ambil Riwayat Masuk per Kode Barang
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