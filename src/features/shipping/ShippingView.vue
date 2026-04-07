<template>
  <div class="space-y-6">
    <!-- HEADER -->
    <div class="flex justify-between items-center flex-wrap gap-4">
      <div class="flex items-center gap-3">
        <h2 class="text-2xl font-bold text-gray-800">Data Pengiriman</h2>
        <select v-if="userData?.role === 'admin'" v-model="filterCabang" class="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium cursor-pointer"><option value="">Semua Cabang</option><option v-for="c in storeList" :key="c" :value="c">{{ c }}</option></select>
      </div>
      <div class="flex gap-3">
        <button @click="exportToExcel" class="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md transition-all"><i class="fa-solid fa-file-excel"></i> Export Excel</button>
        <button @click="openModal" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"><i class="fa-solid fa-plus"></i> Tambah Data</button>
      </div>
    </div>

    <!-- TABLE -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div v-if="isLoading" class="p-8 text-center text-gray-500"><i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Memuat data...</div>
      <table v-else class="w-full text-sm text-left text-gray-600">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th @click="sortBy('shippingNo')" class="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none group"><div class="flex items-center gap-1">No. Pengiriman <i v-if="sortKey === 'shippingNo'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i><i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i></div></th>
            <th @click="sortBy('date')" class="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none group"><div class="flex items-center gap-1">Tanggal <i v-if="sortKey === 'date'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i><i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i></div></th>
            <th @click="sortBy('name')" class="px-4 py-3 cursor-pointer hover:bg-gray-100 select-none group"><div class="flex items-center gap-1">Nama Pengiriman <i v-if="sortKey === 'name'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i><i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i></div></th>
            <th class="px-4 py-3">Cabang</th>
            <th @click="sortBy('price')" class="px-4 py-3 text-center cursor-pointer hover:bg-gray-100 select-none group relative"><div class="flex items-center justify-center gap-1">Harga <i v-if="sortKey === 'price'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i><i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i></div><div class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max bg-gray-900 text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-lg">Total: <span class="font-bold text-green-300">{{ formatRupiah(grandTotalPrice) }}</span></div></th>
            <th class="px-4 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paginatedShippings.length === 0"><td colspan="6" class="text-center py-8 text-gray-500">Data tidak ditemukan.</td></tr>
          <tr v-for="item in paginatedShippings" :key="item.id" class="bg-white border-b hover:bg-gray-50 transition-colors">
            <td class="px-4 py-4 font-medium text-gray-900">{{ item.shippingNo }}</td>
            <td class="px-4 py-4">{{ formatDateIndo(item.date) }}</td>
            <td class="px-4 py-4">{{ item.name }}</td>
            <td class="px-4 py-4"><span class="bg-blue-50 text-blue-700 py-1 px-2 rounded text-xs font-bold border border-blue-200">{{ item.namaCabang || '-' }}</span></td>
            <td class="px-4 py-4 font-mono text-right">{{ formatRupiah(item.price) }}</td>
            <td class="px-4 py-4 text-center">
              <button @click="openEdit(item)" class="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50 mr-1 transition"><i class="fa-solid fa-pen"></i></button>
              <button @click="requestDelete(item)" class="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- PAGINATION -->
      <div class="px-4 py-3 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div class="flex items-center gap-2 text-sm"><span class="text-gray-600">Tampilkan:</span><select v-model.number="itemsPerPage" class="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-blue-500 outline-none cursor-pointer"><option :value="5">5</option><option :value="10">10</option><option :value="25">25</option><option :value="50">50</option></select></div>
        <div class="text-sm text-gray-600 order-first sm:order-none">Menampilkan <span class="font-semibold text-gray-800">{{ paginationInfo.start }}</span> - <span class="font-semibold text-gray-800">{{ paginationInfo.end }}</span> dari <span class="font-semibold text-gray-800">{{ sortedShippings.length }}</span> data</div>
        <div class="flex items-center gap-1">
          <button @click="currentPage = 1" :disabled="currentPage === 1" class="px-2 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><i class="fa-solid fa-angles-left text-xs"></i></button>
          <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">Prev</button>
          <span class="px-3 py-1 text-sm font-bold text-blue-600">{{ currentPage }} / {{ totalPages || 1 }}</span>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">Next</button>
          <button @click="currentPage = totalPages" :disabled="currentPage === totalPages" class="px-2 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><i class="fa-solid fa-angles-right text-xs"></i></button>
        </div>
      </div>
    </div>

    <!-- MODAL CRUD -->
    <Teleport to="#modal-portal"><Transition name="modal"><div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4"><div @click="closeModal" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div><div class="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-10 max-h-[90vh] pointer-events-auto">
      <div class="px-6 py-4 border-b flex justify-between items-center" :class="isEditing ? 'bg-blue-50' : 'bg-emerald-50'"><h3 class="text-lg font-bold text-gray-800"><i :class="!isEditing ? 'fa-solid fa-truck-fast text-emerald-600' : 'fa-solid fa-pen-to-square text-blue-600'" class="mr-2"></i>{{ isEditing ? 'Edit Data Pengiriman' : 'Tambah Data Pengiriman' }}</h3><button type="button" @click="closeModal" class="text-gray-400 hover:text-red-500 transition"><i class="fa-solid fa-xmark text-xl"></i></button></div>
      <div v-if="!isEditing" class="flex border-b"><button type="button" @click="activeTab = 'single'" :class="['flex-1 py-3 text-sm font-medium transition-colors focus:outline-none', activeTab === 'single' ? 'border-b-2 border-emerald-600 text-emerald-600 bg-emerald-50' : 'text-gray-500 hover:text-gray-700']">Input Satuan</button><button type="button" @click="activeTab = 'excel'" :class="['flex-1 py-3 text-sm font-medium transition-colors focus:outline-none', activeTab === 'excel' ? 'border-b-2 border-emerald-600 text-emerald-600 bg-emerald-50' : 'text-gray-500 hover:text-gray-700']">Import Excel</button></div>
      <div class="p-6 overflow-y-auto flex-1">
        <form v-if="activeTab === 'single' || isEditing" @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label class="block text-sm font-medium text-gray-700 mb-1">No. Pengiriman (Auto)</label><input v-model="form.shippingNo" type="text" disabled class="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed" /></div>
            <div><label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Pengiriman</label><input v-model="form.date" type="date" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" required /></div>
            <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Nama Pengiriman</label><input v-model="form.name" type="text" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Contoh: JNE Trucking" required /></div>
            <div class="col-span-2"><label class="block text-sm font-medium text-gray-700 mb-1">Harga Pengiriman</label><div class="relative"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-bold text-gray-500">Rp</div><input v-model="formattedPrice" @input="handleInputPrice" type="text" inputmode="numeric" class="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono" placeholder="10000" required /></div></div>
          </div>
          <div v-if="!isEditing" class="text-xs p-3 rounded mt-2 border bg-emerald-50 text-emerald-700 border-emerald-200"><i class="fa-solid fa-info-circle mr-1"></i> Nomor dibuat otomatis.</div>
        </form>
        <div v-else class="space-y-4">
          <div @click="$refs.fileInput.click()" class="border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer hover:border-green-500 hover:bg-gray-50"><input type="file" ref="fileInput" class="hidden" accept=".xlsx, .xls" @change="handleFileSelect"><i :class="!excelFile ? 'fa-solid fa-file-excel text-4xl text-green-500 mb-3' : 'fa-solid fa-file-circle-check text-4xl text-green-600 mb-3'"></i><p class="text-gray-700 font-medium">{{ excelFile ? excelFile.name : 'Klik untuk Upload Excel (.xlsx)' }}</p><p class="text-xs text-gray-500 mt-1">Format: A: No | B: Tgl | C: Nama | D: Harga</p></div>
          <div v-if="validationErrors.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4 max-h-40 overflow-y-auto"><h4 class="text-sm font-bold text-red-700 mb-2">⚠️ {{ validationErrors.length }} Data Tidak Valid:</h4><ul class="list-disc list-inside text-xs text-red-600 space-y-1"><li v-for="(err, idx) in validationErrors.slice(0, 5)" :key="idx">{{ err }}</li><li v-if="validationErrors.length > 5">... dan {{ validationErrors.length - 5 }} lainnya.</li></ul></div>
          <div v-if="parsedExcelData.length > 0" class="text-xs border rounded-lg overflow-hidden"><div class="bg-green-50 p-2 border-b font-bold text-green-800">Siap Upload: {{ parsedExcelData.length }} Data</div><div class="max-h-40 overflow-y-auto"><table class="w-full text-left"><tbody><tr v-for="(row, i) in parsedExcelData.slice(0, 5)" :key="i" class="border-b last:border-0"><td class="p-2">{{ row.name }}</td><td class="p-2 font-bold">{{ formatRupiah(row.price) }}</td></tr></tbody></table></div></div>
        </div>
      </div>
      <div class="px-6 py-4 border-t bg-gray-50 flex gap-3 justify-end">
        <button type="button" @click="closeModal" class="px-5 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition">Batal</button>
        <button v-if="activeTab === 'single' || isEditing" type="submit" @click="handleSubmit" class="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition shadow-sm">{{ isEditing ? 'Simpan Perubahan' : 'Tambah Data' }}</button>
        <button v-else @click="handleExcelUpload" :disabled="!excelFile || parsedExcelData.length === 0" class="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition disabled:opacity-50 shadow-sm">Upload {{ parsedExcelData.length }} Data</button>
      </div>
    </div></div></Transition></Teleport>

    <!-- MODAL ADMIN PILIH CABANG -->
    <Teleport to="#modal-portal"><Transition name="modal"><div v-if="isAdminCabangModalOpen" class="fixed inset-0 z-[150] flex items-center justify-center p-4"><div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div><div class="relative bg-white w-full max-w-sm rounded-xl shadow-2xl border border-gray-100 z-20 pointer-events-auto">
      <div class="px-5 py-3 border-b flex justify-between items-center bg-purple-50"><h3 class="font-bold text-gray-800"><i class="fa-solid fa-warehouse text-purple-600 mr-2"></i>Pilih Cabang Tujuan</h3></div>
      <form @submit.prevent="executeAdminUpload" class="p-5 space-y-4">
        <div><label class="block text-xs font-bold text-gray-700 mb-1">Masukkan ke Cabang</label><select v-model="selectedCabangForAdmin" class="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none appearance-none bg-white font-bold" required><option disabled value="">Pilih Cabang...</option><option v-for="c in storeList" :key="c" :value="c">{{ c }}</option></select></div>
        <div class="flex gap-2 pt-2"><button type="button" @click="isAdminCabangModalOpen = false" class="flex-1 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition">Batal</button><button type="submit" class="flex-1 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition">Lanjutkan</button></div>
      </form>
    </div></div></Transition></Teleport>

    <!-- MODAL DELETE -->
    <Teleport to="#modal-portal"><Transition name="modal"><div v-if="isDeleteModalOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4"><div @click="closeDeleteModal" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div><div class="relative bg-white w-full max-w-sm rounded-xl shadow-2xl border border-red-100 z-10 pointer-events-auto p-6 text-center">
      <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><i class="fa-solid fa-triangle-exclamation text-3xl"></i></div>
      <h3 class="text-lg font-bold text-gray-800 mb-2">Hapus Data?</h3><p class="text-gray-500 text-sm mb-6">Data <b>{{ itemToDelete?.shippingNo }}</b> akan dihapus permanen.</p>
      <div class="flex gap-3 justify-center"><button @click="closeDeleteModal" class="flex-1 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition">Batal</button><button @click="confirmDelete" class="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition">Ya, Hapus</button></div>
    </div></div></Transition></Teleport>

    <!-- MODAL PROGRESS -->
    <Teleport to="#modal-portal"><Transition name="modal"><div v-if="isUploading" class="fixed inset-0 z-[200] flex items-center justify-center p-4"><div class="absolute inset-0 bg-black/80 backdrop-blur-sm z-0"></div><div class="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 p-8 text-center z-10 pointer-events-none">
      <div class="mb-4"><div class="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto"></div></div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">Sedang Mengupload...</h3>
      <div class="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden relative"><div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-300 ease-out" :style="{ width: uploadProgress + '%' }"></div></div>
      <div class="flex justify-between items-center text-sm font-bold text-gray-700"><span>Proses: {{ uploadCount }} dari {{ uploadTotal }}</span><span>{{ Math.round(uploadProgress) }}%</span></div>
    </div></div></Transition></Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import ShippingPresenter from './ShippingPresenter';
