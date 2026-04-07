// src/features/auth/AuthPresenter.js
import api from '../../utils/api'; 
import Storage from '../../utils/storage'; 

export default class AuthPresenter {
  constructor(view) {
    this.view = view;
  }

  async login(identity, password) {
    try {
      const response = await api.post('/auth/login', { identity, password });
      const { token, user } = response.data.data;

      Storage.setToken(token);
      Storage.setUser(user);

      if (this.view.onLoginSuccess) {
        this.view.onLoginSuccess(user);
      }
    } catch (error) {
      let message = 'Login gagal. Silakan coba lagi.';
      
      if (error.response) {
        message = error.response.data.message || `Error Status: ${error.response.status}`;
      } else if (error.request) {
        message = 'Tidak dapat terhubung ke server. Periksa koneksi Anda.';
      } else {
        message = error.message;
      }

      if (this.view.onLoginError) {
        this.view.onLoginError(message);
      }
    }
  }

  async register(data) {
    try {
      const response = await api.post('/auth/register', data);
      if (this.view.onRegisterSuccess) {
        this.view.onRegisterSuccess(response.data.message || 'Registrasi berhasil!');
      }
    } catch (error) {
      let message = 'Gagal mendaftar';
      if (error.response && error.response.data) {
        message = error.response.data.message || message;
      }
      if (this.view.onRegisterError) {
        this.view.onRegisterError(message);
      }
    }
  }
}