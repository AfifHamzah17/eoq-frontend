import api from '../../utils/api';
import SalesModel from './SalesModel';

export default class SalesPresenter {
  constructor(view) {
    this.view = view;
    this.apiUrl = '/sales';
  }

  async loadSales() {
    try {
      this.view.showLoading(true);
      const response = await api.get(this.apiUrl);
      this.view.setSales(response.data.data);
    } catch (error) {
      this.view.showError('Gagal mengambil data penjualan.');
    } finally {
      this.view.showLoading(false);
    }
  }

  // CREATE SINGLE
  async createSale(data) {
    try {
      await SalesModel.create(data);
      this.view.onCreateSuccess('Data penjualan berhasil ditambahkan');
      this.loadSales();
    } catch (error) {
      this.view.showError(error.response?.data?.message || 'Gagal menambah data');
    }
  }

  // UPDATE SINGLE
  async updateSale(id, data) {
    try {
      await SalesModel.update(id, data);
      this.view.onUpdateSuccess('Data penjualan berhasil diupdate');
      this.loadSales();
    } catch (error) {
      this.view.showError(error.response?.data?.message || 'Gagal update data');
    }
  }

  // DELETE
  async deleteSale(id) {
    try {
      await SalesModel.delete(id);
      this.view.onDeleteSuccess('Data penjualan berhasil dihapus');
      this.loadSales();
    } catch (error) {
      this.view.showError(error.response?.data?.message || 'Gagal menghapus data');
    }
  }

  // UPLOAD EXCEL (Loop untuk Progress)
  async uploadExcel(dataArray) {
    try {
      this.view.showUploadProgress(true);
      this.view.setUploadTotal(dataArray.length);
      this.view.setUploadCount(0);

      let successCount = 0;
      let errorCount = 0;

      for (const item of dataArray) {
        try {
          // Kirim data satu per satu ke model/service
          // Asumsi backend punya endpoint /upload yang terima array, atau / untuk single.
          // Di sini kita pakai create single agar progress bar akurat.
          await SalesModel.create(item);
          
          successCount++;
          this.view.setUploadCount(successCount);
          this.view.updateProgress((successCount / dataArray.length) * 100);
        } catch (err) {
          errorCount++;
          console.warn("Gagal upload item:", item, err);
        }
      }

      this.view.showUploadProgress(false);
      
      if (successCount === dataArray.length) {
        this.view.onCreateSuccess(`Berhasil upload ${successCount} data penjualan.`);
      } else {
        this.view.onCreateSuccess(`Upload selesai. Berhasil: ${successCount}, Gagal: ${errorCount}`);
      }
      
      this.loadSales();

    } catch (error) {
      this.view.showUploadProgress(false);
      this.view.showError('Terjadi kesalahan sistem saat upload.');
    }
  }
}