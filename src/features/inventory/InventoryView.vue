<!-- src/features/inventory/InventoryView.vue -->
<template>
  <div class="space-y-6">
    <!-- HEADER & BUTTONS -->
    <div class="flex justify-between items-center flex-wrap gap-4">
      <div class="flex items-center gap-3">
        <div class="relative">
          <input type="text" v-model="searchQuery" placeholder="Cari barang atau toko..." class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all">
          <i class="fa-solid fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
        <!-- FILTER CABANG (HANYA ADMIN) -->
        <select v-if="userData?.role === 'admin'" v-model="filterCabang" class="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium cursor-pointer">
          <option value="">Semua Cabang</option>
          <option v-for="c in storeList" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div class="flex gap-3">
        <button @click="exportToExcel" class="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md transition-all"><i class="fa-solid fa-file-excel"></i> Export Excel</button>
        <button @click="openUploadModal('in')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"><i class="fa-solid fa-upload"></i> Upload Masuk</button>
        <button @click="openUploadModal('out')" class="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"><i class="fa-solid fa-download"></i> Upload Keluar</button>
      </div>
    </div>

    <!-- TABLE MASTER DATA -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div v-if="isLoading" class="p-8 text-center text-gray-500"><i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Memuat data...</div>
      <table v-else class="w-full text-sm text-left text-gray-600">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th @click="sortBy('code')" class="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none group"><div class="flex items-center gap-1">Kode <i v-if="sortKey === 'code'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i><i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i></div></th>
            <th @click="sortBy('name')" class="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none group"><div class="flex items-center gap-1">Nama Barang <i v-if="sortKey === 'name'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i><i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i></div></th>
            <th @click="sortBy('shopName')" class="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none group"><div class="flex items-center gap-1">Asal Toko <i v-if="sortKey === 'shopName'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i><i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i></div></th>
            <th @click="sortBy('namaCabang')" class="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none group"><div class="flex items-center gap-1">Cabang <i v-if="sortKey === 'namaCabang'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i><i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i></div></th>
            <th @click="sortBy('stock')" class="px-4 py-3 text-center cursor-pointer hover:bg-gray-100 select-none group relative"><div class="flex items-center justify-center gap-1">Stok <i v-if="sortKey === 'stock'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i><i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i></div><div class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max bg-gray-900 text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-lg">Total Stok: <span class="font-bold text-green-300">{{ totalStock.toLocaleString('id-ID') }}</span></div></th>
            <th class="px-4 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paginatedItems.length === 0"><td colspan="6" class="text-center py-8 text-gray-500">Data tidak ditemukan.</td></tr>
          <tr v-for="item in paginatedItems" :key="item.id" class="bg-white border-b hover:bg-gray-50 transition-colors">
            <td class="px-4 py-4 font-medium text-gray-900">{{ item.code }}</td>
            <td class="px-4 py-4">{{ item.name }}</td>
            <td class="px-4 py-4"><span class="bg-gray-100 text-gray-600 py-1 px-2 rounded text-xs font-medium border border-gray-200">{{ item.shopName || '-' }}</span></td>
            <td class="px-4 py-4"><span class="bg-blue-50 text-blue-700 py-1 px-2 rounded text-xs font-bold border border-blue-200">{{ item.namaCabang || '-' }}</span></td>
            <td class="px-4 py-4 text-center"><span :class="['font-semibold', item.stock < 10 ? 'text-red-600 font-bold' : 'text-green-600']">{{ item.stock.toLocaleString('id-ID') }}</span></td>
            <td class="px-4 py-4 text-center"><button @click="openHistory(item)" class="text-indigo-600 hover:text-indigo-900 px-3 py-2 rounded hover:bg-indigo-50 transition flex items-center justify-center gap-2 mx-auto w-max"><i class="fa-solid fa-clock-rotate-left"></i> Riwayat</button></td>
          </tr>
        </tbody>
      </table>
      <!-- PAGINATION -->
      <div class="px-4 py-3 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div class="flex items-center gap-2 text-sm">
          <span class="text-gray-600">Tampilkan:</span>
          <select v-model.number="itemsPerPage" class="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-blue-500 outline-none cursor-pointer"><option :value="5">5</option><option :value="10">10</option><option :value="25">25</option><option :value="50">50</option></select>
        </div>
        <div class="text-sm text-gray-600 order-first sm:order-none">Menampilkan <span class="font-semibold text-gray-800">{{ paginationInfo.start }}</span> - <span class="font-semibold text-gray-800">{{ paginationInfo.end }}</span> dari <span class="font-semibold text-gray-800">{{ filteredItems.length }}</span> data</div>
        <div class="flex items-center gap-1">
          <button @click="currentPage = 1" :disabled="currentPage === 1" class="px-2 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><i class="fa-solid fa-angles-left text-xs"></i></button>
          <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">Prev</button>
          <span class="px-3 py-1 text-sm font-bold text-blue-600">{{ currentPage }} / {{ totalPages || 1 }}</span>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">Next</button>
          <button @click="currentPage = totalPages" :disabled="currentPage === totalPages" class="px-2 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><i class="fa-solid fa-angles-right text-xs"></i></button>
        </div>
      </div>
    </div>

    <!-- MODAL 1: UPLOAD BARANG -->
    <Teleport to="#modal-portal">
      <Transition name="modal">
        <div v-if="isUploadModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div @click="closeUploadModal" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div class="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-10 max-h-[90vh] pointer-events-auto">
            <div class="px-6 py-4 border-b flex justify-between items-center" :class="transactionType === 'in' ? 'bg-emerald-50' : 'bg-orange-50'">
              <h3 class="text-lg font-bold text-gray-800"><i :class="transactionType === 'in' ? 'fa-solid fa-truck-ramp-box text-emerald-600' : 'fa-solid fa-truck-ramp-down text-orange-600'" class="mr-2"></i> Upload {{ transactionType === 'in' ? 'Barang Masuk' : 'Barang Keluar' }}</h3>
              <button type="button" @click="closeUploadModal" class="text-gray-400 hover:text-red-500 transition"><i class="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div class="flex border-b">
              <button type="button" @click="uploadTab = 'single'" :class="['flex-1 py-3 text-sm font-medium transition-colors focus:outline-none', uploadTab === 'single' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700']">Input Satuan</button>
              <button type="button" @click="uploadTab = 'excel'" :class="['flex-1 py-3 text-sm font-medium transition-colors focus:outline-none', uploadTab === 'excel' ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700']">Upload Excel</button>
            </div>
            <div class="p-6 overflow-y-auto">
              <form v-if="uploadTab === 'single'" @submit.prevent="handleSingleUpload" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Tanggal</label><input v-model="uploadForm.date" type="date" class="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" required /></div>
                  <div><label class="block text-sm font-medium text-gray-700 mb-1">Asal Toko (Supplier)</label><input v-model="uploadForm.shopName" type="text" class="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Contoh: Toko Maju" required /></div>
                  <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label><input v-model="uploadForm.itemName" type="text" class="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Contoh: Parfum Mawar" required /></div>
                  <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Barang</label><input v-model.number="uploadForm.qty" type="number" min="1" class="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" required /></div>
                </div>
                <div :class="['text-xs p-3 rounded mt-2 border', transactionType === 'in' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-orange-50 text-orange-700 border-orange-200']">
                  <i :class="transactionType === 'in' ? 'fa-solid fa-info-circle' : 'fa-solid fa-triangle-exclamation'" class="mr-1"></i> {{ transactionType === 'in' ? 'Jika Nama Barang sama, stok akan bertambah.' : 'Pastikan stok cukup sebelum melakukan Barang Keluar.' }}
                </div>
                <button type="submit" :class="['w-full py-2.5 rounded-lg font-medium transition mt-2', transactionType === 'in' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-orange-600 text-white hover:bg-orange-700']">Simpan Data</button>
              </form>
              <div v-else class="space-y-4">
                <div @click="$refs.fileInput.click()" class="border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer hover:border-blue-500 hover:bg-gray-50">
                  <input type="file" ref="fileInput" class="hidden" accept=".xlsx, .xls" @change="handleFileSelect">
                  <i v-if="!excelFile" class="fa-solid fa-file-excel text-4xl text-green-500 mb-3"></i>
                  <i v-else class="fa-solid fa-file-circle-check text-4xl text-green-600 mb-3"></i>
                  <p class="text-gray-700 font-medium">{{ excelFile ? excelFile.name : 'Klik untuk Upload Excel (.xlsx)' }}</p>
                  <p class="text-xs text-gray-500 mt-1">Format: date, shopName, itemName, qty</p>
                </div>
                <div v-if="parsedExcelData.length > 0" class="text-xs border rounded-lg overflow-hidden">
                  <div class="bg-green-50 p-2 border-b font-bold text-green-800">Preview ({{ parsedExcelData.length }} baris):</div>
                  <div class="max-h-32 overflow-y-auto"><table class="w-full text-left"><tbody><tr v-for="(row, i) in parsedExcelData.slice(0, 5)" :key="i" class="border-b last:border-0"><td class="p-2">{{ row.shopName }}</td><td class="p-2">{{ row.itemName }}</td><td class="p-2 font-bold">{{ row.qty }}</td></tr></tbody></table></div>
                </div>
                <button type="button" @click="handleExcelUpload" :disabled="!excelFile || parsedExcelData.length === 0" :class="['w-full py-2.5 rounded-lg font-medium disabled:opacity-50 transition', transactionType === 'in' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-orange-600 text-white hover:bg-orange-700']">Upload Excel</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL 2: ADMIN PILIH CABANG -->
    <Teleport to="#modal-portal">
      <Transition name="modal">
        <div v-if="isAdminCabangModalOpen" class="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div class="relative bg-white w-full max-w-sm rounded-xl shadow-2xl border border-gray-100 z-20 pointer-events-auto">
            <div class="px-5 py-3 border-b flex justify-between items-center bg-purple-50">
              <h3 class="font-bold text-gray-800"><i class="fa-solid fa-warehouse text-purple-600 mr-2"></i>Pilih Cabang Tujuan</h3>
            </div>
            <form @submit.prevent="executeAdminUpload" class="p-5 space-y-4">
              <div><label class="block text-xs font-bold text-gray-700 mb-1">Masukkan ke Cabang</label><select v-model="selectedCabangForAdmin" class="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none appearance-none bg-white font-bold" required><option disabled value="">Pilih Cabang...</option><option v-for="c in storeList" :key="c" :value="c">{{ c }}</option></select></div>
              <div class="flex gap-2 pt-2">
                <button type="button" @click="isAdminCabangModalOpen = false" class="flex-1 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition">Batal</button>
                <button type="submit" class="flex-1 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition">Lanjutkan</button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL 3: RIWAYAT TRANSAKSI -->
    <Teleport to="#modal-portal">
      <Transition name="modal">
        <div v-if="isHistoryOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div @click="closeHistory" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div class="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-10 max-h-[85vh] pointer-events-auto">
            <div class="px-6 py-4 border-b flex justify-between items-center bg-indigo-50">
              <div><h3 class="text-lg font-bold text-gray-800">Riwayat Transaksi</h3><p class="text-xs text-gray-500">{{ historyItemName }} ({{ historyCabangName }})</p></div>
              <button type="button" @click="closeHistory" class="text-gray-400 hover:text-red-500"><i class="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div class="p-0 overflow-hidden flex-1 flex flex-col">
              <div class="overflow-y-auto p-0">
                <table class="w-full text-sm text-left">
                  <thead class="bg-gray-50 text-xs uppercase sticky top-0"><tr><th class="px-6 py-3">Tanggal</th><th class="px-6 py-3">Tipe</th><th class="px-6 py-3">Asal Toko</th><th class="px-6 py-3 text-center">Qty</th><th class="px-6 py-3 text-center">Aksi</th></tr></thead>
                  <tbody class="divide-y">
                    <tr v-if="historyData.length === 0"><td colspan="5" class="text-center py-8 text-gray-500">Belum ada riwayat.</td></tr>
                    <tr v-for="log in historyData" :key="log.id" class="hover:bg-gray-50">
                      <td class="px-6 py-3">{{ formatDateIndo(log.date) }}</td>
                      <td class="px-6 py-3"><span :class="['px-2 py-1 rounded text-xs font-bold uppercase', log.type === 'in' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700']">{{ log.type === 'in' ? 'Masuk' : 'Keluar' }}</span></td>
                      <td class="px-6 py-3 font-medium text-gray-800">{{ log.shopName }}</td>
                      <td class="px-6 py-3 text-center font-bold" :class="log.type === 'in' ? 'text-emerald-600' : 'text-red-600'">{{ log.type === 'in' ? '+' : '-' }}{{ log.qty }}</td>
                      <td class="px-6 py-3 text-center"><button type="button" @click="openEditHistory(log)" class="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition"><i class="fa-solid fa-pen-to-square text-lg"></i></button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL 4: EDIT HISTORY -->
    <Teleport to="#modal-portal">
      <Transition name="modal">
        <div v-if="isEditHistoryOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div @click="closeEditHistory" class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div class="relative bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-100 z-20 pointer-events-auto">
            <div class="px-5 py-3 border-b flex justify-between items-center"><h3 class="font-bold text-gray-800">Edit {{ editForm.type === 'in' ? 'Barang Masuk' : 'Barang Keluar' }}</h3><button type="button" @click="closeEditHistory"><i class="fa-solid fa-xmark"></i></button></div>
            <form @submit.prevent="saveEditHistory" class="p-5 space-y-4">
              <div><label class="block text-xs font-bold text-gray-700 mb-1">Tanggal</label><input v-model="editForm.date" type="date" class="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required /></div>
              <div><label class="block text-xs font-bold text-gray-700 mb-1">Jumlah (Qty)</label><input v-model.number="editForm.qty" type="number" min="1" class="w-full p-2.5 border rounded-lg font-mono focus:ring-2 focus:ring-blue-500 outline-none" required /></div>
              <div class="bg-yellow-50 text-yellow-700 text-xs p-2 rounded"><i class="fa-solid fa-exclamation-triangle"></i> Mengedit jumlah akan otomatis menyesuaikan stok master barang.</div>
              <div class="flex gap-2 pt-2">
                <button type="button" @click="closeEditHistory" class="flex-1 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition">Batal</button>
                <button type="submit" class="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">Simpan Perubahan</button>
              </div>
            </form>
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
            <div class="mb-4"><div class="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto"></div></div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Sedang Mengupload...</h3>
            <p class="text-sm text-gray-500 mb-6 font-medium">Jangan refresh halaman</p>
            <div class="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden relative"><div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-300 ease-out" :style="{ width: uploadProgress + '%' }"></div></div>
            <div class="flex justify-between items-center text-sm font-bold text-gray-700"><span>Proses: {{ uploadCount }} dari {{ uploadTotal }} Data</span><span>{{ Math.round(uploadProgress) }}%</span></div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import InventoryPresenter from './InventoryPresenter';
