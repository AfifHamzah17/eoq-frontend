<!-- frontend/views/EoqView.vue -->
<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-float">
    <!-- Input Section (Kiri) -->
    <div class="lg:col-span-5 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
      <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <i class="fa-solid fa-sliders"></i> Parameter EOQ Global
      </h3>
      
      <!-- Display Data Global -->
      <div class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
        <div class="flex justify-between items-center">
          <div>
            <span class="text-xs font-bold text-gray-500 uppercase">Total Stok Saat Ini (D)</span>
            <p class="text-sm text-gray-800 mt-1">
              <i class="fa-solid fa-box-open text-blue-500 mr-1"></i>
              {{ globalData.totalStock.toLocaleString('id-ID') }} Unit
            </p>
          </div>
          <button @click="refreshGlobalData" class="text-xs text-blue-600 hover:underline">
            <i class="fa-solid fa-arrows-rotate mr-1"></i> Refresh
          </button>
        </div>
        
        <div class="border-t border-gray-200 pt-3">
          <span class="text-xs font-bold text-gray-500 uppercase">Biaya Pemesanan Rata-rata (S)</span>
          <p class="text-sm text-gray-800 mt-1">
            <i class="fa-solid fa-truck-fast text-green-500 mr-1"></i>
            <span class="font-bold text-lg">{{ formatRupiah(globalData.avgShippingCost) }}</span>
          </p>
          <p class="text-[10px] text-gray-400 mt-1">Rata-rata dari semua data pengiriman</p>
        </div>
      </div>

      <form @submit.prevent="handleCalculate">
        <div class="space-y-4">
          <!-- Input 1: Biaya Simpan per Tahun -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Biaya Simpan per Tahun (Total)</label>
            <div class="relative mt-1">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm font-bold">Rp</span>
              </div>
              <input 
                :value="formattedHTahun"
                @input="handleHTahunInput"
                type="text" 
                required 
                class="w-full p-2 pl-12 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-mono text-right"
                placeholder="Contoh: 24.000.000"
              >
            </div>
            <span class="text-xs text-gray-500">Masukkan total biaya sewa/gudang per tahun.</span>
          </div>

          <!-- Input 2: Biaya Simpan per Unit (Otomatis) -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Biaya Simpan per Unit (H)</label>
            <div class="relative mt-1">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm font-bold">Rp</span>
              </div>
              <!-- Menggunakan formatter khusus yang menampilkan desimal -->
              <input 
                :value="formatRupiahDecimal(hUnitCalculated)"
                type="text" 
                readonly
                class="w-full p-2 pl-12 border border-gray-200 bg-gray-100 rounded-lg font-mono text-right text-gray-600 cursor-not-allowed"
              >
            </div>
            <span class="text-xs text-gray-500">Otomatis: (Biaya Tahun / Total Stok).</span>
          </div>

            <div class="flex items-center gap-2 mb-2 text-sm text-gray-600 bg-blue-50 p-2 rounded">
              <i class="fa-solid fa-database text-blue-600"></i>
              <span>Engine: Dimas Wahyudi</span>
            </div>
          <div class="pt-4 border-t border-gray-100">
            <button 
              type="submit" 
              :disabled="isLoadingData"
              class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-bold shadow-lg transform transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
              <i class="fa-solid fa-calculator mr-2"></i> Hitung Optimasi Global
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Result Section (Kanan) -->
    <div class="lg:col-span-7 space-y-4">
      
      <!-- Loading State -->
      <div v-if="loading" class="bg-white p-10 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center h-64">
        <div class="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <h4 class="font-bold text-lg text-gray-800">Memproses Model...</h4>
      </div>

      <!-- Empty State -->
      <div v-else-if="!result" class="bg-white p-10 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center h-64">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400 text-xl">
          <i class="fa-solid fa-chart-pie"></i>
        </div>
        <h4 class="font-bold text-gray-700">Siap Menghitung</h4>
      </div>

      <!-- RESULTS: Susunan Baru -->
      <div v-else class="space-y-4 animate-fade-in">
        
        <!-- Wrapper Grid agar bersebelahan (1 Baris / 2 Kolom) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          <!-- 1. Rincian Biaya -->
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h4 class="font-bold text-gray-700 mb-3 text-sm border-b border-gray-100 pb-2">Rincian Biaya</h4>
            <div class="space-y-3">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600">Holding Cost (Penyimpanan)</span>
                <span class="font-semibold text-gray-800 bg-gray-50 px-2 py-1 rounded">{{ formatRupiah(result.hc) }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600">Ordering Cost (Pemesanan)</span>
                <span class="font-semibold text-gray-800 bg-gray-50 px-2 py-1 rounded">{{ formatRupiah(result.oc) }}</span>
              </div>
              <!-- Baris Total -->
              <div class="border-t border-gray-200 pt-3 flex justify-between items-center mt-2">
                <span class="font-bold text-gray-800">Total</span>
                <span class="font-bold text-lg text-blue-600">{{ formatRupiah(result.tc) }}</span>
              </div>
            </div>
          </div>

          <!-- 2. Chart -->
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <h4 class="font-bold text-gray-700 mb-2 text-xs">Komponen Biaya</h4>
            <div class="flex-1 relative h-32 w-full">
              <canvas ref="chartCanvas"></canvas>
            </div>
          </div>
        </div>

        <!-- BARIS 2 (1 Kolom): EOQ -->
        <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 border-gray-200 flex flex-wrap items-center gap-x-3">
          <span class="text-sm font-bold text-blue-700">EOQ Optimal (Q):</span>
          <span class="text-lg font-bold text-gray-800">{{ result.q.toLocaleString('id-ID') }} Unit</span>
          <!-- <span class="text-base font-medium text-gray-700">Titik optimal di mana biaya penyimpanan dan pemesanan seimbang</span> -->
        </div>

        <!-- BARIS 3 (1 Kolom): TC -->
        <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500 border-gray-200 flex flex-wrap items-center gap-x-3">
          <span class="text-sm font-bold text-red-500">Total Biaya (TC):</span>
          <span class="text-lg font-bold text-gray-800">{{ formatRupiah(result.tc) }}</span>
          <span class="text-base font-small text-gray-700">Total pengeluaran persediaan per tahun untuk biaya penyimpanan dan pemesanan.</span>
        </div>

        <!-- BARIS 4 (1 Kolom): Rekomendasi -->
        <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 border-gray-200 flex flex-wrap items-center gap-x-3">
          <span class="text-sm font-bold text-green-600">Rekomendasi :</span>
          <span class="text-lg font-bold text-gray-800">{{ result.freq }} Kali Pemesanan Dalam Setahun </span>
          <span class="text-base font-small text-gray-700">Anda Sebaiknya Melakukan Pemesanan Sebanyak <strong class="text-green-700">{{ result.freq }}x</strong> per tahun untuk efisiensi biaya.</span>
        </div>

        <!-- BARIS 5 (1 Kolom): Interval Waktu Pemesanan (BARU) -->
        <div class="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500 border-gray-200 flex flex-wrap items-center gap-x-3">
          <span class="text-sm font-bold text-purple-700">Interval Waktu (T):</span>
          <span class="text-lg font-bold text-purple-600">{{ result.intervalDays }} Hari</span>
          <span class="text-base font-small text-gray-700">
            Anda sebaiknya melakukan pemesanan ulang setiap {{ result.intervalDays }} sekali dengan jumlah {{ result.q.toLocaleString('id-ID') }} unit per pesanan untuk menjaga biaya tetap minimal.</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, computed } from 'vue'; 
