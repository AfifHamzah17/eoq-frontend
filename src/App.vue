<template>
  <div id="app" class="text-gray-800 font-sans">
    <!-- Login View -->
    <AuthView v-if="!currentUser" @login-success="handleLoginSuccess" />

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
import { ref, onMounted, onUnmounted, watch } from 'vue'; // Tambahkan watch
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

const handleLoginSuccess = (user) => {
  Storage.setUser(user);
  currentUser.value = user;
  
  // Logika Routing Berdasarkan Role
  if (user && user.role === 'admin') {
    // Admin: Cek apakah ada halaman terakhir yang tersimpan, jika tidak arahkan ke dashboard
    const lastPage = localStorage.getItem('lastPage');
    currentPage.value = lastPage || 'dashboard';
    showToast('Login Berhasil sebagai Admin', 'success');
  } else {
    // Bukan Admin: Paksa arahkan ke inventory (kelola barang)
    currentPage.value = 'inventory';
    showToast('Login Berhasil', 'success');
  }
};

const handleLogout = () => {
  Storage.clearUser();
  currentUser.value = null;
  // Hapus cache halaman saat logout agar bersih
  localStorage.removeItem('lastPage');
  currentPage.value = 'dashboard'; 
};

const handleNavigate = (page) => {
  currentPage.value = page;
};

provide('navigateFunction', handleNavigate);
</script>