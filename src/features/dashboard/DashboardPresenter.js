import Storage from '../../utils/storage';

export default class DashboardPresenter {
  constructor(view) {
    this.view = view;
  }

  loadData() {
    const items = Storage.getItems();
    const trx = Storage.getTransactions().slice(0, 5);

    const totalItems = items.length;
    const totalStock = items.reduce((sum, i) => sum + i.stock, 0);
    const stockValue = totalStock * 10000; // Dummy unit price
    const lowStock = items.filter(i => i.stock < 100).length;

    this.view.setStats({ totalItems, stockValue, lowStock });
    this.view.setTransactions(trx);
  }
}