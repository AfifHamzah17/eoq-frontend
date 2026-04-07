// frontend/presenters/EOQPresenter.js
import api from '../../utils/api';

export default class EOQPresenter {
  constructor(view) {
    this.view = view;
  }

  // GANTI: Fetch daftar cabang
  async fetchCabangs() {
    try {
      const response = await api.get('/eoq/cabangs');
      this.view.onCabangsLoaded(response.data.data);
    } catch (error) {
      console.error(error);
      this.view.showError("Gagal memuat daftar cabang.");
    }
  }

  // GANTI: Terima parameter namaCabang
  async fetchGlobalData(namaCabang) {
    try {
      const response = await api.get('/eoq/parameters', {
        params: { namaCabang }
      });
      const data = response.data.data;

      this.view.onDataLoaded({
        totalStock: data.totalStock,
        avgShippingCost: data.avgShippingCost
      });

    } catch (error) {
      console.error(error);
      this.view.showError("Gagal memuat parameter EOQ.");
    }
  }

  // FUNGSI INI TIDAK BERUBAH
  calculate(d, s, h) {
    if (!d || !s || !h || d <= 0 || s <= 0 || h <= 0) {
      this.view.showError("Parameter tidak valid untuk perhitungan.");
      return;
    }

    const q = Math.round(Math.sqrt((2 * d * s) / h));
    const orderingCost = (d / q) * s;
    const holdingCost = (q / 2) * h;
    const totalCost = orderingCost + holdingCost;
    const frequency = Math.round(d / q);

    const workingDays = 360; 
    const intervalDays = (workingDays / frequency).toFixed(1); 

    this.view.onCalculationReady({
      q, 
      oc: orderingCost, 
      hc: holdingCost, 
      tc: totalCost, 
      freq: frequency,
      intervalDays: intervalDays 
    });
  }
}