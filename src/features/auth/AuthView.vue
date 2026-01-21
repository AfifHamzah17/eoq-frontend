<template>
  <section class="fixed inset-0 bg-gray-100 z-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
      <div class="text-center mb-6">
        <div class="bg-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 text-white text-2xl">
          <i class="fa-solid fa-cube"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-800">EOQ Inventory System</h1>
        <p class="text-gray-500 text-sm mt-1">Masuk untuk mengelola persediaan</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Username / Email</label>
          <input 
            v-model="form.identity" 
            type="text" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="admin" 
            required 
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            v-model="form.password" 
            type="password" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="123456" 
            required 
          />
        </div>
        <button type="submit" :disabled="loading" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200">
          {{ loading ? 'Memproses...' : 'Masuk' }}
        </button>
      </form>

      <div class="mt-4 text-xs text-center text-gray-400">
        <p>Backend Connection: <span :class="backendStatus ? 'text-green-500' : 'text-red-500'">
          {{ backendStatus ? 'Connected' : 'Disconnected' }}
        </span></p>
        <p class="mt-2">Demo Admin: admin / 123456</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios'; // <--- PASTIKAN IMPORT INI WAJIB ADA DI BARIS PERTAMA
import { loginUser } from '../../services/auth.js';
import { showToast } from '../../utils/toastify';

const emit = defineEmits(['login-success']);

const form = reactive({
  identity: 'admin',
  password: ''
});
const loading = ref(false);
const backendStatus = ref(false);

const handleLogin = async () => {
  if (!form.identity || !form.password) {
    showToast('Username/Email dan password wajib diisi', 'error');
    return;
  }

  loading.value = true;
  try {
    const result = await loginUser(form.identity, form.password);
    
    showToast(`Selamat datang, ${result.user.name}!`, 'success');
    emit('login-success', result.user);
  } catch (error) {
    console.error("Login Error:", error);
    showToast(error.message, 'error');
  } finally {
    loading.value = false;
  }
};

// Cek backend availability saat mount
onMounted(async () => {
  try {
    // Gunakan axios global untuk cek koneksi
    await axios.get('https://eoq-backend-1034091508339.asia-southeast1.run.app/'); 
    backendStatus.value = true;
  } catch (e) {
    backendStatus.value = false;
    console.error("Backend disconnected", e);
  }
});
</script>