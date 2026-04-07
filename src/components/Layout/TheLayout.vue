<template>
  <div class="flex h-screen overflow-hidden bg-gray-100 font-sans">
    <!-- SIDEBAR -->
    <div class="w-64 bg-slate-900 text-slate-300 flex flex-col relative z-20 h-full border-r border-slate-800">
      <div class="h-16 flex items-center justify-center border-b border-slate-800 bg-slate-950">
        <img class="w-10 h-10 mr-2" src="/pajri.png" alt="Logo">
        <span class="font-bold text-xl text-white tracking-wide">HSB Group</span>
      </div>
      
      <nav class="flex-1 overflow-y-auto py-4">
        <ul class="space-y-1 px-3">

          <!-- ========== ADMIN ONLY ========== -->
          <template v-if="isAdmin">
            <li>
              <button @click="navigate('dashboard')" :class="navClass('dashboard')" class="w-full text-left px-4 py-3 rounded-lg transition flex items-center group z-20">
                <i class="fa-solid fa-chart-line w-6 group-hover:text-blue-400"></i> Beranda
              </button>
            </li>
            <li class="mt-4 mb-2 px-4 text-xs uppercase font-bold text-slate-500">Manajemen Stok</li>
            <li>
              <button @click="navigate('inventory')" :class="navClass('inventory')" class="w-full text-left px-4 py-3 rounded-lg transition flex items-center group z-20">
                <i class="fa-solid fa-box w-6 group-hover:text-blue-400"></i> Kelola Barang
              </button>
            </li>
            <li class="mt-4 mb-2 px-4 text-xs uppercase font-bold text-slate-500">Transaksi</li>
            <li>
              <button @click="navigate('shipping')" :class="navClass('shipping')" class="w-full text-left px-4 py-3 rounded-lg transition flex items-center group z-20">
                <i class="fa-solid fa-shipping-fast w-6 group-hover:text-red-400"></i> Pengiriman
              </button>
            </li>
            <li>
              <button @click="navigate('sales')" :class="navClass('sales')" class="w-full text-left px-4 py-3 rounded-lg transition flex items-center group z-20">
                <i class="fa-solid fa-cash-register w-6 group-hover:text-yellow-400"></i> Penjualan
              </button>
            </li>
            <li class="mt-4 mb-2 px-4 text-xs uppercase font-bold text-slate-500">Analisis AI</li>
            <li>
              <button @click="navigate('eoq')" :class="navClass('eoq')" class="w-full text-left px-4 py-3 rounded-lg transition flex items-center group z-20">
                <i class="fa-solid fa-brain w-6 group-hover:text-purple-400"></i> Optimasi EOQ
              </button>
            </li>
            <li class="mt-4 mb-2 px-4 text-xs uppercase font-bold text-slate-500">Pengaturan</li>
            <li>
              <button @click="navigate('users')" :class="navClass('users')" class="w-full text-left px-4 py-3 rounded-lg transition flex items-center group z-20">
                <i class="fa-solid fa-user-gear w-6 group-hover:text-yellow-400"></i> Manajemen Akun
                <span v-if="pendingUserCount > 0" class="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">{{ pendingUserCount }}</span>
              </button>
            </li>
          </template>

          <!-- ========== PETUGAS CABANG (USER) ========== -->
          <template v-else>
            <li class="mb-2 px-4 text-xs uppercase font-bold text-slate-500">Stok</li>
            <li>
              <button @click="navigate('inventory')" :class="navClass('inventory')" class="w-full text-left px-4 py-3 rounded-lg transition flex items-center group z-20">
                <i class="fa-solid fa-box w-6 group-hover:text-blue-400"></i> Kelola Barang
              </button>
            </li>
            <li class="mt-4 mb-2 px-4 text-xs uppercase font-bold text-slate-500">Transaksi</li>
            <li>
              <button @click="navigate('sales')" :class="navClass('sales')" class="w-full text-left px-4 py-3 rounded-lg transition flex items-center group z-20">
                <i class="fa-solid fa-cash-register w-6 group-hover:text-yellow-400"></i> Penjualan
              </button>
            </li>
          </template>

          <!-- ========== SEMUA ROLE: PROFIL ========== -->
          <li class="mt-4 mb-2 px-4 text-xs uppercase font-bold text-slate-500">Akun</li>
          <li>
            <button @click="navigate('profile')" :class="navClass('profile')" class="w-full text-left px-4 py-3 rounded-lg transition flex items-center group z-20">
              <i class="fa-solid fa-user w-6 group-hover:text-pink-400"></i> Profil Saya
            </button>
          </li>
        </ul>
      </nav>

      <!-- BOTTOM USER INFO -->
      <div class="p-4 border-t border-slate-800">
        <div class="flex items-center gap-3 mb-3">
          <img
            v-if="userAvatar"
            :src="userAvatar"
            class="w-9 h-9 rounded-full object-cover border-2 border-blue-400 shadow-sm"
            alt="Avatar"
          />
          <div
            v-else
            class="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm border-2 border-blue-400 shadow-sm"
          >
            {{ userInitials }}
          </div>
          <div class="overflow-hidden">
            <p class="text-sm font-medium text-white truncate">{{ userName }}</p>
            <p class="text-xs text-slate-400 uppercase">{{ isAdmin ? 'Administrator' : 'Petugas Cabang' }}</p>
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

    <!-- MAIN CONTENT -->
    <div class="flex-1 flex flex-col h-full overflow-hidden relative z-10">
      <div class="bg-white shadow-sm flex items-center justify-between px-8 py-4 border-b border-gray-200 sticky top-0 z-20">
        <h2 class="text-xl font-bold text-gray-800">{{ pageTitle }}</h2>
        <div class="flex items-center gap-3">
          <span v-if="!isAdmin" class="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full border">
            <i class="fa-solid fa-store mr-1 text-gray-400"></i>{{ userCabang }}
          </span>
        </div>
      </div>
      <main class="flex-1 overflow-y-auto p-8 relative">
        <div class="animate-fade-in-float" :key="currentPage">
          <slot></slot>
        </div>
      </main>
    </div>
    
    <div id="modal-portal" class="fixed inset-0 z-[100] pointer-events-none"></div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '../../composables/useUserStore';

