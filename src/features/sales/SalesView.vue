<template>
  <div class="space-y-6">
    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-800">Data Penjualan</h2>
      
      <div class="flex gap-3">
        <button 
          @click="exportToExcel" 
          class="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md transition-all"
        >
          <i class="fa-solid fa-file-excel"></i> Export Excel
        </button>
        <button 
          @click="openModal" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
        >
          <i class="fa-solid fa-plus"></i> Tambah Data
        </button>
      </div>
    </div>

    <!-- TABLE -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div v-if="isLoading" class="p-8 text-center text-gray-500">
        <i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Memuat data...
      </div>

      <table v-else class="w-full text-sm text-left text-gray-600">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <!-- Kolom Kode -->
            <th @click="sortBy('salesNo')" class="px-6 py-3 cursor-pointer hover:bg-gray-100 select-none group">
              <div class="flex items-center gap-1">Kode <i v-if="sortKey === 'salesNo'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i><i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i></div>
            </th>
            <!-- Kolom Tanggal -->
            <th @click="sortBy('date')" class="px-6 py-3 cursor-pointer hover:bg-gray-100 select-none group">
              <div class="flex items-center gap-1">Tanggal <i v-if="sortKey === 'date'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i><i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i></div>
            </th>
            <!-- Kolom Sisa Uang + Tooltip -->
            <th @click="sortBy('remainingMoney')" class="px-6 py-3 text-right cursor-pointer hover:bg-gray-100 select-none group relative">
              <div class="flex items-center justify-end gap-1">Sisa Uang <i v-if="sortKey === 'remainingMoney'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i><i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i></div>
              <div class="absolute top-full right-0 mt-2 w-max bg-gray-900 text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-lg">
                Total: <span class="font-bold">{{ formatRupiah(grandTotals.remainingMoney) }}</span>
              </div>
            </th>
            <!-- Kolom Pengeluaran + Tooltip -->
            <th @click="sortBy('expense')" class="px-6 py-3 text-right cursor-pointer hover:bg-gray-100 select-none group relative">
              <div class="flex items-center justify-end gap-1">Pengeluaran <i v-if="sortKey === 'expense'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i><i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i></div>
              <div class="absolute top-full right-0 mt-2 w-max bg-gray-900 text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-lg">
                Total: <span class="font-bold text-red-300">{{ formatRupiah(grandTotals.expense) }}</span>
              </div>
            </th>
            <!-- Kolom Total + Tooltip -->
            <th @click="sortBy('totalAll')" class="px-6 py-3 text-right cursor-pointer hover:bg-gray-100 select-none group relative">
              <div class="flex items-center justify-end gap-1">Total <i v-if="sortKey === 'totalAll'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i><i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i></div>
              <div class="absolute top-full right-0 mt-2 w-max bg-gray-900 text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-lg">
                Total: <span class="font-bold text-green-300">{{ formatRupiah(grandTotals.totalAll) }}</span>
              </div>
            </th>
            <!-- Kolom Serba 35 + Tooltip -->
            <th @click="sortBy('serba35')" class="px-6 py-3 text-center cursor-pointer hover:bg-gray-100 select-none group relative">
              <div class="flex items-center justify-center gap-1">Serba 35 <i v-if="sortKey === 'serba35'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i><i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i></div>
              <div class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max bg-gray-900 text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-lg">
                Total: <span class="font-bold">{{ grandTotals.serba35 }}</span>
              </div>
            </th>
            <!-- Kolom Serba 50 (BARU) + Tooltip -->
            <th @click="sortBy('serba50')" class="px-6 py-3 text-center cursor-pointer hover:bg-gray-100 select-none group relative">
              <div class="flex items-center justify-center gap-1">Serba 50 <i v-if="sortKey === 'serba50'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i><i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i></div>
              <div class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max bg-gray-900 text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-lg">
                Total: <span class="font-bold text-yellow-300">{{ grandTotals.serba50 }}</span>
              </div>
            </th>
            <!-- Kolom Serba 75 + Tooltip -->
            <th @click="sortBy('serba75')" class="px-6 py-3 text-center cursor-pointer hover:bg-gray-100 select-none group relative">
              <div class="flex items-center justify-center gap-1">Serba 75 <i v-if="sortKey === 'serba75'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i><i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i></div>
              <div class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max bg-gray-900 text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-lg">
                Total: <span class="font-bold">{{ grandTotals.serba75 }}</span>
              </div>
            </th>
            <!-- Kolom Aksi -->
            <th class="px-6 py-3 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="paginatedSales.length === 0">
            <td colspan="9" class="text-center py-8 text-gray-500">Data tidak ditemukan.</td>
          </tr>
          <tr v-for="item in paginatedSales" :key="item.id" class="bg-white border-b hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 font-medium text-gray-900">{{ item.salesNo }}</td>
            <td class="px-6 py-4">{{ formatDateIndo(item.date) }}</td>
            <td class="px-6 py-4 text-right font-mono">{{ formatRupiah(item.remainingMoney) }}</td>
            <td class="px-6 py-4 text-right font-mono text-red-500">{{ formatRupiah(item.expense) }}</td>
            <td class="px-6 py-4 text-right font-mono font-bold text-green-600">{{ formatRupiah(item.totalAll) }}</td>
            <td class="px-6 py-4 text-center">{{ item.serba35 }}</td>
            <td class="px-6 py-4 text-center font-medium text-yellow-600">{{ item.serba50 || 0 }}</td>
            <td class="px-6 py-4 text-center">{{ item.serba75 }}</td>
            <td class="px-6 py-4 text-center">
              <button @click="openEdit(item)" class="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50 mr-1">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button @click="requestDelete(item)" class="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination Sederhana (Bisa dikembangkan) -->
      <div class="px-6 py-4 border-t bg-gray-50 flex justify-between items-center text-sm">
         <span class="text-gray-600">Menampilkan {{ paginationInfo.start }} - {{ paginationInfo.end }} dari {{ sortedSales.length }} data</span>
         <div class="flex gap-2">
            <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50">Prev</button>
            <span class="px-3 py-1 font-bold text-blue-600">{{ currentPage }} / {{ totalPages }}</span>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50">Next</button>
         </div>
      </div>
    </div>

    <!-- MODAL 1: CRUD (TAMBAH/EDIT) - Mengikuti struktur InventoryView -->
    <Teleport to="#modal-portal">
      <Transition name="modal">
        <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div @click="closeModal" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          
          <div class="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-10 max-h-[90vh] pointer-events-auto">
            <!-- HEADER -->
            <div class="px-6 py-4 border-b flex justify-between items-center" :class="isEditing ? 'bg-yellow-50' : 'bg-blue-50'">
              <h3 class="text-lg font-bold text-gray-800">
                <i v-if="!isEditing" class="fa-solid fa-cart-shopping text-blue-600 mr-2"></i>
                <i v-else class="fa-solid fa-pen-to-square text-yellow-600 mr-2"></i>
                {{ isEditing ? 'Edit Penjualan' : 'Tambah Penjualan' }}
              </h3>
              <button type="button" @click="closeModal" class="text-gray-400 hover:text-red-500 transition"><i class="fa-solid fa-xmark text-xl"></i></button>
            </div>

            <!-- TABS (Hanya saat Tambah) -->
            <div v-if="!isEditing" class="flex border-b">
              <button type="button" @click="activeTab = 'single'" :class="['flex-1 py-3 text-sm font-medium transition-colors focus:outline-none', activeTab === 'single' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700']">Input Satuan</button>
              <button type="button" @click="activeTab = 'excel'" :class="['flex-1 py-3 text-sm font-medium transition-colors focus:outline-none', activeTab === 'excel' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700']">Import Excel</button>
            </div>

            <!-- CONTENT AREA -->
            <div class="p-6 overflow-y-auto flex-1">
              <!-- TAB 1: INPUT SATUAN -->
              <form v-if="activeTab === 'single' || isEditing" @submit.prevent="handleSubmit" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Kode Penjualan</label>
                    <input v-model="form.salesNo" type="text" disabled class="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal <span class="text-red-500">*</span></label>
                    <input v-model="form.date" type="date" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Sisa Uang</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-bold text-gray-500 text-xs">Rp</div>
                      <input v-model="form.remainingMoney" type="number" class="w-full p-2.5 pl-10 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Pengeluaran</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-bold text-gray-500 text-xs">Rp</div>
                      <input v-model="form.expense" type="number" class="w-full p-2.5 pl-10 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                    </div>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Total Seluruh</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-bold text-gray-500 text-xs">Rp</div>
                      <input v-model="form.totalAll" type="number" class="w-full p-2.5 pl-10 border border-gray-300 rounded-lg font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                    </div>
                  </div>
                  
                  <!-- Serba Inputs (3 Kolom) -->
                  <div class="md:col-span-2 grid grid-cols-3 gap-3 pt-2 border-t">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Serba 35</label>
                      <input v-model="form.serba35" type="number" class="w-full p-2.5 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Serba 50</label>
                      <input v-model="form.serba50" type="number" class="w-full p-2.5 border border-yellow-400 rounded-lg text-center focus:ring-2 focus:ring-yellow-500 outline-none bg-yellow-50" placeholder="0" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Serba 75</label>
                      <input v-model="form.serba75" type="number" class="w-full p-2.5 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                    </div>
                  </div>
                </div>
                
                <div v-if="!isEditing" class="text-xs p-3 rounded mt-2 border bg-blue-50 text-blue-700 border-blue-200">
                  <i class="fa-solid fa-info-circle mr-1"></i> Tanggal harus unik (hanya 1 data per tanggal).
                </div>
              </form>

              <!-- TAB 2: IMPORT EXCEL -->
              <div v-else class="space-y-4">
                <div @click="$refs.fileInput.click()" class="border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer hover:border-blue-500 hover:bg-gray-50">
                  <input type="file" ref="fileInput" class="hidden" accept=".xlsx, .xls" @change="handleFileSelect">
                  <i v-if="!excelFile" class="fa-solid fa-file-excel text-4xl text-blue-500 mb-3"></i>
                  <i v-else class="fa-solid fa-file-circle-check text-4xl text-blue-600 mb-3"></i>
                  <p class="text-gray-700 font-medium">{{ excelFile ? excelFile.name : 'Klik untuk Upload Excel (.xlsx)' }}</p>
                  <p class="text-xs text-gray-500 mt-1">Format: A(Kode), B(Tanggal), C(Sisa), D(Pengeluaran), E(Total), F(35), G(50), H(75)</p>
                </div>

                <div v-if="validationErrors.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <h4 class="text-sm font-bold text-red-700 mb-2">⚠️ {{ validationErrors.length }} Data Error:</h4>
                  <ul class="list-disc list-inside text-xs text-red-600 space-y-1">
                    <li v-for="(err, idx) in validationErrors.slice(0, 5)" :key="idx">{{ err }}</li>
                  </ul>
                </div>

                <div v-if="parsedExcelData.length > 0" class="text-xs border rounded-lg overflow-hidden">
                  <div class="bg-blue-50 p-2 border-b font-bold text-blue-800">Siap Upload: {{ parsedExcelData.length }} Data Valid</div>
                  <div class="max-h-40 overflow-y-auto bg-white">
                    <table class="w-full text-left">
                      <tbody>
                        <tr v-for="(row, i) in parsedExcelData.slice(0, 5)" :key="i" class="border-b">
                          <td class="p-2">{{ row.salesNo || 'Auto' }}</td>
                          <td class="p-2">{{ formatDateIndo(row.date) }}</td>
                          <td class="p-2">{{ formatRupiah(row.totalAll) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- FOOTER -->
            <div class="px-6 py-4 border-t bg-gray-50 flex gap-3 justify-end">
              <button type="button" @click="closeModal" class="px-5 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition">Batal</button>
              
              <button v-if="activeTab === 'single' || isEditing" type="submit" @click="handleSubmit" class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition shadow-sm">
                {{ isEditing ? 'Simpan Perubahan' : 'Tambah Data' }}
              </button>

              <button v-else @click="handleExcelUpload" :disabled="!excelFile || parsedExcelData.length === 0" class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition disabled:opacity-50 shadow-sm">
                Upload {{ parsedExcelData.length }} Data
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL DELETE -->
    <Teleport to="#modal-portal">
      <Transition name="modal">
        <div v-if="isDeleteModalOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div @click="closeDeleteModal" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div class="relative bg-white w-full max-w-sm rounded-xl shadow-2xl border border-red-100 z-10 pointer-events-auto p-6 text-center">
            <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fa-solid fa-triangle-exclamation text-3xl"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">Hapus Penjualan?</h3>
            <p class="text-gray-500 text-sm mb-6">Data <b>{{ itemToDelete?.salesNo }}</b> akan dihapus permanen.</p>
            <div class="flex gap-3 justify-center">
              <button @click="closeDeleteModal" class="flex-1 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition">Batal</button>
              <button @click="confirmDelete" class="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition">Ya, Hapus</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL PROGRESS UPLOAD -->
    <Teleport to="#modal-portal">
      <Transition name="modal">
        <div v-if="isUploading" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm z-0"></div>
          <div class="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 p-8 text-center z-10 pointer-events-none">
            <div class="mb-4">
              <div class="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            </div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Sedang Mengupload...</h3>
            <p class="text-sm text-gray-500 mb-6 font-medium">Jangan refresh halaman agar data tidak hilang</p>
            <div class="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden relative">
              <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-300 ease-out" :style="{ width: uploadProgress + '%' }"></div>
            </div>
            <div class="flex justify-between items-center text-sm font-bold text-gray-700">
              <span>Proses: {{ uploadCount }} dari {{ uploadTotal }} Data</span>
              <span>{{ Math.round(uploadProgress) }}%</span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import SalesPresenter from './SalesPresenter';
import { showToast } from '../../utils/toastify';
import ExcelJS from 'exceljs';

// --- STATE ---
const sales = ref([]);
const isLoading = ref(false);

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Upload Progress
const isUploading = ref(false);
const uploadTotal = ref(0);
const uploadCount = ref(0);
const uploadProgress = ref(0);

// Modal
const isModalOpen = ref(false);
const isEditing = ref(false);
const activeTab = ref('single');
const form = reactive({ id: null, salesNo: '', date: '', remainingMoney: 0, expense: 0, totalAll: 0, serba35: 0, serba50: 0, serba75: 0 });

// Excel
const excelFile = ref(null);
const parsedExcelData = ref([]);
const validationErrors = ref([]);

// Delete
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);

// --- PRESENTER ---
const presenter = new SalesPresenter({
  setSales: (data) => sales.value = data,
  showLoading: (state) => isLoading.value = state,
  onCreateSuccess: (msg) => { showToast(msg, 'success'); closeModal(); },
  onUpdateSuccess: (msg) => { showToast(msg, 'success'); closeModal(); },
  onDeleteSuccess: (msg) => showToast(msg, 'success'),
  showError: (msg) => showToast(msg, 'error'),
  closeForm: () => {},
  showUploadProgress: (state) => isUploading.value = state,
  setUploadTotal: (total) => uploadTotal.value = total,
  setUploadCount: (count) => uploadCount.value = count,
  updateProgress: (percent) => uploadProgress.value = percent,
});

// --- HELPERS ---
const formatRupiah = (num) => {
  if (!num && num !== 0) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
};

const formatDateIndo = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

// --- SORTING ---
const sortKey = ref('date'); 
const sortAsc = ref(false);  

const sortBy = (key) => {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value;
  else { sortKey.value = key; sortAsc.value = true; }
  currentPage.value = 1;
};

const sortedSales = computed(() => {
  const data = [...sales.value]; 
  data.sort((a, b) => {
    let valA = a[sortKey.value];
    let valB = b[sortKey.value];
    if (sortKey.value === 'date') { valA = new Date(valA).getTime(); valB = new Date(valB).getTime(); }
    else if (typeof valA === 'number' || typeof valB === 'number') { valA = Number(valA) || 0; valB = Number(valB) || 0; }
    else if (typeof valA === 'string') { valA = valA.toLowerCase(); valB = valB ? valB.toLowerCase() : ''; }
    if (valA < valB) return sortAsc.value ? -1 : 1;
    if (valA > valB) return sortAsc.value ? 1 : -1;
    return 0;
  });
  return data;
});

// --- TOTALS TOOLTIP ---
const grandTotals = computed(() => {
  return sales.value.reduce((acc, curr) => {
    acc.remainingMoney += Number(curr.remainingMoney) || 0;
    acc.expense += Number(curr.expense) || 0;
    acc.totalAll += Number(curr.totalAll) || 0;
    acc.serba35 += Number(curr.serba35) || 0;
    acc.serba50 += Number(curr.serba50) || 0;
    acc.serba75 += Number(curr.serba75) || 0;
    return acc;
  }, { remainingMoney: 0, expense: 0, totalAll: 0, serba35: 0, serba50: 0, serba75: 0 });
});

// --- PAGINATION ---
const totalPages = computed(() => Math.ceil(sortedSales.value.length / itemsPerPage.value) || 1);
const paginationInfo = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value + 1;
  const end = Math.min(currentPage.value * itemsPerPage.value, sortedSales.value.length);
  return { start, end };
});
const paginatedSales = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return sortedSales.value.slice(start, end);
});

