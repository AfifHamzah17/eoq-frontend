<template>
  <div class="flex h-screen overflow-hidden bg-gray-100 font-sans">
    
    <!-- 1. SIDEBAR (Kiri) -->
    <div class="w-64 bg-slate-900 text-slate-300 flex flex-col relative z-20 h-full border-r border-slate-800">
      <div class="h-16 flex items-center justify-center border-b border-slate-800 bg-slate-950">
        <span class="font-bold text-xl text-white tracking-wide"><i class="fa-solid fa-boxes-stacked mr-2"></i>EOQ SYS</span>
      </div>
      
      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4">
        <ul class="space-y-1 px-3">
          <!-- Main Menu -->
          <li>
            <button 
              @click="navigate('dashboard')" 
              :class="navClass('dashboard')" 
              class="nav-item w-full text-left px-4 py-3 rounded-lg transition flex items-center group z-20"
            >
              <i class="fa-solid fa-chart-line w-6 group-hover:text-blue-400"></i> Beranda
            </button>
          </li>
          
          <!-- Stock Management (Admin Only) -->
          <li class="mt-4 mb-2 px-4 text-xs uppercase font-bold text-slate-500">Manajemen Stok</li>
          
          <li v-if="isAdmin">
            <button 
              @click="navigate('inventory')" 
              :class="navClass('inventory')" 
              class="nav-item w-full text-left px-4 py-3 rounded-lg transition flex items-center group z-20">
              <i class="fa-solid fa-box w-6 group-hover:text-blue-400"></i> Kelola Barang
            </button>
          </li>

          <!-- Transactions (Admin & Karyawan) -->
          <li class="mt-4 mb-2 px-4 text-xs uppercase font-bold text-slate-500">Transaksi</li>

          <!-- Sales (Admin Only) -->
          <li v-if="isAdmin">
            <button 
              @click="navigate('shipping')" 
              :class="navClass('shipping')" 
              class="nav-item w-full text-left px-4 py-3 rounded-lg transition flex items-center group z-20">
              <i class="fa-solid fa-shipping-fast w-6 group-hover:text-red-400"></i> Pengiriman
            </button>
          </li>

          <!-- Sales (Admin Only) -->
          <li v-if="isAdmin">
            <button 
              @click="navigate('sales')" 
              :class="navClass('sales')" 
              class="nav-item w-full text-left px-4 py-3 rounded-lg transition flex items-center group z-20">
              <i class="fa-solid fa-cash-register w-6 group-hover:text-yellow-400"></i> Penjualan
            </button>
          </li>

          <!-- AI Analysis (Admin Only) -->
          <li class="mt-4 mb-2 px-4 text-xs uppercase font-bold text-slate-500" v-if="isAdmin">Analisis AI</li>
          
          <li v-if="isAdmin">
            <button 
              @click="navigate('eoq')" 
              :class="navClass('eoq')" 
              class="nav-item w-full text-left px-4 py-3 rounded-lg transition flex items-center group z-20">
              <i class="fa-solid fa-brain w-6 group-hover:text-purple-400"></i> Optimasi EOQ
            </button>
          </li>
          
          <li v-if="isAdmin">
            <button 
              @click="navigate('reports')" 
              :class="navClass('reports')" 
              class="nav-item w-full text-left px-4 py-3 rounded-lg transition flex items-center group z-20">
              <i class="fa-solid fa-file-invoice w-6 group-hover:text-blue-400"></i> Laporan
            </button>
          </li>

          <li class="mt-4 mb-2 px-4 text-xs uppercase font-bold text-slate-500">Pengaturan</li>
          
          <li>
            <button 
              @click="navigate('profile')" 
              :class="navClass('profile')" 
              class="w-full text-left px-4 py-3 rounded-lg transition flex items-center group z-20">
              <i class="fa-solid fa-user-gear w-6 group-hover:text-pink-400"></i> Profil Saya
            </button>
          </li>
        </ul>
      </nav>

      <!-- Logout -->
      <div class="p-4 border-t border-slate-800">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 rounded-full bg-blue-500 object-cover border-2 border-blue-100 shadow-sm"></div>
          <div>
            <p class="text-sm font-medium text-white">{{ user?.name }}</p>
            <p class="text-xs text-slate-400 uppercase">{{ user?.role }}</p>
          </div>
        </div>
        <button 
          @click="handleLogout" 
          class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-lg transition"
        >
          <i class="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      </div>
    </div>

    <!-- 2. MAIN CONTENT WRAPPER -->
    <div class="flex-1 flex flex-col h-full overflow-hidden relative z-10">
      
      <!-- HEADER -->
      <div class="bg-white shadow-sm flex items-center justify-between px-8 py-4 border-b border-gray-200 sticky top-0 z-20">
        <h2 class="text-xl font-bold text-gray-800">{{ pageTitle }}</h2>
        <div class="flex items-center gap-4">
          <!-- Search Bar space -->
        </div>
      </div>

      <!-- MAIN AREA -->
      <main class="flex-1 overflow-y-auto p-8 relative">
        <div class="animate-fade-in-float" :key="currentPage">
          <slot></slot>
        </div>
      </main>
    </div>

<!-- 3. MODAL PORTAL -->
<div id="modal-portal" class="fixed inset-0 z-[100] pointer-events-none"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: String,
  user: Object
});

const emit = defineEmits(['navigate', 'logout']);

// --- ADDED MISSING FUNCTION ---
const navigate = (page) => emit('navigate', page);

// --- ADDED MISSING FUNCTION ---
const navClass = (page) => {
  return props.currentPage === page 
    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
    : 'text-slate-300 hover:bg-slate-800 hover:text-white';
};

// --- ADDED MISSING COMPUTED ---
const isAdmin = computed(() => props.user?.role === 'admin');

const pageTitle = computed(() => {
  const titles = {
    'dashboard': 'Beranda',
    'inventory': 'Kelola Data Barang',
    'distributors': 'Data Distributor',
    'stock-levels': 'Jumlah Stok Gudang',
    'sales': 'Kasir Penjualan',
    'eoq': 'Optimasi EOQ (AI Model)',
    'reports': 'Laporan Lengkap',
    'shipping': 'Pengiriman',
    'profile': 'Profil Pengguna'
  };
  return titles[props.currentPage] || 'Sistem EOQ';
});

const handleLogout = () => emit('logout');
</script>

<style>
/* Animasi Fade In */
@keyframes fadeInFloat {
  0% { opacity: 0; transform: translateY(30px) scale(0.95); }
  /* FIXED SYNTAX ERROR: Added semicolon below */
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-float {
  animation: fadeInFloat 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>