import { STORE_LIST } from '../auth/AuthModel';
import { showToast } from '../../utils/toastify';
import ExcelJS from 'exceljs';
import Storage from '../../utils/storage';

const storeList = ref(STORE_LIST);
const userData = ref(Storage.getUser());
const shippings = ref([]);
const isLoading = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortKey = ref('createdAt');
const sortAsc = ref(false);
const filterCabang = ref('');

const isUploading = ref(false);
const uploadTotal = ref(0);
const uploadCount = ref(0);
const uploadProgress = ref(0);

const isModalOpen = ref(false);
const isEditing = ref(false);
const activeTab = ref('single');
const form = reactive({ id: null, shippingNo: '', date: '', name: '', price: 0 });
const excelFile = ref(null);
const parsedExcelData = ref([]);
const validationErrors = ref([]);

const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);

// Admin Cabang Modal State
const isAdminCabangModalOpen = ref(false);
const selectedCabangForAdmin = ref('');
const pendingUploadData = ref(null);

const presenter = new ShippingPresenter({
  setShippings: (data) => shippings.value = data,
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

const formatRupiah = (num) => !num && num !== 0 ? 'Rp 0' : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
const formatDateIndo = (dateString) => { if (!dateString) return '-'; const date = new Date(dateString); return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); };
const sortBy = (key) => { if (sortKey.value === key) sortAsc.value = !sortAsc.value; else { sortKey.value = key; sortAsc.value = true; } currentPage.value = 1; };

const sortedShippings = computed(() => {
  let t = [...shippings.value];
  if (userData.value?.role === 'admin' && filterCabang.value) { t = t.filter(i => i.namaCabang === filterCabang.value); }
  t.sort((a, b) => { let valA = a[sortKey.value], valB = b[sortKey.value]; if (sortKey.value === 'date' || sortKey.value === 'createdAt') { valA = new Date(valA).getTime(); valB = new Date(valB).getTime(); } else if (typeof valA === 'number' || typeof valB === 'number') { valA = Number(valA) || 0; valB = Number(valB) || 0; } else { valA = (valA||'').toLowerCase(); valB = (valB||'').toLowerCase(); } if (valA < valB) return sortAsc.value ? -1 : 1; if (valA > valB) return sortAsc.value ? 1 : -1; return 0; });
  return t;
});

const grandTotalPrice = computed(() => sortedShippings.value.reduce((sum, item) => sum + (Number(item.price) || 0), 0));
const totalPages = computed(() => Math.ceil(sortedShippings.value.length / itemsPerPage.value) || 1);
const paginationInfo = computed(() => { const start = (currentPage.value - 1) * itemsPerPage.value + 1; return { start, end: Math.min(start + itemsPerPage.value - 1, sortedShippings.value.length) }; });
const paginatedShippings = computed(() => sortedShippings.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value));
watch([itemsPerPage, filterCabang], () => { currentPage.value = 1; });

