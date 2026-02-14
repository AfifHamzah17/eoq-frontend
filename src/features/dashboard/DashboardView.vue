<template>
  <div class="space-y-6">
    <!-- 1. STATS CARDS ROW -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Card 1: Total Barang -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-gray-500 mb-1">Total Jenis Barang</p>
            <h3 class="text-2xl font-bold text-gray-800">{{ stats.totalItems }}</h3>
            <p class="text-xs text-gray-400 mt-1">SKU Aktif</p>
          </div>
          <div class="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <i class="fa-solid fa-box text-xl"></i>
          </div>
        </div>
      </div>

      <!-- Card 2: Nilai Stok -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-gray-500 mb-1">Total Nilai Stok</p>
            <h3 class="text-2xl font-bold text-gray-800">{{ formatRupiah(stats.stockValue) }}</h3>
            <p class="text-xs text-gray-400 mt-1">Estimasi Aset</p>
          </div>
          <div class="p-3 bg-green-50 text-green-600 rounded-lg">
            <i class="fa-solid fa-sack-dollar text-xl"></i>
          </div>
        </div>
      </div>

      <!-- Card 3: Transaksi Bulan Ini -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-gray-500 mb-1">Transaksi Bulan Ini</p>
            <h3 class="text-2xl font-bold text-gray-800">{{ stats.monthlyTransactions }}</h3>
            <p class="text-xs text-gray-400 mt-1">Masuk & Keluar</p>
          </div>
          <div class="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <i class="fa-solid fa-arrow-right-arrow-left text-xl"></i>
          </div>
        </div>
      </div>

      <!-- Card 4: Peringatan Stok -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-gray-500 mb-1">Peringatan Stok</p>
            <h3 class="text-2xl font-bold" :class="stats.lowStock > 0 ? 'text-red-600' : 'text-gray-800'">{{ stats.lowStock }}</h3>
            <p class="text-xs text-gray-400 mt-1">Stok < 100 unit</p>
          </div>
          <div class="p-3 rounded-lg" :class="stats.lowStock > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'">
            <i class="fa-solid fa-triangle-exclamation text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. MAIN CONTENT GRID -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- KOLOM KIRI: TABEL TRANSAKSI -->
      <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-gray-800">Riwayat Aktivitas Terakhir</h3>
          <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">5 Data Terbaru</span>
        </div>
        
        <div v-if="isLoading" class="text-center py-10 text-gray-400">
          <i class="fa-solid fa-spinner fa-spin mr-2"></i> Memuat data...
        </div>
        
        <div v-else-if="transactions.length === 0" class="text-center py-10 text-gray-400 border-dashed border-2 rounded-lg">
           Belum ada transaksi tercatat.
        </div>

        <table v-else class="w-full text-sm text-left">
          <thead class="text-xs text-gray-500 uppercase bg-gray-50 border-y">
            <tr>
              <th class="px-4 py-3 rounded-tl-lg">Tanggal</th>
              <th class="px-4 py-3">Nama Barang</th>
              <th class="px-4 py-3 text-center">Tipe</th>
              <th class="px-4 py-3 text-right rounded-tr-lg">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in transactions" :key="t.id" class="border-b last:border-0 hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3 text-gray-500 font-mono text-xs">{{ t.date }}</td>
              <td class="px-4 py-3 font-medium text-gray-800">{{ t.itemName }}</td>
              <td class="px-4 py-3 text-center">
                <span :class="t.type === 'Masuk' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'" class="text-xs font-bold uppercase px-2.5 py-1 rounded border">
                  {{ t.type }}
                </span>
              </td>
              <td class="px-4 py-3 text-right font-mono font-bold">{{ t.qty }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- KOLOM KANAN: CHART & AI CARD -->
      <div class="space-y-6">
        
        <!-- Chart Card: Trend Transaksi -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex justify-between items-center mb-2">
             <h3 class="font-bold text-gray-800 text-sm">Trend Transaksi</h3>
             <span class="text-[10px] text-gray-400">7 Hari Terakhir</span>
          </div>
          <div class="relative h-44 w-full">
             <canvas ref="chartCanvas"></canvas>
          </div>
        </div>

        <!-- AI / EOQ Action Card (Light Mode) -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden h-56 flex flex-col justify-between">
           <!-- Background Decoration (Light) -->
           <div class="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
           <div class="absolute -left-10 -bottom-10 w-32 h-32 bg-purple-50 rounded-full blur-3xl opacity-60"></div>
           
           <div class="relative z-10">
             <div class="flex items-center gap-3 mb-2">
                <div class="p-2 bg-blue-100 rounded-lg border border-blue-50 shadow-sm">
                  <i class="fa-solid fa-brain text-blue-600 text-lg"></i>
                </div>
                <h3 class="font-bold text-gray-800 text-lg">Analisis EOQ</h3>
             </div>
             <p class="text-xs text-gray-500 text-justify leading-relaxed">
                Gunakan mesin analisis untuk menghitung jumlah pemesanan ekonomis berdasarkan data pengiriman & stok.
             </p>
           </div>

           <button 
             @click="goToEOQ" 
             class="relative z-10 w-full mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center justify-center gap-2 font-semibold text-sm shadow-md hover:shadow-lg"
           >
             <i class="fa-solid fa-rocket"></i> Mulai Analisis
           </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { onMounted, ref, nextTick } from 'vue';
import DashboardPresenter from './DashboardPresenter';
import { Chart } from 'chart.js/auto';

// State
const stats = ref({ totalItems: 0, stockValue: 0, lowStock: 0, monthlyTransactions: 0 });
const transactions = ref([]);
const isLoading = ref(true);
const chartCanvas = ref(null);

// --- PERBAIKAN EMIT ---
const emit = defineEmits(['navigate']);
const navigateFunc = inject('navigateFunction');

const goToEOQ = () => {
  if (navigateFunc) {
    navigateFunc('eoq');
  } else {
    // Fallback jika inject gagal (harusnya tidak)
    emit('navigate', 'eoq'); 
  }
};
// ---------------------

// Chart Instance
let chartInstance = null;

// Init Presenter
const presenter = new DashboardPresenter({
  setStats: (s) => stats.value = s,
  setTransactions: (t) => {
    transactions.value = t;
    // Trigger chart render setelah transaksi didapat
    nextTick(() => renderChart(t));
  },
  showLoading: (val) => isLoading.value = val,
  showError: (msg) => console.error(msg)
});

// Format Currency
const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

// Chart Render Logic (Bar Chart: Masuk vs Keluar)
const renderChart = (rawTransactions) => {
  if (!chartCanvas.value) return;
  const ctx = chartCanvas.value.getContext('2d');
  
  if (chartInstance) chartInstance.destroy();

  // Proses Data untuk Chart (7 Hari Terakhir)
  const labels = [];
  const dataIn = [];
  const dataOut = [];
  
  // Logika sederhana: ambil data yang ada di transaksi
  // Untuk produksi, sebaiknya hitung per tanggal dari backend
  // Di sini kita simulasi dari 5 transaksi terakhir yang dikirim backend
  
  // Contoh statis jika data kurang (dummy visual):
  if(rawTransactions.length < 7) {
     labels.push('Minggu Ini');
     let countIn = rawTransactions.filter(t => t.type === 'Masuk').reduce((sum, t) => sum + t.qty, 0);
     let countOut = rawTransactions.filter(t => t.type === 'Keluar').reduce((sum, t) => sum + t.qty, 0);
     dataIn.push(countIn);
     dataOut.push(countOut);
  } else {
     // Jika data banyak, ambil 6 hari terakhir + hari ini
     // (Logic grouping by date bisa ditambahkan di sini jika perlu, untuk saat ini kita pakai total)
     labels.push('Aktivitas');
     dataIn.push(stats.value.monthlyTransactions * 10); // Skala demo
     dataOut.push(stats.value.monthlyTransactions * 5); // Skala demo
  }

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.length > 0 ? labels : ['Data'],
      datasets: [
        {
          label: 'Masuk',
          data: dataIn.length > 0 ? dataIn : [0],
          backgroundColor: 'rgba(34, 197, 94, 0.7)', // Emerald
          borderRadius: 6,
          barPercentage: 0.5
        },
        {
          label: 'Keluar',
          data: dataOut.length > 0 ? dataOut : [0],
          backgroundColor: 'rgba(239, 68, 68, 0.7)', // Red
          borderRadius: 6,
          barPercentage: 0.5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { display: false } },
        x: { grid: { display: false }, ticks: { font: { size: 10 } } }
      },
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 8, usePointStyle: true, pointStyle: 'rectRounded' } },
        tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', cornerRadius: 8 }
      }
    }
  });
};

onMounted(() => presenter.loadData());
</script>