import { STORE_LIST } from '../auth/AuthModel';
import { showToast } from '../../utils/toastify';
import ExcelJS from 'exceljs';
import Storage from '../../utils/storage';

const storeList = ref(STORE_LIST);
const userData = ref(Storage.getUser());
const items = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const sortKey = ref('createdAt');
const sortAsc = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const filterCabang = ref('');

const isUploadModalOpen = ref(false);
const transactionType = ref('in');
const uploadTab = ref('single');
const uploadForm = reactive({ date: new Date().toISOString().split('T')[0], shopName: '', itemName: '', qty: 0 });
const excelFile = ref(null);
const parsedExcelData = ref([]);

const isAdminCabangModalOpen = ref(false);
const selectedCabangForAdmin = ref('');
const pendingUploadData = ref(null);

const isUploading = ref(false);
const uploadTotal = ref(0);
const uploadCount = ref(0);
const uploadProgress = ref(0);

const isHistoryOpen = ref(false);
const historyData = ref([]);
const historyItemName = ref('');
const historyCabangName = ref('');
const activeItemCode = ref('');
const isEditHistoryOpen = ref(false);
const editForm = reactive({ id: '', type: '', date: '', qty: 0 });

const presenter = new InventoryPresenter({
  setItems: (data) => items.value = data,
  setHistoryData: (data) => historyData.value = data,
  showLoading: (state) => isLoading.value = state,
  onCreateSuccess: (msg) => showToast(msg, 'success'),
  onUpdateSuccess: (msg) => showToast(msg, 'success'),
  onDeleteSuccess: (msg) => showToast(msg, 'success'),
  showError: (msg) => showToast(msg, 'error'),
  closeForm: () => {},
  showUploadProgress: (state) => isUploading.value = state,
  setUploadTotal: (total) => uploadTotal.value = total,
  setUploadCount: (count) => uploadCount.value = count,
  updateProgress: (percent) => uploadProgress.value = percent,
});

