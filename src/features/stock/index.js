import StockInView from './StockInView.vue';
import StockOutView from './StockOutView.vue';
import StockLevelsView from './StockLevelsView.vue';

export default {
  // Parameter 'type' dikirim dari TheLayout.vue saat navigate('stock-in') atau navigate('stock-out')
  render(type) {
    switch(type) {
      case 'stock-in':
        return StockInView;
      case 'stock-out':
        return StockOutView;
      case 'stock-levels':
        return StockLevelsView;
      default:
        return StockLevelsView;
    }
  }
};