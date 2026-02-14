// frontend/presenters/EOQPresenter.js
import api from '../../utils/api';

export default class EOQPresenter {
  constructor(view) {
    this.view = view;
  }

  async fetchGlobalData() {
    try {
      const response = await api.get('/eoq/parameters');
      const data = response.data.data;

      const S = data.avgShippingCost;

      this.view.onDataLoaded({
        totalStock: data.totalStock,
        avgShippingCost: S
      });

    } catch (error) {
      console.error(error);
      this.view.showError("Gagal memuat parameter EOQ.");
    }
  }

  calculate(d, s, h) {
    if (!d || !s || !h || d <= 0 || s <= 0 || h <= 0) {
      this.view.showError("Parameter tidak valid untuk perhitungan.");
      return;
    }

    // Rumus EOQ
    const q = Math.round(Math.sqrt((2 * d * s) / h));
    const orderingCost = (d / q) * s;
    const holdingCost = (q / 2) * h;
    const totalCost = orderingCost + holdingCost;
    const frequency = Math.round(d / q);

    // --- TAMBAHAN: Perhitungan Interval Hari (T) ---
    // Asumsi 1 tahun = 360 hari kerja
    const workingDays = 360; 
    const intervalDays = (workingDays / frequency).toFixed(1); // Dibulatkan 1 desimal
    // -----------------------------------------------

    this.view.onCalculationReady({
      q, 
      oc: orderingCost, 
      hc: holdingCost, 
      tc: totalCost, 
      freq: frequency,
      intervalDays: intervalDays // Kirim data hari
    });
  }
}