const formatDateIndo = (dateString) => { if (!dateString) return '-'; const date = new Date(dateString); return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); };
const sortBy = (k) => { if (sortKey.value === k) sortAsc.value = !sortAsc.value; else { sortKey.value = k; sortAsc.value = true; } currentPage.value = 1; };

const filteredItems = computed(() => {
  let t = [...items.value];
  if (userData.value?.role === 'admin' && filterCabang.value) { t = t.filter(i => i.namaCabang === filterCabang.value); }
  if(searchQuery.value) { const l = searchQuery.value.toLowerCase(); t = t.filter(i => (i.name&&i.name.toLowerCase().includes(l)) || (i.code&&i.code.toLowerCase().includes(l)) || (i.shopName&&i.shopName.toLowerCase().includes(l)) || (i.namaCabang&&i.namaCabang.toLowerCase().includes(l))); }
  t.sort((a,b) => { let A=a[sortKey.value], B=b[sortKey.value]; if (sortKey.value === 'createdAt') { if(A?.seconds) A=A.seconds*1000; if(B?.seconds) B=B.seconds*1000; A=new Date(A).getTime(); B=new Date(B).getTime(); } else if (typeof A === 'number' || typeof B === 'number') { A=Number(A)||0; B=Number(B)||0; } else { if(typeof A==='string') A=A.toLowerCase(); if(typeof B==='string') B=B.toLowerCase(); } if (A < B) return sortAsc.value ? -1 : 1; if (A > B) return sortAsc.value ? 1 : -1; return 0; });
  return t;
});

