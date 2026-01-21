import EOQModel from './EOQModel';

export default class EOQPresenter {
  constructor(view) {
    this.view = view;
  }

  calculate(d, s, h) {
    // 1. Validasi
    if (!d || !s || !h || d <= 0 || s <= 0 || h <= 0) {
      this.view.showValidationError("Semua parameter harus diisi dengan angka positif.");
      return;
    }

    // 2. Rumus EOQ (Q*)
    // Q* = sqrt( (2 * D * S) / H )
    const q = Math.round(Math.sqrt((2 * d * s) / h));

    // 3. Total Cost (TC)
    // TC = (D/Q)*S + (Q/2)*H
    const orderingCost = (d / q) * s;
    const holdingCost = (q / 2) * h;
    const totalCost = orderingCost + holdingCost;

    // 4. Frekuensi Pemesanan
    const frequency = Math.round(d / q);

    // 5. Simpan History (Opsional via Model)
    EOQModel.saveCalculationHistory({ d, s, h, q, totalCost });

    // 6. Kirim ke View
    this.view.renderResult({
      q,
      orderingCost,
      holdingCost,
      totalCost,
      frequency
    });
  }
}