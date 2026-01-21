<template>
  <aside class="w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300">
    <div class="h-16 flex items-center justify-center border-b border-slate-800 bg-slate-950">
      <span class="font-bold text-xl text-white tracking-wide"><i class="fa-solid fa-boxes-stacked mr-2"></i>EOQ SYS</span>
    </div>
    
    <nav class="flex-1 overflow-y-auto py-4">
      <ul class="space-y-1 px-3">
        <!-- Main Menu (Semua) -->
        <li>
          <button @click="navigate('dashboard')" :class="navClass('dashboard')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition flex items-center group">
            <i class="fa-solid fa-chart-line w-6 group-hover:text-blue-400"></i> Beranda
          </button>
        </li>
        
        <!-- STOCK MANAGEMENT (ADMIN ONLY - Baca Data) -->
        <li class="mt-4 mb-2 px-4 text-xs uppercase font-bold text-slate-500" v-if="isAdmin">Manajemen Stok</li>
        
        <li v-if="isAdmin">
          <button @click="navigate('inventory')" :class="navClass('inventory')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition flex items-center group">
            <i class="fa-solid fa-box w-6 group-hover:text-blue-400"></i> Kelola Barang
          </button>
        </li>
        
        <li v-if="isAdmin">
          <button @click="navigate('stock-levels')" :class="navClass('stock-levels')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition flex items-center group">
            <i class="fa-solid fa-warehouse w-6 group-hover:text-blue-400"></i> Jumlah Stok
          </button>
        </li>
        
        <!-- TRANSACTIONS (INPUT - ADMIN & KARYAWAN) -->
        <li class="mt-4 mb-2 px-4 text-xs uppercase font-bold text-slate-500">Transaksi</li>
        <li>
          <button 
            @click="$emit('navigate', 'shipping')"
            :class="['w-full text-left transition-colors', currentPage === 'shipping' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']"
            class="px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3"
          >
            <i class="fa-solid fa-truck-fast"></i> Pengiriman
          </button>
      </li>
        <!-- SALES & Laporan (ADMIN ONLY) -->
        <li v-if="isAdmin">
          <button @click="navigate('sales')" :class="navClass('sales')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition flex items-center group">
            <i class="fa-solid fa-cash-register w-6 group-hover:text-yellow-400"></i> Penjualan
          </button>
        </li>

        <!-- AI ANALYSIS (ADMIN ONLY) -->
        <li class="mt-4 mb-2 px-4 text-xs uppercase font-bold text-slate-500" v-if="isAdmin">Analisis AI</li>
        
        <li v-if="isAdmin">
          <button @click="navigate('eoq')" :class="navClass('eoq')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition flex items-center group">
            <i class="fa-solid fa-brain w-6 group-hover:text-purple-400"></i> Optimasi EOQ
          </button>
        </li>
        
        <li v-if="isAdmin">
          <button @click="navigate('reports')" :class="navClass('reports')" class="nav-item w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition flex items-center group">
            <i class="fa-solid fa-file-invoice w-6 group-hover:text-blue-400"></i> Laporan
          </button>
        </li>
      </ul>
    </nav>

    <div class="p-4 border-t border-slate-800">
      <div class="flex items-center gap-3 mb-3">
        <img :src="user?.avatar || 'https://via.placeholder.com/40'" class="w-8 h-8 rounded-full bg-blue-500 object-cover" alt="Avatar">
        <div>
          <p class="text-sm font-medium text-white">{{ user?.name }}</p>
          <p class="text-xs text-slate-500 uppercase">{{ user?.role }}</p>
        </div>
      </div>
      <button @click="handleLogout" class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-lg transition">
        <i class="fa-solid fa-right-from-bracket"></i> Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import Storage from '../../utils/storage';
import AuthPresenter from '../../features/auth/AuthPresenter';

const props = defineProps({
  currentPage: String,
  user: Object
});

const emit = defineEmits(['navigate', 'logout']);

// Init Presenter untuk logout
const presenter = new AuthPresenter({
  onLoginSuccess: () => {}, // tidak dipakai di sidebar
  onLogoutSuccess: () => emit('logout'),
  onLoginError: () => {}
});

const navClass = (page) => {
  return props.currentPage === page ? 'bg-slate-800 text-white' : '';
};

const navigate = (page) => emit('navigate', page);
const handleLogout = () => presenter.logout();

// Computed untuk Cek Role
const isAdmin = computed(() => {
  return props.user?.role === 'admin';
});
</script>