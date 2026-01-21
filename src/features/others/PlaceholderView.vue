<template>
  <div class="flex flex-col items-center justify-center h-full text-center bg-white p-12 rounded-xl border border-dashed border-gray-300">
    <i :class="iconClass" class="text-6xl text-gray-300 mb-4"></i>
    <h3 class="text-2xl font-bold text-gray-700">{{ pageTitle }}</h3>
    <p class="text-gray-500 mt-2">Fitur ini sedang dalam pengembangan.</p>
    <button @click="$emit('navigate', 'dashboard')" class="mt-6 text-blue-600 hover:underline">
      Kembali ke Beranda
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  page: String // 'distributors', 'sales', 'reports'
});

const emit = defineEmits(['navigate']);

const iconClass = computed(() => {
  if (props.page === 'distributors') return 'fa-solid fa-truck-fast';
  if (props.page === 'sales') return 'fa-solid fa-cash-register';
  if (props.page === 'reports') return 'fa-solid fa-file-invoice';
  return 'fa-solid fa-code';
});

const pageTitle = computed(() => {
  const titles = {
    'distributors': 'Manajemen Distributor',
    'sales': 'Kasir Penjualan',
    'reports': 'Laporan Lengkap'
  };
  return titles[props.page] || 'Halaman';
});
</script>