import api from '../../utils/api';

export default class DashboardModel {
  static async fetchSummary() {
    const response = await api.get('/dashboard/summary');
    return response.data;
  }
}