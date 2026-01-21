import StockModel from './StockModel';

export default class StockPresenter {
  constructor(view) {
    this.view = view;
  }

  // 1. Load Barang untuk Dropdown (dipakai In & Out) & List (dipakai Levels)
  async loadItems() {
    try {
      this.view.showLoading(true);
      const items = await StockModel.fetchAllItems();
      this.view.setItems(items);
    } catch (error) {
      console.error(error);
      this.view.showError('Gagal mengambil data barang.');
    } finally {
      this.view.showLoading(false);
    }
  }

  // 2. Logika Barang Masuk
  async stockIn(itemId, qty, note) {
    try {
      this.view.showLoading(true);
      
      // Validasi Frontend Sederhana
      if (!itemId || qty <= 0) {
        throw new Error('Data tidak valid');
      }

      await StockModel.updateStock(itemId, qty, note);
      this.view.onSuccess('Stok berhasil ditambahkan');
      this.view.resetForm(); // Reset form input
      this.loadItems(); // Refresh data stok terbaru
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || error.message || 'Gagal menambah stok.';
      this.view.showError(msg);
    } finally {
      this.view.showLoading(false);
    }
  }

  // 3. Logika Barang Keluar
  async stockOut(itemId, qty, note) {
    try {
      this.view.showLoading(true);

      if (!itemId || qty <= 0) {
        throw new Error('Data tidak valid');
      }

      // Kirim angka negatif untuk mengurangi stok
      await StockModel.updateStock(itemId, -qty, note);
      this.view.onSuccess('Stok berhasil dikurangi');
      this.view.resetForm();
      this.loadItems();
    } catch (error) {
      console.error(error);
      // Cek jika error dari backend karena stok habis
      const msg = error.response?.data?.message || error.message || 'Gagal mengurangi stok.';
      this.view.showError(msg);
    } finally {
      this.view.showLoading(false);
    }
  }
}