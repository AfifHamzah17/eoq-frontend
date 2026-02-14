import api from '../../utils/api';

export default class SalesModel {
  static async fetchAll() { const r = await api.get('/sales'); return r.data; }
  static async create(data) { const r = await api.post('/sales', data); return r.data; }
  static async update(id, data) { const r = await api.put(`/sales/${id}`, data); return r.data; }
  static async delete(id) { const r = await api.delete(`/sales/${id}`); return r.data; }
  static async uploadCsv(arr) { const r = await api.post('/sales/upload', arr); return r.data; }
}