// --- ACTIONS ---
const openModal = () => {
  isEditing.value = false;
  activeTab.value = 'single';
  const today = new Date().toISOString().split('T')[0];
  Object.assign(form, { id: null, salesNo: '', date: today, remainingMoney: 0, expense: 0, totalAll: 0, serba35: 0, serba50: 0, serba75: 0 });
  excelFile.value = null;
  parsedExcelData.value = [];
  validationErrors.value = [];
  isModalOpen.value = true;
};

const closeModal = () => isModalOpen.value = false;

const handleSubmit = () => {
  if (!form.date) return showToast('Tanggal wajib diisi', 'error');
  const payload = { ...form, remainingMoney: Number(form.remainingMoney), expense: Number(form.expense), totalAll: Number(form.totalAll), serba35: Number(form.serba35), serba50: Number(form.serba50), serba75: Number(form.serba75) };
  if (isEditing.value) presenter.updateSale(form.id, payload);
  else presenter.createSale(payload);
};

const openEdit = (item) => {
  isEditing.value = true;
  activeTab.value = 'single';
  let dateVal = item.date;
  if (typeof dateVal === 'string' && dateVal.includes('T')) dateVal = dateVal.split('T')[0];
  Object.assign(form, { id: item.id, salesNo: item.salesNo, date: dateVal, remainingMoney: item.remainingMoney, expense: item.expense, totalAll: item.totalAll, serba35: item.serba35, serba50: item.serba50 || 0, serba75: item.serba75 });
  isModalOpen.value = true;
};

