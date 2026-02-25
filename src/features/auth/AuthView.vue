<!-- src/features/auth/AuthView.vue -->
<template>
  <section class="fixed inset-0 bg-gradient-to-br from-slate-100 to-slate-200 z-50 flex items-center justify-center overflow-hidden">
    
    <!-- Container Utama -->
    <div class="relative w-full max-w-4xl h-[680px] shadow-2xl rounded-2xl overflow-hidden bg-white">
      
      <!-- ... Panel Kiri (Register) ... -->
      <!-- Saya potong agar singkat, tapi pastikan kode panel kiri (Register) Anda tetap ada di sini persis seperti sebelumnya -->
      <!-- BEGIN: PANEL KIRI (Singkat untuk hemat space, copy bagian ini dari kode anda sebelumnya jika perlu) -->
       <div 
        class="absolute top-0 left-0 w-1/2 h-full z-10 transition-transform duration-700 ease-in-out"
        :class="isRegisterMode ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'"
      >
        <!-- ... Isi Panel Kiri (Login Info Blue) ... -->
         <div class="w-full h-full bg-blue-600 text-white p-10 flex flex-col justify-center">
          <div class="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-4xl backdrop-blur-sm border border-white/30">
            <i class="fa-solid fa-cube"></i>
          </div>
          <h1 class="text-3xl font-bold mb-3">EOQ Inventory System</h1>
          <p class="text-blue-100 mb-8 text-sm">Kelola persediaan bisnis Anda dengan lebih efisien menggunakan metode Economic Order Quantity.</p>
          <button @click="toggleMode" class="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition w-fit shadow-lg">
            Buat Akun Baru
          </button>
        </div>
      </div>
      
      <!-- Register Form (Foreground White) -->
      <div 
        class="absolute top-0 left-0 w-1/2 h-full z-20 bg-white transition-transform duration-700 ease-in-out overflow-y-auto"
        :class="isRegisterMode ? 'translate-x-0' : '-translate-x-full'"
      >
        <!-- Back Button -->
        <button @click="toggleMode" class="absolute top-6 left-6 text-gray-400 hover:text-blue-600 transition z-30" v-if="isRegisterMode">
            <i class="fa-solid fa-arrow-left mr-2"></i> Kembali
        </button>

        <div class="w-full h-full flex flex-col justify-center p-10 pt-16">
          <h2 class="text-2xl font-bold text-gray-800 mb-1">Buat Akun Baru</h2>
          <p class="text-gray-500 mb-5 text-sm">Lengkapi data di bawah ini untuk mendaftar</p>

          <form @submit.prevent="handleRegister" class="space-y-3">
             <!-- ... Input Register Fields (Sama seperti kode anda sebelumnya) ... -->
             <!-- Nama -->
             <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Nama Lengkap</label>
              <div class="relative">
                <i class="fa-solid fa-id-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input v-model="registerForm.name" type="text" class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="John Doe" required />
              </div>
            </div>
             <!-- Username -->
             <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Username</label>
              <div class="relative">
                <i class="fa-solid fa-at absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input v-model="registerForm.username" type="text" class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="johndoe" required />
              </div>
            </div>
             <!-- Email -->
             <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <div class="relative">
                <i class="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input v-model="registerForm.email" type="email" class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="john@example.com" required />
              </div>
            </div>
             <!-- Password -->
             <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Password</label>
              <div class="relative">
                <i class="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input v-model="registerForm.password" :type="showRegisterPassword ? 'text' : 'password'" class="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="Buat password" required />
                <button type="button" @click="showRegisterPassword = !showRegisterPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600">
                  <i :class="showRegisterPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                </button>
              </div>
            </div>
             <!-- Confirm -->
             <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Konfirmasi Password</label>
              <div class="relative">
                <i class="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input v-model="registerForm.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" class="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="Ulangi password" required />
                <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600">
                  <i :class="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                </button>
              </div>
            </div>

            <button type="submit" :disabled="loading" class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2 mt-4">
              <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
              <span>{{ loading ? 'Mendaftar...' : 'Daftar Sekarang' }}</span>
            </button>
          </form>
        </div>
      </div>
      <!-- END: PANEL KIRI -->

      <!-- ================================================== -->
      <!-- 2. PANEL KANAN: Login Form (White) & Register Info (Green) -->
      <!-- ================================================== -->

      <!-- C. Login Form (Foreground White) -->
      <div 
        class="absolute top-0 right-0 w-1/2 h-full z-20 bg-white transition-transform duration-700 ease-in-out"
        :class="isRegisterMode ? 'translate-x-full' : 'translate-x-0'"
      >
        <div class="w-full h-full flex flex-col justify-center p-10">
          <h2 class="text-2xl font-bold text-gray-800 mb-1">Selamat Datang</h2>
          <p class="text-gray-500 mb-6 text-sm">Silakan masukkan kredensial Anda</p>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Input Identity -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Username / Email</label>
              <div class="relative">
                 <i class="fa-solid fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                 <input 
                  v-model="loginForm.identity" 
                  type="text" 
                  class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="username@gmail.com" 
                  required 
                />
              </div>
            </div>

            <!-- Input Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div class="relative">
                <i class="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  v-model="loginForm.password" 
                  :type="showLoginPassword ? 'text' : 'password'" 
                  class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="••••••••" 
                  required 
                />
                <button 
                  type="button" 
                  @click="showLoginPassword = !showLoginPassword" 
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none"
                >
                  <i :class="showLoginPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                </button>
              </div>
            </div>

            <!-- VISUAL ERROR MESSAGE BLOCK (NEW) -->
            <div v-if="loginErrorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 shadow-sm">
              <i class="fa-solid fa-circle-exclamation text-red-500"></i>
              <span>{{ loginErrorMessage }}</span>
            </div>

            <button type="submit" :disabled="loading" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2">
              <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
              <span>{{ loading ? 'Memproses...' : 'Masuk' }}</span>
            </button>
          </form>
        </div>
      </div>

      <!-- D. Register Info (Background Green) -->
      <div 
        class="absolute top-0 right-0 w-1/2 h-full z-10 transition-transform duration-700 ease-in-out"
        :class="isRegisterMode ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'"
      >
        <div class="w-full h-full bg-green-600 text-white p-10 flex flex-col justify-center">
           <div class="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-4xl backdrop-blur-sm border border-white/30">
            <i class="fa-solid fa-user-plus"></i>
          </div>
          <h1 class="text-3xl font-bold mb-3">Bergabung Bersama Kami</h1>
          <p class="text-green-100 mb-8 text-sm">Daftarkan diri Anda untuk mulai mengelola inventaris dan analisis EOQ secara real-time.</p>
          <button @click="toggleMode" class="bg-white text-green-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-green-50 transition w-fit shadow-lg">
            Sudah Punya Akun?
          </button>
        </div>
      </div>

    </div>

    <!-- Backend Status Footer -->
    <div class="absolute bottom-4 text-xs text-gray-400">
      Backend Connection: 
      <span :class="backendStatus ? 'text-green-500 font-bold' : 'text-red-500 font-bold'">
        {{ backendStatus ? 'Connected' : 'Disconnected' }}
      </span>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';