import { Chart } from 'chart.js/auto';
import EOQPresenter from './EOQPresenter';
import { showToast } from '../../utils/toastify';

// State
const globalData = reactive({ totalStock: 0, avgShippingCost: 0 });
const result = ref(null);
const loading = ref(false);
const isLoadingData = ref(true);
const chartCanvas = ref(null);
let chartInstance = null;

// --- State Baru untuk Input Biaya ---
const rawHTahun = ref(0); 
const formattedHTahun = ref(''); 

// --- COMPUTED: Menghitung H per Unit Otomatis ---
const hUnitCalculated = computed(() => {
  if (!globalData.totalStock || globalData.totalStock === 0) {
    return 0;
  }
  return rawHTahun.value / globalData.totalStock;
});

// Format Rupiah Standar
const formatRupiah = (num) => {
  if (!num && num !== 0) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    maximumFractionDigits: 0 
  }).format(num);
};

// Format Rupiah dengan Desimal
const formatRupiahDecimal = (num) => {
  if (!num && num !== 0) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    maximumFractionDigits: 4 
  }).format(num);
};

// Handler Input Biaya Tahun
const handleHTahunInput = (e) => {
  const rawValue = e.target.value.replace(/\D/g, ''); 
  rawHTahun.value = parseInt(rawValue) || 0;
  formattedHTahun.value = rawValue ? Number(rawValue).toLocaleString('id-ID') : '';
};

// Inisialisasi Presenter
const presenter = new EOQPresenter({
  onDataLoaded: (data) => {
    globalData.totalStock = data.totalStock;
    globalData.avgShippingCost = data.avgShippingCost;
    isLoadingData.value = false;
  },
  onCalculationReady: (res) => {
    result.value = res;
    loading.value = false;
    nextTick(() => renderChart(res.hc, res.oc, res.tc));
  },
  showError: (msg) => {
    showToast(msg, 'error');
    loading.value = false;
    isLoadingData.value = false;
  }
});

// Actions
const refreshGlobalData = () => { 
  isLoadingData.value = true; 
  presenter.fetchGlobalData(); 
};

const handleCalculate = () => {
  loading.value = true;
  result.value = null;
  
  if (rawHTahun.value <= 0) { 
    showToast('Biaya Simpan Tahunan harus lebih dari 0', 'error'); 
    loading.value = false; 
    return; 
  }

  if (globalData.totalStock <= 0) {
    showToast('Total Stok (D) tidak boleh 0', 'error');
    loading.value = false;
    return;
  }
  
  presenter.calculate(
    globalData.totalStock, 
    globalData.avgShippingCost, 
    hUnitCalculated.value 
  );
};

// Chart Rendering
const renderChart = (hc, oc, tc) => {
  if(chartInstance) chartInstance.destroy();
  const ctx = chartCanvas.value.getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Holding Cost', 'Ordering Cost', 'Total Cost'],
      datasets: [{ 
        label: 'Biaya (Rp)', 
        data: [hc, oc, tc], 
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',  
          'rgba(16, 185, 129, 0.7)',  
          'rgba(239, 68, 68, 0.7)'    
        ], 
        borderWidth: 1 
      }]
    },
    options: { 
      responsive: true, 
      maintainAspectRatio: false, 
      plugins: { legend: { display: false } }, 
      scales: { y: { beginAtZero: true } } 
    }
  });
};

onMounted(() => {
  presenter.fetchGlobalData();
});
</script>