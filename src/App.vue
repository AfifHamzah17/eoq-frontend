<template>
  <div id="app" class="text-gray-800 font-sans">
    <!-- Login View -->
    <!-- Tambahkan @login-error untuk menangkap error dari AuthView -->
    <AuthView 
      v-if="!currentUser" 
      @login-success="handleLoginSuccess" 
      @login-error="handleLoginError" 
    />

    <!-- App Layout -->
    <TheLayout 
      v-else 
      :current-page="currentPage" 
      :user="currentUser" 
      @navigate="handleNavigate" 
      @logout="handleLogout"
    >
      <div class="animate-fade-in-float" :key="currentPage">
        <!-- Dashboard -->
        <DashboardView v-if="currentPage === 'dashboard'" />
        
        <!-- Inventory -->
        <InventoryView v-else-if="currentPage === 'inventory'" />
        
        <!-- Stock Levels -->
        <StockLevelsView v-else-if="currentPage === 'stock-levels'" />
        
        <!-- EOQ -->
        <EOQView v-else-if="currentPage === 'eoq'" />

        <!-- Shipping -->
        <ShippingView v-else-if="currentPage === 'shipping'" />

        <!-- SALES -->
        <SalesView v-else-if="currentPage === 'sales'" />

        <!-- Reports -->
        <PlaceholderView 
          v-else-if="['distributors', 'reports'].includes(currentPage)" 
          :page="currentPage" 
          @navigate="handleNavigate" 
        />
        
        <!-- Profile -->
        <ProfileView v-else-if="currentPage === 'profile'" :user="currentUser" />
      
      </div>
    </TheLayout>
  </div>
</template>

<script setup>
import { provide } from 'vue';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { showToast } from './utils/toastify';

// Import Views
import AuthView from './features/auth/AuthView.vue';
import DashboardView from './features/dashboard/DashboardView.vue';
import InventoryView from './features/inventory/InventoryView.vue';
import StockLevelsView from './features/stock/StockLevelsView.vue';
import EOQView from './features/eoq-analysis/EOQView.vue';
import ShippingView from './features/shipping/ShippingView.vue';
import SalesView from './features/sales/SalesView.vue'; 
import PlaceholderView from './features/others/PlaceholderView.vue'; 
import ProfileView from './features/profile/ProfileView.vue'; 
import TheLayout from './components/Layout/TheLayout.vue';
import Storage from './utils/storage';

const currentUser = ref(null);
// Ambil halaman terakhir dari localStorage, default 'dashboard' jika tidak ada
const currentPage = ref(localStorage.getItem('lastPage') || 'dashboard');

const refreshGlobalUser = () => {
  const user = Storage.getUser();
  if (user) currentUser.value = user;
};

onMounted(() => {
  const user = Storage.getUser();
  if(user) currentUser.value = user;
  window.addEventListener('user-updated', refreshGlobalUser);
});

onUnmounted(() => window.removeEventListener('user-updated', refreshGlobalUser));

// Watcher: Simpan setiap perubahan halaman ke localStorage
watch(currentPage, (newPage) => {
  localStorage.setItem('lastPage', newPage);
});

// --- HANDLERS ---

// 1. Handle Login Success
const handleLoginSuccess = (user) => {
  Storage.setUser(user);
  currentUser.value = user;
  
  // Logika Routing Berdasarkan Role
  if (user && user.role === 'admin') {
    const lastPage = localStorage.getItem('lastPage');
    currentPage.value = lastPage || 'dashboard';
    // Toast Success Admin
    showToast(`Selamat datang kembali, Admin!`, 'success');
  } else {
    currentPage.value = 'inventory';
    // Toast Success Karyawan/User Biasa
    showToast(`Login berhasil, selamat datang ${user.name || ''}!`, 'success');
  }
};

// 2. Handle Login Error (Dipanggil dari AuthView emit)
const handleLoginError = (errorMessage) => {
  // Toast Error (Password salah, user tidak ditemukan, dll)
  showToast(errorMessage || 'Terjadi kesalahan saat login', 'error');

  console.warn('Login attempt failed:', errorMessage);

};

// 3. Handle Logout
const handleLogout = () => {
  // Simpan nama sebelum dihapus untuk pesan perpisahan (opsional)
  // const name = currentUser.value?.name;
  
  Storage.clearUser();
  currentUser.value = null;
  localStorage.removeItem('lastPage');
  currentPage.value = 'dashboard'; 
  
  // Toast Logout
  showToast('Anda telah berhasil logout.', 'info');
};

const handleNavigate = (page) => {
  currentPage.value = page;
};

provide('navigateFunction', handleNavigate);
</script>