// --- DELETE ---
const requestDelete = (item) => { itemToDelete.value = item; isDeleteModalOpen.value = true; };
const closeDeleteModal = () => { isDeleteModalOpen.value = false; itemToDelete.value = null; };
const confirmDelete = () => { if (itemToDelete.value) presenter.deleteSale(itemToDelete.value.id); closeDeleteModal(); };

// --- EXCEL LOGIC ---
const handleFileSelect = async (e) => {
  const files = e.target.files;
  if (!files.length) return;
  const file = files[0];
  if (![".xlsx", ".xls"].includes(file.name.substring(file.name.lastIndexOf('.')))) return showToast('Format harus Excel (.xlsx)', 'error');

  excelFile.value = file;
  parsedExcelData.value = [];
  validationErrors.value = [];

  try {
    const workbook = new ExcelJS.Workbook();
    const arrayBuffer = await file.arrayBuffer();
    await workbook.xlsx.load(arrayBuffer);
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) return showToast('File Excel tidak memiliki worksheet', 'error');
    
    const existingDates = sales.value.map(s => new Date(s.date).toISOString().split('T')[0]);

    const validRows = [];
    const errors = [];
    const headerRow = worksheet.getRow(1);
    const headers = [];
    headerRow.eachCell((cell, colNumber) => headers.push(cell.value ? cell.value.toString().toLowerCase().trim() : ''));
    
    const findColumnIndex = (possibleNames) => {
      for (const name of possibleNames) {
        const index = headers.findIndex(h => h && h.includes(name));
        if (index !== -1) return index;
      }
      return -1;
    };
    
    const noColIdx = findColumnIndex(["kode", "no penjualan", "sales no"]);
    const dateColIdx = findColumnIndex(["tanggal", "date"]);
    const sisaColIdx = findColumnIndex(["sisa uang", "sisa"]);
    const expenseColIdx = findColumnIndex(["pengeluaran", "expense"]);
    const totalColIdx = findColumnIndex(["total seluruh", "total"]);
    const s35ColIdx = findColumnIndex(["serba 35", "35"]);
    const s50ColIdx = findColumnIndex(["serba 50", "50"]);
    const s75ColIdx = findColumnIndex(["serba 75", "75"]);
    
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const getVal = (idx) => idx !== -1 ? (row.getCell(idx + 1).value || "") : "";
      
      const rawNo = getVal(noColIdx);
      const rawDate = getVal(dateColIdx);
      const rawSisa = getVal(sisaColIdx);
      const rawExpense = getVal(expenseColIdx);
      const rawTotal = getVal(totalColIdx);
      const raw35 = getVal(s35ColIdx);
      const raw50 = getVal(s50ColIdx);
      const raw75 = getVal(s75ColIdx);

      let errorMsg = "";
      let validDate = "";
      let dateObj;
      if (typeof rawDate === 'number') dateObj = new Date((rawDate - 25569) * 86400 * 1000);
      else if (typeof rawDate === 'string') {
         const parts = rawDate.includes('/') ? rawDate.split('/') : rawDate.split('-');
         if (parts.length === 3) {
           if (parts[0].length === 4) dateObj = new Date(rawDate);
           else dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
         } else dateObj = new Date(rawDate);
      } else if (rawDate instanceof Date) dateObj = rawDate;

      if (!dateObj || isNaN(dateObj.getTime())) errorMsg = `Baris ${rowNumber}: Tanggal tidak valid`;
      else {
        validDate = dateObj.toISOString().split('T')[0];
        if (existingDates.includes(validDate)) errorMsg = `Baris ${rowNumber}: Tanggal ${validDate} sudah ada`;
      }

      const parseNum = (val) => {
        if (typeof val === 'number') return val;
        if (typeof val === 'string') return parseInt(val.replace(/\D/g, '')) || 0;
        return 0;
      };

      if (errorMsg) errors.push(errorMsg);
      else {
        validRows.push({
          salesNo: rawNo || "", date: validDate, remainingMoney: parseNum(rawSisa), expense: parseNum(rawExpense), totalAll: parseNum(rawTotal),
          serba35: parseNum(raw35), serba50: parseNum(raw50), serba75: parseNum(raw75)
        });
      }
    });
    parsedExcelData.value = validRows;
    validationErrors.value = errors;
    if (validRows.length === 0 && errors.length === 0) showToast('File Excel kosong', 'error');
  } catch (err) {
    console.error(err);
    showToast('Gagal membaca file Excel', 'error');
  }
};

