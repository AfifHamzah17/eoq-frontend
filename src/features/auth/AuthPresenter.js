import axios from 'axios';
import Storage from '../../utils/storage';

export default class AuthPresenter {
  constructor(view) {
    this.view = view;
    this.apiUrl = 'http://localhost:3000/api/auth';
  }

  async login(username, password) {
    try {
      // Panggil Backend Login
      const response = await axios.post(`${this.apiUrl}/login`, {
        identity: username, // Backend menggunakan 'identity' (username atau email)
        password
      });

      const { token, user } = response.data.data;

      // Simpan Token & User ke LocalStorage
      Storage.setToken(token);
      Storage.setUser(user);

      // Beri tahu View bahwa login sukses
      this.view.onLoginSuccess(user);
    } catch (error) {
      const message = error.response?.data?.message || 'Terjadi kesalahan koneksi';
      this.view.onLoginError(message);
    }
  }

  logout() {
    Storage.clearUser();
    this.view.onLogoutSuccess();
  }
}