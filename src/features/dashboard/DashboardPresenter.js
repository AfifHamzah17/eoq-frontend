import DashboardModel from './DashboardModel';

export default class DashboardPresenter {
  constructor(view) {
    this.view = view;
  }

  async loadData() {
    try {
      this.view.showLoading(true);
      const response = await DashboardModel.fetchSummary();
      const data = response.data;

      // 1. Set Stats
      this.view.setStats({
        totalItems: data.totalItems,
        stockValue: data.stockValue,
        lowStock: data.lowStock,
        monthlyTransactions: data.monthlyTransactions
      });

      // 2. Set Transactions
      // Format tanggal agar rapi di view jika perlu
      const formattedTrx = data.recentActivity.map(t => ({
        ...t,
        // Pastikan format tanggal sesuai kebutuhan view (string)
        date: t.date ? new Date(t.date).toLocaleDateString('id-ID') : '-' 
      }));

      this.view.setTransactions(formattedTrx);

    } catch (error) {
      console.error(error);
      this.view.showError("Gagal memuat data dashboard");
    } finally {
      this.view.showLoading(false);
    }
  }
}