import api from '../../utils/api';

export default class ShippingPresenter {
  constructor(view) {
    this.view = view;
    this.apiUrl = '/shipping'; // Pastikan path ini benar
  }

  async loadShippings() {
    try {
      this.view.showLoading(true);
      const response = await api.get(this.apiUrl); // Panggil /api/shipping
      this.view.setShippings(response.data.data); 
    } catch (error) {
      this.view.showError('Gagal mengambil data pengiriman.');
    } finally {
      this.view.showLoading(false);
    }
  }

  async createShipping(data) {
    try {
      this.view.showLoading(true);
      const response = await api.post(this.apiUrl, data);
      this.view.onCreateSuccess('Data berhasil ditambahkan');
      this.loadShippings();
    } catch (error) {
      this.view.showError(error.response?.data?.message || 'Gagal menambah data');
    } finally {
      this.view.showLoading(false);
    }
  }

  // UPDATE: Menggunakan endpoint /api/shipping/:id
  async updateShipping(id, data) {
    try {
      this.view.showLoading(true);
      // Kirim ID dan Data Body
      await api.put(`${this.apiUrl}/${id}`, data);
      this.view.onUpdateSuccess('Data berhasil diperbarui');
      this.loadShippings();
    } catch (error) {
      this.view.showError(error.response?.data?.message || 'Gagal update data');
    } finally {
      this.view.showLoading(false);
    }
  }

  async deleteShipping(id) {
    try {
      this.view.showLoading(true);
      await api.delete(`${this.apiUrl}/${id}`);
      this.view.onDeleteSuccess('Data berhasil dihapus');
      this.loadShippings();
    } catch (error) {
      this.view.showError(error.response?.data?.message || 'Gagal hapus data');
    } finally {
      this.view.showLoading(false);
    }
  }

async uploadCsv(dataArray) {
    try {
      // 1. Setup Awal UI
      this.view.showUploadProgress(true);
      this.view.setUploadTotal(dataArray.length);
      this.view.setUploadCount(0);

      let successCount = 0;
      let errorCount = 0;

      // 2. Loop Data SATU PER SATU untuk Progress Real-time
      for (const item of dataArray) {
        try {
          // Kirim request satuan ke endpoint create biasa
          await api.post(this.apiUrl, item);
          successCount++;
          
          // Update UI setiap item berhasil
          this.view.setUploadCount(successCount);
          const percentage = (successCount / dataArray.length) * 100;
          this.view.updateProgress(percentage);

        } catch (err) {
          // Tangkap error per item agar loop tidak berhenti
          errorCount++;
          console.warn("Gagal upload item:", item, err);
        }
      }

      // 3. Finalisasi
      this.view.showUploadProgress(false);
      
      if (successCount === dataArray.length) {
        this.view.onCreateSuccess(`Berhasil upload ${successCount} data.`);
      } else {
        this.view.onCreateSuccess(`Upload selesai. Berhasil: ${successCount}, Gagal: ${errorCount}`);
      }
      
      this.loadShippings(); // Reload data

    } catch (error) {
      this.view.showUploadProgress(false);
      this.view.showError('Terjadi kesalahan sistem saat upload.');
    }
  }
}