const totalStock = computed(() => filteredItems.value.reduce((sum, item) => sum + (item.stock || 0), 0));
const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage.value) || 1);
const paginationInfo = computed(() => { const start = (currentPage.value - 1) * itemsPerPage.value + 1; return { start, end: Math.min(start + itemsPerPage.value - 1, filteredItems.value.length) }; });
const paginatedItems = computed(() => filteredItems.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value));
watch([itemsPerPage, filterCabang], () => { currentPage.value = 1; });

const injectCabangToData = (dataArray, cabang) => dataArray.map(d => ({ ...d, namaCabang: cabang }));

const handleSingleUpload = () => {
  const user = Storage.getUser();
  if (user?.role === 'admin') { pendingUploadData.value = [{ ...uploadForm }]; isAdminCabangModalOpen.value = true; }
  else { if (!user?.namaCabang) return showToast('Data cabang user tidak ditemukan, coba logout lalu login ulang.', 'error'); presenter.uploadStock(transactionType.value, injectCabangToData([{ ...uploadForm }], user.namaCabang)); closeUploadModal(); }
};

const handleExcelUpload = () => {
  if(parsedExcelData.value.length===0) return showToast('Data Excel kosong', 'error');
  const user = Storage.getUser();
  if (user?.role === 'admin') { pendingUploadData.value = [...parsedExcelData.value]; isAdminCabangModalOpen.value = true; }
  else { if (!user?.namaCabang) return showToast('Data cabang user tidak ditemukan, coba logout lalu login ulang.', 'error'); presenter.uploadStock(transactionType.value, injectCabangToData([...parsedExcelData.value], user.namaCabang)); closeUploadModal(); }
};

