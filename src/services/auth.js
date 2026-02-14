import api from '../utils/api'; // Gunakan API Client yang sudah ada
import Storage from '../utils/storage';

// 1. Fungsi Register
export const registerUser = async (formData) => {
  try {
    // baseURL sudah ada di api.js, jadi cukup panggil '/auth/register'
    const response = await api.post('/auth/register', formData);
    
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
    // Token akan otomatis diset oleh api.js setelah berhasil login jika kita save manual di sini
    const response = await api.post('/auth/login', { identity, password });

    if (response.data.error === false) {
      const { token, user } = response.data.data;
      
      // SIMPAN KE STORAGE (Local Storage)
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
    // Token otomatis ikut karena pakai 'api'
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword
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