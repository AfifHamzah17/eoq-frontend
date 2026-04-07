// src/features/admin/UserManagementPresenter.js
import api from '../../utils/api';

export default class UserManagementPresenter {
  constructor(view) {
    this.view = view;
  }

  async loadUsers() {
    this.view.setLoading(true);
    try {
      const response = await api.get('/auth/users');
      this.view.setUsers(response.data.data);
    } catch (error) {
      this.view.onError('Gagal memuat data pengguna');
    } finally {
      this.view.setLoading(false);
    }
  }

  async approveUser(userId) {
    try {
      const response = await api.put(`/auth/users/${userId}/approve`);
      this.view.onSuccess(response.data.message);
      this.loadUsers(); // Refresh
    } catch (error) {
      this.view.onError(error.response?.data?.message || 'Gagal approve user');
    }
  }

  async rejectUser(user) {
    try {
      const response = await api.delete(`/auth/users/${user._id || user.id}`);
      this.view.onSuccess(response.data.message || 'User ditolak/dihapus');
      this.loadUsers();
    } catch (error) {
      this.view.onError(error.response?.data?.message || 'Gagal menolak user');
    }
  }

  async deleteUser(user) {
    try {
      const userId = user._id || user.id;
      const response = await api.delete(`/auth/users/${userId}`);
      this.view.onSuccess(response.data.message);
      this.loadUsers(); // Refresh
    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal menghapus user';
      this.view.onError(msg);
    }
  }

  async resetPassword(userId, newPassword) {
    try {
      const response = await api.post('/auth/users/reset-password', {
        iduser: userId,
        newPassword
      });
      this.view.onSuccess(response.data.message);
      this.view.closeModal();
    } catch (error) {
      this.view.onError(error.response?.data?.message || 'Gagal reset password');
    }
  }
}