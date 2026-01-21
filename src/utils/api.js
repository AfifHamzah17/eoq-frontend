import api from '../../utils/api'; 
import Storage from '../../utils/storage'; 

export default class AuthPresenter {
  constructor(view) {
    this.view = view;

  }

  async login(username, password) {
    try {
      const response = await api.post('/auth/login', {
        identity: username,
        password
      });

      // Ambil data dari response
      // Struktur Backend: { error: false, data: { token, user } }
      const { token, user } = response.data.data;

      // Simpan Token & User
      Storage.setToken(token);
      Storage.setUser(user);

      // Beritahu View Login Sukses
      this.view.onLoginSuccess(user);
    } catch (error) {
      // Handle Error
      console.error("AuthPresenter Error:", error);
      const message = error.response?.data?.message || 'Login gagal. Cek koneksi internet.';
      this.view.onLoginError(message);
    }
  }

  logout() {
    Storage.clearUser();
    this.view.onLogoutSuccess();
  }
}