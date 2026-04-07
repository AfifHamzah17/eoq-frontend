<!-- src/features/auth/AuthView.vue -->
<template>
  <section class="fixed inset-0 bg-gradient-to-br from-slate-100 to-slate-200 z-50 flex items-center justify-center overflow-hidden p-4 md:p-0">
    <div class="relative w-full max-w-4xl h-[calc(100vh-2rem)] md:h-[720px] shadow-2xl rounded-2xl overflow-hidden bg-white">

      <!-- Login Info Panel -->
      <div
        class="hidden md:block absolute top-0 left-0 w-1/2 h-full z-10 transition-transform duration-700 ease-in-out"
        :class="isRegisterMode ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'"
      >
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

      <!-- Register Form -->
      <div
        class="absolute top-0 left-0 w-full md:w-1/2 h-full z-20 bg-white transition-transform duration-700 ease-in-out overflow-y-auto"
        :class="isRegisterMode ? 'translate-x-0' : '-translate-x-full md:-translate-x-full'"
      >
        <button @click="toggleMode" class="absolute top-6 left-6 text-gray-400 hover:text-blue-600 transition z-30" v-if="isRegisterMode">
          <i class="fa-solid fa-arrow-left mr-2"></i> Kembali
        </button>

        <div class="w-full h-full flex flex-col justify-center p-8 md:p-10 pt-16">
          <h2 class="text-2xl font-bold text-gray-800 mb-1">Buat Akun Baru</h2>
          <p class="text-gray-500 mb-5 text-sm">Lengkapi data di bawah ini untuk mendaftar</p>

          <form @submit.prevent="handleRegister" class="space-y-3">
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

            <!-- ========== NO HP (BARU) ========== -->
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">No. HP</label>
              <div class="relative">
                <i class="fa-solid fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  v-model="registerForm.noHp"
                  type="tel"
                  inputmode="numeric"
                  class="w-full pl-9 pr-12 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="08123456789"
                  @input="onNoHpInput"
                  required
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none">
                  {{ registerForm.noHp.length }}/14
                </span>
              </div>
              <p v-if="noHpError" class="text-[11px] text-red-500 mt-0.5">{{ noHpError }}</p>
            </div>

            <!-- Cabang -->
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Nama Cabang</label>
              <div class="relative">
                <i class="fa-solid fa-store absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <select v-model="registerForm.namaCabang" class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none appearance-none bg-white" required>
                  <option disabled value="">Pilih Cabang</option>
                  <option v-for="store in storeList" :key="store" :value="store">{{ store }}</option>
                </select>
                <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
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

            <!-- Konfirmasi Password -->
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

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
            >
              <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
              <span>{{ loading ? 'Mendaftar...' : 'Daftar Sekarang' }}</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Login Form -->
      <div
        class="absolute top-0 right-0 w-full md:w-1/2 h-full z-20 bg-white transition-transform duration-700 ease-in-out"
        :class="isRegisterMode ? 'translate-x-full' : 'translate-x-0'"
      >
        <div class="w-full h-full flex flex-col justify-center p-8 md:p-10">
          <div class="md:hidden mb-6 text-center">
            <button @click="toggleMode" class="text-blue-600 text-sm font-semibold hover:underline">Belum punya akun? Daftar</button>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-1">Selamat Datang</h2>
          <p class="text-gray-500 mb-6 text-sm">Silakan masukkan kredensial Anda</p>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Username / Email</label>
              <div class="relative">
                <i class="fa-solid fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input v-model="loginForm.identity" type="text" class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="username@gmail.com" required />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div class="relative">
                <i class="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input v-model="loginForm.password" :type="showLoginPassword ? 'text' : 'password'" class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" required />
                <button type="button" @click="showLoginPassword = !showLoginPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none">
                  <i :class="showLoginPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                </button>
              </div>
            </div>

            <div v-if="loginErrorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 shadow-sm">
              <i class="fa-solid fa-circle-exclamation text-red-500"></i>
              <span>{{ loginErrorMessage }}</span>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
              <span>{{ loading ? 'Memproses...' : 'Masuk' }}</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Register Info Panel -->
      <div
        class="hidden md:block absolute top-0 right-0 w-1/2 h-full z-10 transition-transform duration-700 ease-in-out"
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
import { STORE_LIST } from './AuthModel';
import { showToast } from '../../utils/toastify';