const executeAdminUpload = () => {
  if (!selectedCabangForAdmin.value) return showToast('Pilih cabang terlebih dahulu', 'error');
  const finalData = injectCabangToData(pendingUploadData.value, selectedCabangForAdmin.value);
  isAdminCabangModalOpen.value = false; closeUploadModal();
  presenter.uploadStock(transactionType.value, finalData);
  pendingUploadData.value = null; selectedCabangForAdmin.value = '';
};

const exportToExcel = async () => {
  if (filteredItems.value.length === 0) return showToast('Data kosong', 'error');
  showToast('Sedang menyiapkan data laporan...', 'info');
  let fullReport = []; try { fullReport = await presenter.getInventoryReport(); } catch (e) { return; }
  const reportMap = new Map(); fullReport.forEach(r => reportMap.set(r.code, { totalIn: r.totalIn || 0, totalOut: r.totalOut || 0 }));
  const workbook = new ExcelJS.Workbook(); const sheet = workbook.addWorksheet('Laporan Stok');
  const headerStyle = { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } }, font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 }, alignment: { vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  const borderStyle = { border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }, alignment: { vertical: 'middle', horizontal: 'center' }, font: { size: 12 } };
  sheet.columns = [ { header: 'Kode', key: 'code', width: 20 }, { header: 'Nama Barang', key: 'name', width: 30 }, { header: 'Asal Toko', key: 'shopName', width: 25 }, { header: 'Nama Cabang', key: 'namaCabang', width: 25 }, { header: 'Total Masuk', key: 'in', width: 20 }, { header: 'Total Keluar', key: 'out', width: 20 }, { header: 'Stok Sekarang', key: 'stock', width: 25 } ];
  const headerRow = sheet.getRow(1); headerRow.height = 25; headerRow.eachCell((cell) => cell.style = headerStyle);
  filteredItems.value.forEach((item) => { const totals = reportMap.get(item.code) || { totalIn: 0, totalOut: 0 }; const row = sheet.addRow({ code: item.code, name: item.name, shopName: item.shopName || '-', namaCabang: item.namaCabang || '-', in: totals.totalIn, out: totals.totalOut, stock: item.stock }); row.eachCell((cell) => { cell.style = borderStyle; if ([5, 6, 7].includes(cell.column)) cell.numFmt = '#,##0'; }); });
  const buffer = await workbook.xlsx.writeBuffer(); const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.setAttribute('download', `Laporan_Stok_${new Date().toISOString().split('T')[0]}.xlsx`); document.body.appendChild(link); link.click(); document.body.removeChild(link);
  showToast('Excel berhasil didownload', 'success');
};

