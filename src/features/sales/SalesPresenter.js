// src/features/sales/SalesPresenter.js
import api from '../../utils/api';
import SalesModel from './SalesModel';

export default class SalesPresenter {
  constructor(view) { this.view = view; this.apiUrl = '/sales'; }

  async loadSales() {
    try { this.view.showLoading(true); const response = await api.get(this.apiUrl); this.view.setSales(response.data.data); }
    catch (error) { this.view.showError('Gagal mengambil data penjualan.'); }
    finally { this.view.showLoading(false); }
  }

  async createSale(data) {
    try { await SalesModel.create(data); this.view.onCreateSuccess('Data penjualan berhasil ditambahkan'); this.loadSales(); }
    catch (error) { this.view.showError(error.response?.data?.message || 'Gagal menambah data'); }
  }

  async updateSale(id, data) {
    try { await SalesModel.update(id, data); this.view.onUpdateSuccess('Data penjualan berhasil diupdate'); this.loadSales(); }
    catch (error) { this.view.showError(error.response?.data?.message || 'Gagal update data'); }
  }

  async deleteSale(id) {
    try { await SalesModel.delete(id); this.view.onDeleteSuccess('Data penjualan berhasil dihapus'); this.loadSales(); }
    catch (error) { this.view.showError(error.response?.data?.message || 'Gagal menghapus data'); }
  }

  async uploadExcel(dataArray) {
    try {
      this.view.showUploadProgress(true); this.view.setUploadTotal(dataArray.length); this.view.setUploadCount(0);
      let successCount = 0, errorCount = 0;
      for (const item of dataArray) {
        try { await SalesModel.create(item); successCount++; this.view.setUploadCount(successCount); this.view.updateProgress((successCount / dataArray.length) * 100); }
        catch (err) { errorCount++; console.warn("Gagal upload item:", item, err); }
      }
      this.view.showUploadProgress(false);
      this.view.onCreateSuccess(successCount === dataArray.length ? `Berhasil upload ${successCount} data.` : `Upload selesai. Berhasil: ${successCount}, Gagal: ${errorCount}`);
      this.loadSales();
    } catch (error) { this.view.showUploadProgress(false); this.view.showError('Terjadi kesalahan sistem saat upload.'); }
  }
}