const emit = defineEmits(['login-success', 'login-error']);
const storeList = ref(STORE_LIST);
const loginErrorMessage = ref('');
const noHpError = ref('');

const presenter = new AuthPresenter({
  onLoginSuccess: (userData) => {
    loading.value = false;
    loginErrorMessage.value = '';
    emit('login-success', userData);
  },
  onLoginError: (message) => {
    loading.value = false;
    loginErrorMessage.value = message;
    showToast(message, 'error');
  },
  onRegisterSuccess: (message) => {
    loading.value = false;
    showToast(message, 'success');
    toggleMode();
    loginForm.identity = registerForm.username;
    resetRegisterForm();
  },
  onRegisterError: (message) => {
    loading.value = false;
    showToast(message, 'error');
  }
});

const isRegisterMode = ref(false);
const loading = ref(false);
const backendStatus = ref(false);
const showLoginPassword = ref(false);
const showRegisterPassword = ref(false);
const showConfirmPassword = ref(false);

const loginForm = reactive({ identity: '', password: '' });

const registerForm = reactive({
  name: '',
  username: '',
  email: '',
  noHp: '',          // BARU
  namaCabang: '',
  password: '',
  confirmPassword: ''
});

// ==================== VALIDASI NO HP ====================
const onNoHpInput = (e) => {
  // Hanya angka, max 14 digit
  const raw = e.target.value.replace(/[^0-9]/g, '');
  registerForm.noHp = raw.substring(0, 14);
  noHpError.value = '';
};

const validateNoHp = () => {
  const val = registerForm.noHp;
  if (!val || val.length === 0) {
    noHpError.value = 'No. HP wajib diisi';
    return false;
  }
  if (!val.startsWith('0')) {
    noHpError.value = 'Harus diawali angka 0';
    return false;
  }
  if (val.length < 10) {
    noHpError.value = 'Minimal 10 digit';
    return false;
  }
  noHpError.value = '';
  return true;
};

// ==================== RESET FORM ====================
const resetRegisterForm = () => {
  registerForm.name = '';
  registerForm.username = '';
  registerForm.email = '';
  registerForm.noHp = '';
  registerForm.namaCabang = '';
  registerForm.password = '';
  registerForm.confirmPassword = '';
  noHpError.value = '';
};

const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value;
  loginErrorMessage.value = '';
};

// ==================== LOGIN ====================
const handleLogin = async () => {
  loginErrorMessage.value = '';
  if (!loginForm.identity || !loginForm.password) {
    loginErrorMessage.value = 'Username dan password wajib diisi';
    showToast('Username dan password wajib diisi', 'error');
    return;
  }
  loading.value = true;
  presenter.login(loginForm.identity, loginForm.password);
};

// ==================== REGISTER ====================
const handleRegister = async () => {
  // Validasi semua field
  const required = ['name', 'username', 'email', 'noHp', 'namaCabang', 'password', 'confirmPassword'];
  for (const key of required) {
    if (!registerForm[key]) {
      showToast('Semua kolom wajib diisi', 'error');
      return;
    }
  }

  // Validasi No HP
  if (!validateNoHp()) {
    showToast(noHpError.value, 'error');
    return;
  }

  // Validasi password cocok
  if (registerForm.password !== registerForm.confirmPassword) {
    showToast('Konfirmasi password tidak cocok', 'error');
    return;
  }

  loading.value = true;
  presenter.register({ ...registerForm });
};

// ==================== CHECK BACKEND ====================
onMounted(async () => {
  try {
    await axios.get('http://localhost:3000/');
    backendStatus.value = true;
  } catch (e) {
    backendStatus.value = false;
  }
});
</script>