const openUploadModal = (type) => { transactionType.value = type; uploadForm.date = new Date().toISOString().split('T')[0]; uploadForm.shopName=''; uploadForm.itemName=''; uploadForm.qty=0; excelFile.value = null; parsedExcelData.value = []; uploadTab.value = 'single'; isUploadModalOpen.value = true; };
const closeUploadModal = () => { isUploadModalOpen.value = false; };
const handleFileSelect = (e) => { if (e.target.files.length) processFile(e.target.files[0]); };
const processFile = async (file) => {
  if (![".xlsx", ".xls"].includes(file.name.substring(file.name.lastIndexOf('.')))) return showToast('Format harus Excel', 'error');
  excelFile.value = file;
  try { const workbook = new ExcelJS.Workbook(); await workbook.xlsx.load(await file.arrayBuffer()); const data = []; workbook.getWorksheet(1).eachRow((row, rowNumber) => { if (rowNumber === 1) return; const values = row.values; values.shift(); data.push(values); }); parsedExcelData.value = data.map(row => ({ date: row[0], shopName: row[1], itemName: row[2], qty: parseInt(row[3]) || 0 })); } catch (error) { showToast('Gagal memproses file Excel', 'error'); }
};

const openHistory = (item) => { historyItemName.value = item.name; historyCabangName.value = item.namaCabang; activeItemCode.value = item.code; presenter.getHistory(item.code); isHistoryOpen.value = true; };
const closeHistory = () => { isHistoryOpen.value = false; };

// FIX: Tambahkan .split('T')[0] agar input type="date" tidak warning
const openEditHistory = (log) => { editForm.id = log.id; editForm.type = log.type; editForm.date = log.date ? new Date(log.date).toISOString().split('T')[0] : ''; editForm.qty = log.qty; isEditHistoryOpen.value = true; };
const closeEditHistory = () => { isEditHistoryOpen.value = false; };
const saveEditHistory = () => { presenter.editTransaction(editForm.id, editForm); presenter.getHistory(activeItemCode.value); closeEditHistory(); };

onMounted(() => { presenter.loadItems(); });
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type=number] { -moz-appearance:textfield; }
</style>