import AuthPresenter from './AuthPresenter';
import { showToast } from '../../utils/toastify';

// Definisikan Emits
const emit = defineEmits(['login-success', 'login-error']);

// State untuk Error Visual (NEW)
const loginErrorMessage = ref('');

// Inisialisasi Presenter dengan Callbacks
const presenter = new AuthPresenter({
  // 1. LOGIN SUCCESS
  onLoginSuccess: (user) => {
    console.log('View: Callback onLoginSuccess dipanggil', user);
    loading.value = false; 
    loginErrorMessage.value = ''; // Hapus error
    emit('login-success', user);
  },
  
  // 2. LOGIN ERROR
  onLoginError: (message) => {
    console.error('View: Callback onLoginError dipanggil dengan pesan:', message);
    loading.value = false; 
    
    // 1. Set Visual Error Text
    loginErrorMessage.value = message;
    
    // 2. Force Toastify (Backup)
    showToast(message, 'error'); 
    
  },

  // 3. REGISTER SUCCESS
  onRegisterSuccess: (message) => {
    loading.value = false;
    showToast(message, 'success');
    toggleMode(); 
    loginForm.identity = registerForm.username; 
    // Reset register form logic...
    registerForm.name = ''; registerForm.username = ''; registerForm.email = ''; registerForm.password = ''; registerForm.confirmPassword = ''; 
  },

  // 4. REGISTER ERROR
  onRegisterError: (message) => {
    loading.value = false;
    showToast(message, 'error');
  }
});

// State UI
const isRegisterMode = ref(false);
const loading = ref(false);
const backendStatus = ref(false);
const showLoginPassword = ref(false);
const showRegisterPassword = ref(false);
const showConfirmPassword = ref(false);

// Form Data
const loginForm = reactive({
  identity: '',
  password: ''
});

const registerForm = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// Toggle Mode
const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value;
  // Clear error saat toggle
  loginErrorMessage.value = '';
};

// --- HANDLERS ---

const handleLogin = async () => {
  console.log('View: Tombol Login ditekan');
  
  // Clear error sebelumnya
  loginErrorMessage.value = '';

  if (!loginForm.identity || !loginForm.password) {
    loginErrorMessage.value = 'Username dan password wajib diisi';
    showToast('Username dan password wajib diisi', 'error');
    return;
  }

  loading.value = true; 
  
  // Call Presenter
  presenter.login(loginForm.identity, loginForm.password);
};

const handleRegister = async () => {
  // Validasi Client
  if (!registerForm.name || !registerForm.username || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
    showToast('Semua kolom wajib diisi', 'error');
    return;
  }
  if (registerForm.password !== registerForm.confirmPassword) {
    showToast('Konfirmasi password tidak cocok', 'error');
    return;
  }

  loading.value = true;
  presenter.register({ ...registerForm });
};

// Cek Backend
onMounted(async () => {
  try {
    await axios.get('http://localhost:3000/');
    backendStatus.value = true;
  } catch (e) {
    backendStatus.value = false;
  }
});
</script>