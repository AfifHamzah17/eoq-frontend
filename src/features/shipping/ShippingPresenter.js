//src/features/shipping/ShippingPresenter.js
import api from '../../utils/api';

export default class ShippingPresenter {
  constructor(view) { this.view = view; this.apiUrl = '/shipping'; }

  async loadShippings() {
    try { this.view.showLoading(true); const response = await api.get(this.apiUrl); this.view.setShippings(response.data.data); } 
    catch (error) { this.view.showError('Gagal mengambil data pengiriman.'); } 
    finally { this.view.showLoading(false); }
  }

  async createShipping(data) {
    try { this.view.showLoading(true); await api.post(this.apiUrl, data); this.view.onCreateSuccess('Data berhasil ditambahkan'); this.loadShippings(); } 
    catch (error) { this.view.showError(error.response?.data?.message || 'Gagal menambah data'); } 
    finally { this.view.showLoading(false); }
  }

  async updateShipping(id, data) {
    try { this.view.showLoading(true); await api.put(`${this.apiUrl}/${id}`, data); this.view.onUpdateSuccess('Data berhasil diperbarui'); this.loadShippings(); } 
    catch (error) { this.view.showError(error.response?.data?.message || 'Gagal update data'); } 
    finally { this.view.showLoading(false); }
  }

  async deleteShipping(id) {
    try { this.view.showLoading(true); await api.delete(`${this.apiUrl}/${id}`); this.view.onDeleteSuccess('Data berhasil dihapus'); this.loadShippings(); } 
    catch (error) { this.view.showError(error.response?.data?.message || 'Gagal hapus data'); } 
    finally { this.view.showLoading(false); }
  }

  async bulkDelete(ids) {
    if (!ids || ids.length === 0) return this.view.showError('Tidak ada data yang dipilih.');
    try {
      this.view.showLoading(true);
      // FIX: Gunakan POST karena Axios.delete() tidak bisa kirim body dengan benar
      await api.post(`${this.apiUrl}/bulk-delete`, { ids });
      this.view.onDeleteSuccess(`Berhasil menghapus ${ids.length} data.`);
      this.loadShippings();
    } catch (error) { this.view.showError(error.response?.data?.message || 'Gagal menghapus data massal.'); } 
    finally { this.view.showLoading(false); }
  }

  async uploadCsv(dataArray) {
    try {
      this.view.showUploadProgress(true); this.view.setUploadTotal(dataArray.length); this.view.setUploadCount(0);
      let successCount = 0, errorCount = 0;
      for (const item of dataArray) {
        try { await api.post(this.apiUrl, item); successCount++; this.view.setUploadCount(successCount); this.view.updateProgress((successCount / dataArray.length) * 100); } 
        catch (err) { errorCount++; }
      }
      this.view.showUploadProgress(false);
      this.view.onCreateSuccess(successCount === dataArray.length ? `Berhasil upload ${successCount} data.` : `Upload selesai. Berhasil: ${successCount}, Gagal: ${errorCount}`);
      this.loadShippings();
    } catch (error) { this.view.showUploadProgress(false); this.view.showError('Terjadi kesalahan sistem saat upload.'); }
  }
}