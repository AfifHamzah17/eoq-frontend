<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-float">
    <!-- Input Section -->
    <div class="lg:col-span-5 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
      <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <i class="fa-solid fa-sliders"></i> Parameter EOQ
      </h3>
      <form @submit.prevent="handleCalculate">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Pilih Produk</label>
            <select v-model="selectedId" @change="loadParams" class="w-full mt-1 p-2 border border-gray-300 rounded-lg bg-gray-50" required>
              <option value="">-- Pilih Barang --</option>
              <option v-for="item in items" :value="item.id">{{ item.code }} - {{ item.name }}</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Data akan diisi otomatis dari database barang.</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Permintaan (D)</label>
              <input v-model.number="params.d" type="number" required class="w-full mt-1 p-2 border border-gray-300 rounded-lg">
              <span class="text-xs text-gray-500">unit/tahun</span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Biaya Pesan (S)</label>
              <input v-model.number="params.s" type="number" required class="w-full mt-1 p-2 border border-gray-300 rounded-lg">
              <span class="text-xs text-gray-500">Rp / pesan</span>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Biaya Simpan (H)</label>
            <input v-model.number="params.h" type="number" required class="w-full mt-1 p-2 border border-gray-300 rounded-lg">
            <span class="text-xs text-gray-500">Rp / unit / tahun</span>
          </div>

          <div class="pt-4 border-t border-gray-100">
            <div class="flex items-center gap-2 mb-2 text-sm text-gray-600 bg-blue-50 p-2 rounded">
              <i class="fa-solid fa-microchip text-blue-600"></i>
              <span>Engine: TensorFlow.js (Simulated)</span>
            </div>
            <button type="submit" class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-bold shadow-lg transform transition hover:-translate-y-0.5">
              <i class="fa-solid fa-calculator mr-2"></i> Hitung Optimasi
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Result Section -->
    <div class="lg:col-span-7 space-y-6">
      <!-- Loading State -->
      <div v-if="loading" class="bg-white p-10 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center h-full">
        <div class="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <h4 class="font-bold text-lg text-gray-800">Memproses Model...</h4>
        <p class="text-gray-500 text-sm">Komputasi algoritma EOQ dan meminimalkan fungsi biaya total.</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!result" class="bg-white p-10 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center h-96">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400 text-2xl">
          <i class="fa-solid fa-chart-pie"></i>
        </div>
        <h4 class="font-bold text-gray-700">Belum ada perhitungan</h4>
        <p class="text-gray-500 text-sm max-w-xs mx-auto mt-2">Masukkan parameter barang di sebelah kiri dan klik "Hitung Optimasi" untuk melihat hasil analisis EOQ.</p>
      </div>

      <!-- Results -->
      <div v-else class="space-y-6 animate-fade-in">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-xl shadow-sm border border-blue-100 border-l-4 border-l-blue-500">
            <p class="text-xs text-gray-500 uppercase font-bold">EOQ Optimal (Q)</p>
            <h3 class="text-2xl font-bold text-gray-800">{{ result.q.toLocaleString('id-ID') }}</h3>
            <p class="text-xs text-gray-400">Unit per pesanan</p>
          </div>
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <p class="text-xs text-gray-500 uppercase font-bold">Total Biaya (TC)</p>
            <h3 class="text-xl font-bold text-red-600">{{ formatRupiah(result.tc) }}</h3>
            <p class="text-xs text-gray-400">Tahunan</p>
          </div>
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <p class="text-xs text-gray-500 uppercase font-bold">Frekuensi Pesan</p>
            <h3 class="text-xl font-bold text-gray-800">{{ result.freq }} Kali</h3>
            <p class="text-xs text-gray-400">Kali per tahun</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h4 class="font-bold text-gray-700 mb-4">Rincian Biaya</h4>
            <div class="space-y-3">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600">Holding Cost (Penyimpanan)</span>
                <span class="font-semibold text-gray-800">{{ formatRupiah(result.hc) }}</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-600">Ordering Cost (Pemesanan)</span>
                <span class="font-semibold text-gray-800">{{ formatRupiah(result.oc) }}</span>
              </div>
              <div class="border-t border-gray-100 pt-2 flex justify-between items-center">
                <span class="font-bold text-gray-800">Total</span>
                <span class="font-bold text-lg text-blue-600">{{ formatRupiah(result.tc) }}</span>
              </div>
            </div>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <h4 class="font-bold text-gray-700 mb-2">Grafik Komponen Biaya</h4>
            <div class="flex-1 relative h-40">
              <canvas ref="chartCanvas"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import Storage  from '../../utils/storage';
import { Chart } from 'chart.js/auto';

const items = ref([]);
const selectedId = ref(null);
const params = reactive({ d: null, s: null, h: null });
const result = ref(null);
const loading = ref(false);
const chartCanvas = ref(null);
let chartInstance = null;

onMounted(() => items.value = Storage.getItems());

const loadParams = () => {
  const item = items.value.find(i => i.id === selectedId.value);
  if(item) Object.assign(params, { d: item.d, s: item.s, h: item.h });
};

const handleCalculate = () => {
  loading.value = true;
  result.value = null; // Clear result during loading

  // Simulasi delay komputasi (1.5 detik)
  setTimeout(() => {
    const D = params.d, S = params.s, H = params.h;
    
    // LOGIKA PERSIS SEPERTI HTML ASLI
    // EOQ = sqrt(2DS/H) -> Dibulatkan
    const EOQ = Math.round(Math.sqrt((2 * D * S) / H));
    
    // Annual Holding Cost = (Q/2) * H
    const holdingCost = (EOQ / 2) * H;
    
    // Annual Ordering Cost = (D/Q) * S
    const orderingCost = (D / EOQ) * S;
    
    // Total Cost
    const totalCost = holdingCost + orderingCost;

    // Frequency = D / Q -> Dibulatkan
    const frequency = Math.round(D / EOQ);
    
    result.value = { 
      q: EOQ, 
      hc: holdingCost, 
      oc: orderingCost, 
      tc: totalCost, 
      freq: frequency 
    };
    
    loading.value = false;
    nextTick(() => renderChart(holdingCost, orderingCost, totalCost));
  }, 1500);
};

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
          'rgba(59, 130, 246, 0.7)', // Blue
          'rgba(16, 185, 129, 0.7)', // Green
          'rgba(239, 68, 68, 0.7)'   // Red
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)'
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

const formatRupiah = (num) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
};
</script>