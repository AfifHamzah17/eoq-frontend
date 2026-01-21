<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Status Stok Gudang</h2>
        <p class="text-gray-500 text-sm">Monitoring real-time ketersediaan barang.</p>
      </div>
      <button @click="loadData" class="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition">
        <i class="fa-solid fa-rotate-right mr-2"></i> Refresh
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div v-if="isLoading" class="p-12 text-center text-gray-500">
        <i class="fa-solid fa-circle-notch fa-spin text-2xl mb-2"></i>
        <p>Memuat data stok...</p>
      </div>

      <div v-else-if="items.length === 0" class="p-12 text-center text-gray-500">
        <i class="fa-solid fa-box-open text-4xl mb-3 text-gray-300"></i>
        <p>Belum ada data barang.</p>
      </div>

      <table v-else class="w-full text-sm text-left">
        <thead class="bg-gray-50 text-gray-700 uppercase font-bold text-xs border-b">
          <tr>
            <th class="px-6 py-4">Kode Barang</th>
            <th class="px-6 py-4">Nama Barang</th>
            <th class="px-6 py-4 text-center">Stok Saat Ini</th>
            <th class="px-6 py-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-4 font-medium text-gray-900">{{ item.code }}</td>
            <td class="px-6 py-4">{{ item.name }}</td>
            <td class="px-6 py-4 text-center">
              <span class="font-bold text-gray-700 text-lg">{{ item.stock.toLocaleString('id-ID') }}</span>
            </td>
            <td class="px-6 py-4 text-center">
              <!-- Logic Warna Status -->
              <span 
                v-if="item.stock === 0"
                class="px-3 py-1 rounded-full text-xs font-bold border bg-red-50 text-red-600 border-red-200"
              >
                Habis
              </span>
              <span 
                v-else-if="item.stock < 10"
                class="px-3 py-1 rounded-full text-xs font-bold border bg-red-100 text-red-700 border-red-200"
              >
                Kritis
              </span>
              <span 
                v-else-if="item.stock < 50"
                class="px-3 py-1 rounded-full text-xs font-bold border bg-yellow-100 text-yellow-700 border-yellow-200"
              >
                Menipis
              </span>
              <span 
                v-else
                class="px-3 py-1 rounded-full text-xs font-bold border bg-green-100 text-green-700 border-green-200"
              >
                Aman
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StockPresenter from './StockPresenter';
import { showToast } from '../../utils/toastify';

// --- STATE ---
const items = ref([]);
const isLoading = ref(false);

// --- PRESENTER ---
const presenter = new StockPresenter({
  setItems: (data) => items.value = data,
  showLoading: (state) => isLoading.value = state,
  onSuccess: () => {}, // Tidak dipakai di view ini
  showError: (msg) => showToast(msg, 'error'),
  resetForm: () => {} // Tidak dipakai
});

// --- ACTIONS ---
const loadData = () => {
  presenter.loadItems();
};

onMounted(() => {
  loadData();
});
</script>