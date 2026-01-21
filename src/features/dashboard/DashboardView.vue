<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex justify-between items-start">
          <div><p class="text-sm text-gray-500 mb-1">Total Barang</p><h3 class="text-2xl font-bold text-gray-800">{{ stats.totalItems }}</h3></div>
          <div class="p-3 bg-blue-50 text-blue-600 rounded-lg"><i class="fa-solid fa-box"></i></div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex justify-between items-start">
          <div><p class="text-sm text-gray-500 mb-1">Nilai Stok</p><h3 class="text-2xl font-bold text-gray-800">{{ formatRupiah(stats.stockValue) }}</h3></div>
          <div class="p-3 bg-green-50 text-green-600 rounded-lg"><i class="fa-solid fa-sack-dollar"></i></div>
        </div>
      </div>
      <!-- ... other stats cards ... -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex justify-between items-start">
          <div><p class="text-sm text-gray-500 mb-1">Transaksi Bulan Ini</p><h3 class="text-2xl font-bold text-gray-800">128</h3></div>
          <div class="p-3 bg-purple-50 text-purple-600 rounded-lg"><i class="fa-solid fa-arrow-right-arrow-left"></i></div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex justify-between items-start">
          <div><p class="text-sm text-gray-500 mb-1">Barang Rendah</p><h3 class="text-2xl font-bold text-red-600">{{ stats.lowStock }}</h3></div>
          <div class="p-3 bg-red-50 text-red-600 rounded-lg"><i class="fa-solid fa-triangle-exclamation"></i></div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="font-bold text-gray-700 mb-4">Aktivitas Transaksi Terakhir</h3>
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-500 uppercase bg-gray-50">
            <tr><th class="px-4 py-3">Tanggal</th><th class="px-4 py-3">Barang</th><th class="px-4 py-3">Tipe</th><th class="px-4 py-3">Jumlah</th></tr>
          </thead>
          <tbody>
            <tr v-for="t in transactions" :key="t.id" class="border-b last:border-0">
              <td class="px-4 py-3 text-gray-500">{{ t.date }}</td>
              <td class="px-4 py-3 font-medium">{{ t.itemName }}</td>
              <td class="px-4 py-3 text-xs font-bold uppercase" :class="t.type === 'Masuk' ? 'text-green-600' : 'text-red-600'">{{ t.type }}</td>
              <td class="px-4 py-3">{{ t.qty }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
        <div class="mb-4 text-blue-600 text-5xl"><i class="fa-solid fa-robot"></i></div>
        <h3 class="font-bold text-gray-800 text-lg">Sistem Optimasi Siap</h3>
        <p class="text-gray-500 text-sm mt-2">Gunakan menu <span class="font-semibold text-blue-600">Optimasi EOQ</span> untuk menghitung jumlah pemesanan ekonomis.</p>
        <button @click="$emit('navigate', 'eoq')" class="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">Mulai Analisis</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import DashboardPresenter from './DashboardPresenter';

const stats = ref({ totalItems: 0, stockValue: 0, lowStock: 0 });
const transactions = ref([]);
const emit = defineEmits(['navigate']);

const presenter = new DashboardPresenter({
  setStats: (s) => stats.value = s,
  setTransactions: (t) => transactions.value = t
});

const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

onMounted(() => presenter.loadData());
</script>