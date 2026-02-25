// src/features/auth/AuthPresenter.js
import api from '../../utils/api'; 
import Storage from '../../utils/storage'; 

export default class AuthPresenter {
  constructor(view) {
    this.view = view;
  }

  async login(identity, password) {
    console.log('Presenter: Mencoba login dengan:', identity);

    try {
      const response = await api.post('/auth/login', {
        identity,
        password
      });

      console.log('Presenter: Response berhasil diterima', response.data);

      const { token, user } = response.data.data;

      Storage.setToken(token);
      Storage.setUser(user);

      if (this.view.onLoginSuccess) {
        this.view.onLoginSuccess(user);
      }

    } catch (error) {
      console.error('Presenter: LOGIN GAGAL (Error Object)', error);
      
      let message = 'Login gagal. Silakan coba lagi.';
      
      // Logic extraction message yang lebih detail
      if (error.response) {
        // Server merespon dengan status error (4xx, 5xx)
        console.log('Presenter: Error Response Data', error.response.data);
        message = error.response.data.message || error.response.data.error || `Error Status: ${error.response.status}`;
      } else if (error.request) {
        // Request dibuat tapi tidak ada response (Server mati / CORS)
        console.log('Presenter: Error Request (No Response)', error.request);
        message = 'Tidak dapat terhubung ke server. Cek koneksi atau status server.';
      } else {
        // Error setup request
        message = error.message;
      }

      console.log('Presenter: Pesan error final yang dikirim ke View:', message);

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