const injectCabangToData = (dataArray, cabang) => dataArray.map(d => ({ ...d, namaCabang: cabang }));

const handleSubmit = () => {
  if (!form.name || !form.date) return showToast('Nama dan Tanggal wajib diisi', 'error');
  const today = new Date(); today.setHours(0,0,0,0);
  if (new Date(form.date) > today) return showToast('Tanggal tidak boleh lebih dari hari ini', 'error');
  const user = Storage.getUser();
  if (user?.role === 'admin') { pendingUploadData.value = [{ ...form }]; isAdminCabangModalOpen.value = true; }
  else { if (!user?.namaCabang) return showToast('Data cabang user tidak ditemukan', 'error'); presenter.createShipping(injectCabangToData([{ ...form }], user.namaCabang)[0]); closeModal(); }
};

const handleExcelUpload = () => {
  if (parsedExcelData.value.length === 0) return showToast('Tidak ada data valid', 'error');
  const user = Storage.getUser();
  if (user?.role === 'admin') { pendingUploadData.value = [...parsedExcelData.value]; isAdminCabangModalOpen.value = true; }
  else { if (!user?.namaCabang) return showToast('Data cabang user tidak ditemukan', 'error'); presenter.uploadCsv(injectCabangToData([...parsedExcelData.value], user.namaCabang)); closeModal(); }
};