const handleExcelUpload = () => {
  if (parsedExcelData.value.length === 0) return showToast('Tidak ada data valid', 'error');
  if (validationErrors.value.length > 0) showToast(`${validationErrors.value.length} data error dilewati.`, 'warning');
  presenter.uploadExcel(parsedExcelData.value);
  closeModal();
};

// --- EXPORT ---
const exportToExcel = async () => {
  if (sales.value.length === 0) return showToast('Data kosong', 'error');
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Data Penjualan');
  const headerStyle = { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } }, font: { bold: true, color: { argb: 'FFFFFFFF' } }, alignment: { vertical: 'middle', horizontal: 'center' } };
  sheet.columns = [
    { header: 'Kode', key: 'salesNo', width: 15 }, { header: 'Tanggal', key: 'date', width: 15 },
    { header: 'Sisa Uang', key: 'remainingMoney', width: 20 }, { header: 'Pengeluaran', key: 'expense', width: 20 },
    { header: 'Total Seluruh', key: 'totalAll', width: 20 }, { header: 'Serba 35', key: 'serba35', width: 12 },
    { header: 'Serba 50', key: 'serba50', width: 12 }, { header: 'Serba 75', key: 'serba75', width: 12 },
  ];
  sheet.getRow(1).eachCell((cell) => cell.style = headerStyle);
  sales.value.forEach(s => sheet.addRow({ ...s, serba50: s.serba50 || 0, date: s.date ? new Date(s.date).toISOString().split('T')[0] : '-' }));
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `Laporan_Penjualan_${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();
};

onMounted(() => presenter.loadSales());
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>