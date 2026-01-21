import api from '../../utils/api';

export default class InventoryPresenter {
  constructor(view) {
    this.view = view;
    this.apiUrl = '/items';
  }

  async loadItems() {
    try {
      this.view.showLoading(true);
      const response = await api.get(this.apiUrl);
      this.view.setItems(response.data.data); 
    } catch (error) {
      console.error(error);
      this.view.showError('Gagal mengambil data barang.');
    } finally {
      this.view.showLoading(false);
    }
  }

  // UPDATE: Loop Satu Per Satu untuk Progress Realtime
  async uploadStock(type, dataArray) {
    try {
      // 1. Setup UI Progress
      this.view.showUploadProgress(true);
      this.view.setUploadTotal(dataArray.length);
      this.view.setUploadCount(0);

      let successCount = 0;
      let errorCount = 0;

      // 2. Loop Data
      for (const item of dataArray) {
        try {
          // Tentukan endpoint
          const endpoint = type === 'in' ? '/upload/in' : '/upload/out';
          
          // Kirim satuan (req.body adalah object, backend akan membungkusnya dalam array)
          await api.post(`${this.apiUrl}${endpoint}`, item);
          
          successCount++;
          
          // Update UI
          this.view.setUploadCount(successCount);
          const percentage = (successCount / dataArray.length) * 100;
          this.view.updateProgress(percentage);

        } catch (err) {
          errorCount++;
          console.warn("Gagal upload item:", item, err);
          // Lanjut ke item berikutnya (jangan break)
        }
      }

      // 3. Finalisasi
      this.view.showUploadProgress(false);
      
      const baseMsg = type === 'in' ? 'Barang Masuk' : 'Barang Keluar';
      if (successCount === dataArray.length) {
        this.view.onCreateSuccess(`Berhasil upload ${successCount} data ${baseMsg}.`);
      } else {
        this.view.onCreateSuccess(`Upload selesai. Berhasil: ${successCount}, Gagal: ${errorCount}`);
      }
      
      this.loadItems(); // Reload data master

    } catch (error) {
      this.view.showUploadProgress(false);
      this.view.showError('Terjadi kesalahan sistem saat upload.');
    }
  }

  async getHistory(code) {
    try {
      this.view.showLoading(true);
      const response = await api.get(`${this.apiUrl}/history/${code}`);
      this.view.setHistoryData(response.data.data);
    } catch (error) {
      this.view.showError('Gagal mengambil riwayat.');
    } finally {
      this.view.showLoading(false);
    }
  }

  async editTransaction(id, data) {
    try {
      this.view.showLoading(true);
      await api.put(`${this.apiUrl}/transaction/${id}`, data);
      this.view.onUpdateSuccess('Riwayat berhasil diedit & Stok disesuaikan');
      this.loadItems();
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal mengedit riwayat.';
      this.view.showError(message);
    } finally {
      this.view.showLoading(false);
    }
  }

  async updateItem(id, itemData) {
    if (!itemData.name) return this.view.showError('Nama Barang wajib diisi!');
    try {
      this.view.showLoading(true);
      const payload = { name: itemData.name, stock: parseInt(itemData.stock || 0), shopName: itemData.shopName };
      await api.put(`${this.apiUrl}/${id}`, payload);
      this.view.onUpdateSuccess('Barang berhasil diperbarui');
      this.view.closeForm();
      this.loadItems();
    } catch (error) {
      this.view.showError(error.response?.data?.message || 'Gagal mengupdate barang.');
    } finally {
      this.view.showLoading(false);
    }
  }

  async deleteItem(id) {
    try {
      this.view.showLoading(true);
      await api.delete(`${this.apiUrl}/${id}`);
      this.view.onDeleteSuccess('Barang berhasil dihapus');
      this.loadItems();
    } catch (error) {
      this.view.showError(error.response?.data?.message || 'Gagal menghapus barang.');
    } finally {
      this.view.showLoading(false);
    }
  }
  
   async getInventoryReport() {
    try {
      const response = await api.get(`${this.apiUrl}/report`);
      return response.data.data;
    } catch (error) {
      this.view.showError('Gagal mengambil data laporan untuk export.');
      throw error;
    }
  }
}