const executeAdminUpload = () => {
  if (!selectedCabangForAdmin.value) return showToast('Pilih cabang terlebih dahulu', 'error');
  const finalData = injectCabangToData(pendingUploadData.value, selectedCabangForAdmin.value);
  isAdminCabangModalOpen.value = false; closeModal();
  if (Array.isArray(finalData) && finalData.length > 1) presenter.uploadCsv(finalData);
  else presenter.createShipping(finalData[0]);
  pendingUploadData.value = null; selectedCabangForAdmin.value = '';
};

const openModal = () => { isEditing.value = false; activeTab.value = 'single'; Object.assign(form, { id: null, shippingNo: '', date: new Date().toISOString().split('T')[0], name: '', price: 0 }); formattedPrice.value = ''; excelFile.value = null; parsedExcelData.value = []; validationErrors.value = []; isModalOpen.value = true; };
const closeModal = () => isModalOpen.value = false;
const openEdit = (item) => { isEditing.value = true; activeTab.value = 'single'; let dv = item.date; if(typeof dv==='string'&&dv.includes('T')) dv=dv.split('T')[0]; const p = parseInt(item.price); Object.assign(form, { id: item.id, shippingNo: item.shippingNo, date: dv, name: item.name, price: p }); formattedPrice.value = p.toLocaleString('id-ID'); isModalOpen.value = true; };
const requestDelete = (item) => { itemToDelete.value = item; isDeleteModalOpen.value = true; };
const closeDeleteModal = () => { itemToDelete.value = null; isDeleteModalOpen.value = false; };
const confirmDelete = () => { if (itemToDelete.value) { presenter.deleteShipping(itemToDelete.value.id); closeDeleteModal(); } };

