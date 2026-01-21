<template>
  <div class="max-w-lg mx-auto">
    <!-- Header Card -->
    <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-t-xl p-6 text-white shadow-lg">
      <h2 class="text-2xl font-bold flex items-center gap-3">
        <i class="fa-solid fa-arrow-up"></i> Input Barang Keluar
      </h2>
      <p class="text-red-100 mt-1 text-sm">Catat pengeluaran barang dari gudang.</p>
    </div>

    <!-- Form Card -->
    <div class="bg-white p-8 rounded-b-xl shadow-lg border border-gray-100 border-t-0">
      <form @submit.prevent="handleSubmit">
        <div class="space-y-5">
          
          <!-- Dropdown Barang -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Pilih Barang</label>
            <div class="relative">
              <i class="fa-solid fa-box-open absolute left-3 top-3.5 text-gray-400"></i>
              <select 
                v-model="form.selectedId" 
                required
                @change="handleSelectChange"
                class="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none appearance-none bg-white cursor-pointer transition shadow-sm"
              >
                <option value="">-- Pilih Barang --</option>
                <option v-for="item in items" :key="item.id" :value="item.id">
                  {{ item.code }} - {{ item.name }} <span class="text-gray-400 text-xs">(Sisa: {{ item.stock }})</span>
                </option>
              </select>
              <i class="fa-solid fa-chevron-down absolute right-4 top-3.5 text-gray-400 pointer-events-none"></i>
            </div>
          </div>

          <!-- Info Stok Saat Ini -->
          <div v-if="selectedItem" class="p-3 bg-red-50 border border-red-100 rounded-lg flex justify-between items-center">
            <span class="text-sm font-semibold text-red-800">Stok Tersedia:</span>
            <span class="text-lg font-bold text-red-600">{{ selectedItem.stock }}</span>
          </div>

          <!-- Input Jumlah -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Jumlah Keluar</label>
            <div class="relative">
              <input 
                v-model.number="form.qty" 
                type="number" 
                min="1" 
                required 
                class="w-full p-3 pl-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition shadow-sm font-mono text-lg"
                placeholder="0"
              >
              <span class="absolute right-4 top-3.5 text-gray-400 text-sm font-semibold">Unit</span>
            </div>
          </div>

          <!-- Input Catatan -->
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Catatan (Opsional)</label>
            <textarea 
              v-model="form.note" 
              rows="3" 
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition shadow-sm resize-none"
              placeholder="Contoh: Penggunaan produksi..."
            ></textarea>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-lg font-bold shadow-lg shadow-red-500/30 transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            <i v-if="isLoading" class="fa-solid fa-circle-notch fa-spin"></i>
            <i v-else class="fa-solid fa-minus"></i>
            <span v-if="isLoading">Memproses...</span>
            <span v-else>Simpan Transaksi Keluar</span>
          </button>

        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import StockPresenter from './StockPresenter';
import { showToast } from '../../utils/toastify';

// --- STATE ---
const items = ref([]);
const isLoading = ref(false);
const form = reactive({
  selectedId: null,
  qty: null,
  note: ''
});

// Computed untuk menampilkan info stok item yang dipilih
const selectedItem = computed(() => {
  return items.value.find(item => item.id === form.selectedId);
});

// --- PRESENTER ---
const presenter = new StockPresenter({
  setItems: (data) => items.value = data,
  showLoading: (state) => isLoading.value = state,
  onSuccess: (msg) => showToast(msg, 'success'),
  showError: (msg) => showToast(msg, 'error'),
  resetForm: () => {
    form.selectedId = null;
    form.qty = null;
    form.note = '';
  }
});

// --- ACTIONS ---
const handleSubmit = () => {
  // Validasi tambahan frontend (opsional, karena backend juga harus validasi)
  if (selectedItem.value && form.qty > selectedItem.value.stock) {
    showToast(`Stok tidak cukup! Maksimal keluar: ${selectedItem.value.stock}`, 'error');
    return;
  }
  presenter.stockOut(form.selectedId, form.qty, form.note);
};

// Refresh items saat dropdown berubah (memastikan data up-to-date)
const handleSelectChange = () => {
  // Bisa tambahkan logic refresh data spesifik item jika perlu
};

onMounted(() => {
  presenter.loadItems();
});
</script>