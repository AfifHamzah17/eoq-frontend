// src/features/inventory/InventoryPresenter.js
import api from '../../utils/api';
import InventoryModel from './InventoryModel';

export default class InventoryPresenter {
  constructor(view) { this.view = view; this.apiUrl = '/items'; }

  async loadItems() {
    try {
      this.view.showLoading(true);
      const response = await api.get(this.apiUrl);
      this.view.setItems(response.data.data); 
    } catch (error) { console.error(error); this.view.showError('Gagal mengambil data barang.'); }
    finally { this.view.showLoading(false); }
  }

  async uploadStock(type, dataArray) {
    try {
      this.view.showUploadProgress(true);
      const dataToList = Array.isArray(dataArray) ? dataArray : [dataArray];
      this.view.setUploadTotal(dataToList.length);
      this.view.setUploadCount(0);
      let successCount = 0, errorCount = 0;

      for (const item of dataToList) {
        try {
          await InventoryModel.uploadStock(type, item);
          successCount++;
          this.view.setUploadCount(successCount);
          this.view.updateProgress((successCount / dataToList.length) * 100);
        } catch (err) { errorCount++; console.warn("Gagal upload item:", item, err); }
      }

      this.view.showUploadProgress(false);
      const baseMsg = type === 'in' ? 'Barang Masuk' : 'Barang Keluar';
      this.view.onCreateSuccess(successCount === dataToList.length ? `Berhasil upload ${successCount} data ${baseMsg}.` : `Upload selesai. Berhasil: ${successCount}, Gagal: ${errorCount}`);
      this.loadItems();
    } catch (error) { this.view.showUploadProgress(false); this.view.showError('Terjadi kesalahan sistem saat upload.'); }
  }

  async getHistory(code) {
    try {
      this.view.showLoading(true);
      const response = await api.get(`${this.apiUrl}/history/${code}`);
      this.view.setHistoryData(response.data.data);
    } catch (error) { this.view.showError('Gagal mengambil riwayat.'); }
    finally { this.view.showLoading(false); }
  }

  async editTransaction(id, data) {
    try {
      this.view.showLoading(true);
      await api.put(`${this.apiUrl}/transaction/${id}`, data);
      this.view.onUpdateSuccess('Riwayat berhasil diedit & Stok disesuaikan');
      this.loadItems();
    } catch (error) { this.view.showError(error.response?.data?.message || 'Gagal mengedit riwayat.'); }
    finally { this.view.showLoading(false); }
  }

  async updateItem(id, itemData) {
    if (!itemData.name) return this.view.showError('Nama Barang wajib diisi!');
    try {
      this.view.showLoading(true);
      const payload = { name: itemData.name, stock: parseInt(itemData.stock || 0), shopName: itemData.shopName };
      await api.put(`${this.apiUrl}/${id}`, payload);
      this.view.onUpdateSuccess('Barang berhasil diperbarui');
      this.loadItems();
    } catch (error) { this.view.showError(error.response?.data?.message || 'Gagal mengupdate barang.'); }
    finally { this.view.showLoading(false); }
  }

  async deleteItem(id) {
    try {
      this.view.showLoading(true);
      await api.delete(`${this.apiUrl}/${id}`);
      this.view.onDeleteSuccess('Barang berhasil dihapus');
      this.loadItems();
    } catch (error) { this.view.showError(error.response?.data?.message || 'Gagal menghapus barang.'); }
    finally { this.view.showLoading(false); }
  }
  
  async getInventoryReport() {
    try { const response = await api.get(`${this.apiUrl}/report`); return response.data.data; }
    catch (error) { this.view.showError('Gagal mengambil data laporan untuk export.'); throw error; }
  }
}