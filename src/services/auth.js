import axios from 'axios';
import Storage from '../utils/storage.js';

// Base URL Backend
const API_URL = 'http://localhost:3000/api/auth';

// 1. Fungsi Register
export const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, formData);
    
    // Jika register berhasil (201), tampilkan pesan
    if (response.data.error === false) {
      return { success: true, message: response.data.message };
    }
    throw new Error(response.data.message);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mendaftar');
  }
};

// 2. Fungsi Login
export const loginUser = async (identity, password) => {
  try {
    // Kirim ke backend (identity bisa username atau email)
    const response = await axios.post(`${API_URL}/login`, { identity, password });

    if (response.data.error === false) {
      const { token, user } = response.data.data;
      
      // SIMPAN KE STORAGE (LocalStorage)
      Storage.setToken(token);
      Storage.setUser(user);

      return { success: true, user };
    }
    throw new Error(response.data.message);
  } catch (error) {
    // Lempar error agar bisa ditangkap di Vue component
    throw new Error(error.response?.data?.message || 'Login gagal. Cek koneksi backend.');
  }
};

// 3. Fungsi Ganti Password (Sendiri)
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = Storage.getToken();
    
    const response = await axios.post(`${API_URL}/change-password`, {
      currentPassword,
      newPassword
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return { success: true, message: response.data.message };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mengganti password');
  }
};

// 4. Logout
export const logoutUser = () => {
  Storage.clearUser();
};