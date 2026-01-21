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

        <!-- Reports -->
        <PlaceholderView 
          v-else-if="['distributors', 'sales', 'reports'].includes(currentPage)" 
          :page="currentPage" 
          @navigate="handleNavigate" 
        />
        
        <!-- Profile (Updated) -->
        <ProfileView v-else-if="currentPage === 'profile'" :user="currentUser" />
      
      </div>
    </TheLayout>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { showToast } from './utils/toastify';

// Import Views (Pastikan path folder 'others' huruf kecil karena sesuai file tree Anda)
import AuthView from './features/auth/AuthView.vue';
import DashboardView from './features/dashboard/DashboardView.vue';
import InventoryView from './features/inventory/InventoryView.vue';
import StockLevelsView from './features/stock/StockLevelsView.vue';

import EOQView from './features/eoq-analysis/EOQView.vue';
import ShippingView from './features/shipping/ShippingView.vue';
// PERBAIKAN: Import dari folder 'others'
import PlaceholderView from './features/others/PlaceholderView.vue'; 
import ProfileView from './features/profile/ProfileView.vue'; 
import TheLayout from './components/Layout/TheLayout.vue';
import Storage from './utils/storage';

const currentUser = ref(null);
const currentPage = ref('dashboard');

// --- FUNGSI REFRESH GLOBAL USER ---
const refreshGlobalUser = () => {
  const user = Storage.getUser();
  if (user) {
    currentUser.value = user;
  }
};

// Lifecycle Hooks
onMounted(() => {
  const user = Storage.getUser();
  if(user) {
    currentUser.value = user;
  }

  // Pasang Listener
  window.addEventListener('user-updated', refreshGlobalUser);
});

// Hapus Listener saat komponen hancur
onUnmounted(() => {
  window.removeEventListener('user-updated', refreshGlobalUser);
});

// --- HANDLERS ---
const handleLoginSuccess = (user) => {
  Storage.setUser(user);
  currentUser.value = user;
  showToast('Login Berhasil', 'success');
};

const handleLogout = () => {
  Storage.clearUser();
  currentUser.value = null;
  currentPage.value = 'dashboard';
};

const handleNavigate = (page) => {
  currentPage.value = page;
};
</script>