const props = defineProps({ currentPage: String });
const emit = defineEmits(['navigate', 'logout']);
const pendingUserCount = ref(0);

const {
  user: storeUser,
  initialize,
  fetchCurrentUser,
  logout: storeLogout,
  userRole,
  userName,
  userCabang,
  userAvatar,
  userInitials
} = useUserStore();

const user = computed(() => storeUser.value);
const isAdmin = computed(() => userRole.value === 'admin');

onMounted(async () => {
  initialize();
  await fetchCurrentUser();
  window.addEventListener('user-updated', onProfileUpdate);
});

onUnmounted(() => {
  window.removeEventListener('user-updated', onProfileUpdate);
});

const onProfileUpdate = () => {};

const navigate = (page) => emit('navigate', page);
const navClass = (page) =>
  props.currentPage === page
    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
    : 'text-slate-300 hover:bg-slate-800 hover:text-white';

const pageTitle = computed(() => {
  const map = {
    dashboard: 'Beranda',
    inventory: 'Kelola Data Barang',
    distributors: 'Data Distributor',
    'stock-levels': 'Jumlah Stok Gudang',
    sales: 'Kasir Penjualan',
    eoq: 'Optimasi EOQ (AI Model)',
    reports: 'Laporan Lengkap',
    shipping: 'Pengiriman',
    profile: 'Profil Pengguna',
    users: 'Manajemen Pengguna'
  };
  return map[props.currentPage] || 'Sistem EOQ';
});

const handleLogout = () => {
  storeLogout();
  emit('logout');
};
</script>

<style>
@keyframes fadeInFloat {
  0% { opacity: 0; transform: translateY(30px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-float {
  animation: fadeInFloat 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>