const exportToExcel = async () => {
  if (sortedShippings.value.length === 0) return showToast('Data kosong', 'error');
  const workbook = new ExcelJS.Workbook(); const sheet = workbook.addWorksheet('Data Pengiriman');
  const hs = { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } }, font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 }, alignment: { vertical: 'middle', horizontal: 'center' }, border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } };
  const bs = { border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }, alignment: { vertical: 'middle', horizontal: 'center' } };
  sheet.columns = [ { header: 'No. Pengiriman', key: 'no', width: 25 }, { header: 'Tanggal', key: 'date', width: 20 }, { header: 'Nama', key: 'name', width: 30 }, { header: 'Cabang', key: 'cabang', width: 25 }, { header: 'Harga', key: 'price', width: 25 } ];
  sheet.getRow(1).height = 25; sheet.getRow(1).eachCell((c) => c.style = hs);
  sortedShippings.value.forEach(s => { const r = sheet.addRow({ no: s.shippingNo, date: s.date ? new Date(s.date).toISOString().split('T')[0] : '-', name: s.name, cabang: s.namaCabang || '-', price: s.price }); r.eachCell((c) => { c.style = bs; if (c.column === 5) c.numFmt = '"Rp"#,##0'; }); });
  const buffer = await workbook.xlsx.writeBuffer(); const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); const url = window.URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.setAttribute('download', `Pengiriman_${new Date().toISOString().split('T')[0]}.xlsx`); document.body.appendChild(link); link.click(); document.body.removeChild(link);
  showToast('Excel berhasil didownload', 'success');
};

const handleFileSelect = async (e) => {
  if (!e.target.files.length) return; const file = e.target.files[0];
  if (![".xlsx", ".xls"].includes(file.name.substring(file.name.lastIndexOf('.')))) return showToast('Format harus Excel', 'error');
  excelFile.value = file; parsedExcelData.value = []; validationErrors.value = [];
  try {
    const workbook = new ExcelJS.Workbook(); await workbook.xlsx.load(await file.arrayBuffer()); const ws = workbook.getWorksheet(1); if (!ws) return showToast('Worksheet tidak ditemukan', 'error');
    const today = new Date(); today.setHours(0,0,0,0); const validRows = [], errors = [];
    ws.eachRow((row, rn) => {
      if (rn === 1) return; const v = row.values; v.shift();
      let err = "", vd = "", vp = 0;
      if (!v[2]) err = `Baris ${rn}: Nama kosong`;
      if (!err) { vp = typeof v[3] === 'number' ? v[3] : parseInt((v[3]||'').replace(/\D/g, '')) || 0; if (!vp) err = `Baris ${rn}: Harga tidak valid`; }
      if (!err) { let d = v[1]; if(typeof d==='number') d=new Date((d-25569)*86400*1000); else if(typeof d==='string'){ const p=d.split(/[-\/]/); d=p[0].length===4?new Date(d):new Date(`${p[2]}-${p[1]}-${p[0]}`); } if(!d||isNaN(d.getTime())) err=`Baris ${rn}: Tanggal salah`; else { vd=d.toISOString().split('T')[0]; if(d>today) err=`Baris ${rn}: Tanggal > hari ini`; } }
      if (err) errors.push(err); else validRows.push({ shippingNo: v[0]||"", date: vd, name: v[2], price: vp });
    });
    parsedExcelData.value = validRows; validationErrors.value = errors;
  } catch (err) { showToast('Gagal membaca Excel', 'error'); }
};

const formattedPrice = ref('');
const handleInputPrice = (e) => { const raw = e.target.value.replace(/\D/g, ''); if (!raw) { formattedPrice.value = ''; form.price = 0; } else { const num = parseInt(raw, 10); formattedPrice.value = num.toLocaleString('id-ID'); form.price = num; } };

onMounted(() => presenter.loadShippings());
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type=number] { -moz-appearance:textfield; }
</style>