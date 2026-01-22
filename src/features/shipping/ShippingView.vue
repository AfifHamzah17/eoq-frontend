<template>
  <div class="space-y-6">
    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-800">Data Pengiriman</h2>
      
      <div class="flex gap-3">
        <!-- Tombol Export Excel -->
        <button 
          @click="exportToExcel" 
          class="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md transition-all"
        >
          <i class="fa-solid fa-file-excel"></i> Export Excel
        </button>
        <button 
          @click="openModal" 
          class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
        >
          <i class="fa-solid fa-plus"></i> Tambah Data
        </button>
      </div>
    </div>

    <!-- TABLE MASTER DATA -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div v-if="isLoading" class="p-8 text-center text-gray-500">
        <i class="fa-solid fa-circle-notch fa-spin mr-2"></i> Memuat data...
      </div>

      <table v-else class="w-full text-sm text-left text-gray-600">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th @click="sortBy('shippingNo')" class="px-6 py-3 cursor-pointer hover:bg-gray-100 select-none group">
              <div class="flex items-center gap-1">No. Pengiriman 
                <i v-if="sortKey === 'shippingNo'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i>
                <i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i>
              </div>
            </th>
            <th @click="sortBy('date')" class="px-6 py-3 cursor-pointer hover:bg-gray-100 select-none group">
              <div class="flex items-center gap-1">Tanggal Pengiriman
                <i v-if="sortKey === 'date'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i>
                <i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i>
              </div>
            </th>
            <th @click="sortBy('name')" class="px-6 py-3 cursor-pointer hover:bg-gray-100 select-none group">
              <div class="flex items-center gap-1">Nama Pengiriman
                <i v-if="sortKey === 'name'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i>
                <i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i>
              </div>
            </th>
            <th @click="sortBy('price')" class="px-6 py-3 text-center cursor-pointer hover:bg-gray-100 select-none group">
              <div class="flex items-center justify-center gap-1">Harga 
                <i v-if="sortKey === 'price'" class="fa-solid text-blue-600" :class="sortAsc ? 'fa-sort-up' : 'fa-sort-down'"></i>
                <i v-else class="fa-solid fa-sort text-gray-300 opacity-0 group-hover:opacity-100"></i>
              </div>
            </th>
            <th class="px-6 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredShippings.length === 0">
            <td colspan="5" class="text-center py-8 text-gray-500">Data tidak ditemukan.</td>
          </tr>
          <tr v-for="item in filteredShippings" :key="item.id" class="bg-white border-b hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 font-medium text-gray-900">{{ item.shippingNo }}</td>
            <!-- TAMPILAN TANGGAL DD-MM-YYYY -->
            <td class="px-6 py-4">{{ formatDateIndo(item.date) }}</td>
            <td class="px-6 py-4">{{ item.name }}</td>
            <td class="px-6 py-4 font-mono">{{ formatRupiah(item.price) }}</td>
            <td class="px-6 py-4 text-center">
              <button @click="openEdit(item)" class="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50 mr-1 transition">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button @click="requestDelete(item)" class="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL CRUD (UNIFIED) -->
    <Teleport to="#modal-portal">
      <Transition name="modal">
        <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div @click="closeModal" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          
          <div class="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-10 max-h-[90vh] pointer-events-auto">
            <!-- HEADER -->
            <div class="px-6 py-4 border-b flex justify-between items-center" :class="isEditing ? 'bg-blue-50' : 'bg-emerald-50'">
              <h3 class="text-lg font-bold text-gray-800">
                <i v-if="!isEditing" class="fa-solid fa-truck-fast text-emerald-600 mr-2"></i>
                <i v-else class="fa-solid fa-pen-to-square text-blue-600 mr-2"></i>
                {{ isEditing ? 'Edit Data Pengiriman' : 'Tambah Data Pengiriman' }}
              </h3>
              <button type="button" @click="closeModal" class="text-gray-400 hover:text-red-500 transition"><i class="fa-solid fa-xmark text-xl"></i></button>
            </div>

            <!-- TABS -->
            <div v-if="!isEditing" class="flex border-b">
              <button type="button" @click="activeTab = 'single'" :class="['flex-1 py-3 text-sm font-medium transition-colors focus:outline-none', activeTab === 'single' ? 'border-b-2 border-emerald-600 text-emerald-600 bg-emerald-50' : 'text-gray-500 hover:text-gray-700']">
                Input Satuan
              </button>
              <button type="button" @click="activeTab = 'excel'" :class="['flex-1 py-3 text-sm font-medium transition-colors focus:outline-none', activeTab === 'excel' ? 'border-b-2 border-emerald-600 text-emerald-600 bg-emerald-50' : 'text-gray-500 hover:text-gray-700']">
                Import Excel
              </button>
            </div>

            <!-- CONTENT AREA -->
            <div class="p-6 overflow-y-auto flex-1">
              <!-- TAB 1: INPUT SATUAN -->
              <form v-if="activeTab === 'single' || isEditing" @submit.prevent="handleSubmit" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">No. Pengiriman (Auto)</label>
                    <div class="relative">
                      <input v-model="form.shippingNo" type="text" disabled class="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Pengiriman</label>
                    <!-- Input date tetap YYYY-MM-DD (standard HTML) -->
                    <input v-model="form.date" type="date" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" required />
                  </div>
                  <div class="col-span-1 md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pengiriman</label>
                    <input v-model="form.name" type="text" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Contoh: JNE Trucking" required />
                  </div>
                  <div class="col-span-1 md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Harga Pengiriman</label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-bold text-gray-500">Rp</div>
                      <input 
                        v-model="formattedPrice" 
                        @input="handleInputPrice"
                        type="text" 
                        inputmode="numeric"
                        class="w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono" 
                        placeholder="10000" 
                        required 
                      />
                    </div>
                  </div>
                </div>
                <div v-if="!isEditing" class="text-xs p-3 rounded mt-2 border bg-emerald-50 text-emerald-700 border-emerald-200">
                  <i class="fa-solid fa-info-circle mr-1"></i> Nomor Pengiriman dibuat otomatis. Tanggal tidak boleh lebih dari hari ini.
                </div>
              </form>

              <!-- TAB 2: IMPORT EXCEL -->
              <div v-else class="space-y-4">
                <div @click="$refs.fileInput.click()" class="border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer hover:border-green-500 hover:bg-gray-50">
                  <input type="file" ref="fileInput" class="hidden" accept=".xlsx, .xls" @change="handleFileSelect">
                  <i v-if="!excelFile" class="fa-solid fa-file-excel text-4xl text-green-500 mb-3"></i>
                  <i v-else class="fa-solid fa-file-circle-check text-4xl text-green-600 mb-3"></i>
                  <p class="text-gray-700 font-medium">{{ excelFile ? excelFile.name : 'Klik untuk Upload Excel (.xlsx)' }}</p>
                  <p class="text-xs text-gray-500 mt-1">
                    Format Kolom: <br>
                    A: No. Pengiriman | B: Tgl (YYYY-MM-DD) | C: Nama | D: Harga
                  </p>
                </div>

                <!-- Validations Errors -->
                <div v-if="validationErrors.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <h4 class="text-sm font-bold text-red-700 mb-2">⚠️ {{ validationErrors.length }} Data Tidak Valid (Dilewati):</h4>
                  <ul class="list-disc list-inside text-xs text-red-600 space-y-1">
                    <li v-for="(err, idx) in validationErrors.slice(0, 5)" :key="idx">{{ err }}</li>
                    <li v-if="validationErrors.length > 5">... dan {{ validationErrors.length - 5 }} lainnya.</li>
                  </ul>
                </div>

                <!-- Preview Data Valid -->
                <div v-if="parsedExcelData.length > 0" class="text-xs border rounded-lg overflow-hidden">
                  <div class="bg-green-50 p-2 border-b font-bold text-green-800">
                    Siap Upload: {{ parsedExcelData.length }} Data Valid
                  </div>
                  <div class="max-h-40 overflow-y-auto">
                    <table class="w-full text-left">
                      <tbody>
                        <tr v-for="(row, i) in parsedExcelData.slice(0, 5)" :key="i" class="border-b last:border-0">
                          <td class="p-2">{{ row.shippingNo }}</td>
                          <td class="p-2">{{ formatDateIndo(row.date) }}</td>
                          <td class="p-2">{{ row.name }}</td>
                          <td class="p-2 font-bold">{{ formatRupiah(row.price) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- FOOTER ACTIONS -->
            <div class="px-6 py-4 border-t bg-gray-50 flex gap-3 justify-end">
              <button type="button" @click="closeModal" class="px-5 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition">Batal</button>
              
              <button v-if="activeTab === 'single' || isEditing" type="submit" @click="handleSubmit" class="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition shadow-sm">
                {{ isEditing ? 'Simpan Perubahan' : 'Tambah Data' }}
              </button>

              <button v-else @click="handleExcelUpload" :disabled="!excelFile || parsedExcelData.length === 0" class="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition disabled:opacity-50 shadow-sm">
                Upload {{ parsedExcelData.length }} Data
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL CONFIRM DELETE -->
    <Teleport to="#modal-portal">
      <Transition name="modal">
        <div v-if="isDeleteModalOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div @click="closeDeleteModal" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div class="relative bg-white w-full max-w-sm rounded-xl shadow-2xl border border-red-100 z-10 pointer-events-auto p-6 text-center">
            <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fa-solid fa-triangle-exclamation text-3xl"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">Hapus Data?</h3>
            <p class="text-gray-500 text-sm mb-6">
              Data pengiriman <b>{{ itemToDelete?.shippingNo }}</b> akan dihapus secara permanen.
            </p>
            <div class="flex gap-3 justify-center">
              <button @click="closeDeleteModal" class="flex-1 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition">Batal</button>
              <button @click="confirmDelete" class="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition">Ya, Hapus</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

        <!-- MODAL PROGRESS UPLOAD (Baru) -->
    <Teleport to="#modal-portal">
      <Transition name="modal">
        <div v-if="isUploading" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm z-0"></div>
          
          <div class="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 p-8 text-center z-10 pointer-events-none">
            
            <!-- Spinner Animasi -->
            <div class="mb-4">
              <div class="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            </div>

            <h3 class="text-xl font-bold text-gray-800 mb-2">Sedang Mengupload...</h3>
            <p class="text-sm text-gray-500 mb-6 font-medium">
              Jangan refresh halaman agar data tidak hilang
            </p>

            <!-- Progress Bar Container -->
            <div class="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden relative">
              <div 
                class="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-300 ease-out" 
                :style="{ width: uploadProgress + '%' }"
              ></div>
            </div>

            <!-- Text Counter -->
            <div class="flex justify-between items-center text-sm font-bold text-gray-700">
              <span>Proses: {{ uploadCount }} dari {{ uploadTotal }} Data</span>
              <span>{{ Math.round(uploadProgress) }}%</span>
            </div>
            
            <p v-if="uploadCount === uploadTotal" class="text-emerald-600 font-bold mt-4 animate-pulse">
              <i class="fa-solid fa-check-circle mr-1"></i> Hampir Selesai!
            </p>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import ShippingPresenter from './ShippingPresenter';
import { showToast } from '../../utils/toastify';
import ExcelJS from 'exceljs';

// --- STATE ---
const shippings = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');

const isUploading = ref(false);
const uploadTotal = ref(0);
const uploadCount = ref(0);
const uploadProgress = ref(0);

// Sort State
const sortKey = ref('createdAt'); 
const sortAsc = ref(false);

// Modal CRUD State
const isModalOpen = ref(false);
const isEditing = ref(false);
const activeTab = ref('single'); 
const form = reactive({ id: null, shippingNo: '', date: '', name: '', price: 0 });

// Excel Import State
const excelFile = ref(null);
const parsedExcelData = ref([]);
const validationErrors = ref([]);

// Delete State
const isDeleteModalOpen = ref(false);
const itemToDelete = ref(null);

// --- PRESENTER ---
const presenter = new ShippingPresenter({
  setShippings: (data) => shippings.value = data,
  showLoading: (state) => isLoading.value = state,
  onCreateSuccess: (msg) => showToast(msg, 'success'),
  onUpdateSuccess: (msg) => showToast(msg, 'success'),
  onDeleteSuccess: (msg) => showToast(msg, 'success'),
  showError: (msg) => showToast(msg, 'error'),
  closeForm: () => {},

  // --- FUNGSI PROGRESS ---
  showUploadProgress: (state) => isUploading.value = state,
  setUploadTotal: (total) => uploadTotal.value = total,
  setUploadCount: (count) => uploadCount.value = count,
  updateProgress: (percent) => uploadProgress.value = percent,
});

// --- HELPERS ---
const formatRupiah = (num) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
};

// Format Tanggal: YYYY-MM-DD (DB) -> DD-MM-YYYY (Display)
const formatDateIndo = (dateString) => {
  if (!dateString) return '-';
  // Jika dateString bukan string (misal timestamp), handle sesuai kebutuhan
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateString;
};

// --- FILTER & SORT ---
const sortBy = (key) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
};

const filteredShippings = computed(() => {
  let t = [...shippings.value];
  
  if (searchQuery.value) {
    const lower = searchQuery.value.toLowerCase();
    t = t.filter(s => 
      s.name.toLowerCase().includes(lower) || 
      s.shippingNo.toLowerCase().includes(lower)
    );
  }
  
  t.sort((a, b) => {
    let valA = a[sortKey.value];
    let valB = b[sortKey.value];
    if (valA < valB) return sortAsc.value ? -1 : 1;
    if (valA > valB) return sortAsc.value ? 1 : -1;
    return 0;
  });

  return t;
});

// --- ACTIONS CRUD ---
const openModal = () => {
  isEditing.value = false;
  activeTab.value = 'single';
  
  // Default Date: Hari ini (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];
  Object.assign(form, { id: null, shippingNo: '', date: today, name: '', price: 0 });
  
  // Reset Excel State
  excelFile.value = null;
  parsedExcelData.value = [];
  validationErrors.value = [];
  
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSubmit = () => {
  // Manual Input Logic
  if (!form.name || !form.date) return showToast('Nama dan Tanggal wajib diisi', 'error');
  
  // Validasi Tanggal Tidak Boleh > Hari Ini
  const today = new Date();
  today.setHours(0,0,0,0);
  const inputDate = new Date(form.date);
  
  if (inputDate > today) {
    return showToast('Tanggal pengiriman tidak boleh lebih dari hari ini', 'error');
  }

  if (isEditing.value) {
    presenter.updateShipping(form.id, form);
  } else {
    presenter.createShipping(form);
  }
  closeModal();
};

const openEdit = (item) => {
  isEditing.value = true;
  activeTab.value = 'single';
  
  const priceNum = parseInt(item.price); 
  Object.assign(form, { 
    id: item.id, 
    shippingNo: item.shippingNo, 
    date: item.date, 
    name: item.name, 
    price: priceNum 
  });
  formattedPrice.value = priceNum.toLocaleString('id-ID');
  
  isModalOpen.value = true;
};

// --- ACTIONS DELETE ---
const requestDelete = (item) => {
  itemToDelete.value = item;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  itemToDelete.value = null;
  isDeleteModalOpen.value = false;
};

const confirmDelete = () => {
  if (itemToDelete.value) {
    presenter.deleteShipping(itemToDelete.value.id);
    closeDeleteModal();
  }
};

// --- EXCEL LOGIC ---

// 1. Export Excel
const exportToExcel = async () => {
  if (shippings.value.length === 0) return showToast('Data kosong', 'error');

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Data Pengiriman');
  
  // Styles
  const headerStyle = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } },
    font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 },
    alignment: { vertical: 'middle', horizontal: 'center' },
    border: { top: { style: 'thin', color: { argb: 'FF000000' } }, left: { style: 'thin', color: { argb: 'FF000000' } }, bottom: { style: 'thin', color: { argb: 'FF000000' } }, right: { style: 'thin', color: { argb: 'FF000000' } } }
  };
  const borderStyle = {
    border: { top: { style: 'thin', color: { argb: 'FF000000' } }, left: { style: 'thin', color: { argb: 'FF000000' } }, bottom: { style: 'thin', color: { argb: 'FF000000' } }, right: { style: 'thin', color: { argb: 'FF000000' } } },
    alignment: { vertical: 'middle', horizontal: 'center' }
  };

  sheet.columns = [
    { header: 'No. Pengiriman', key: 'no', width: 25 },
    { header: 'Tanggal Pengiriman', key: 'date', width: 20 },
    { header: 'Nama Pengiriman', key: 'name', width: 30 },
    { header: 'Harga Pengiriman', key: 'price', width: 25 },
  ];

  // Header Style
  const headerRow = sheet.getRow(1);
  headerRow.height = 25;
  headerRow.eachCell((cell) => cell.style = headerStyle);

  const today = new Date();
  shippings.value.forEach(s => {
    const row = sheet.addRow({
      no: s.shippingNo,
      date: s.date,
      name: s.name,
      price: s.price // Masukkan angka mentah (integer)
    });

    row.eachCell((cell) => {
      cell.style = borderStyle;
      
      // Format Rupiah di Kolom D (Index 4)
      if (cell.column === 4) {
        cell.numFmt = '"Rp"#,##0'; // Format: Rp 10.000 (otomatis)
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Data_Pengiriman_${today.toISOString().split('T')[0]}.xlsx`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Excel berhasil didownload', 'success');
};

// 2. Import Excel (Process File) dengan ExcelJS
const handleFileSelect = async (e) => {
  const files = e.target.files;
  if (!files.length) return;
  
  const file = files[0];
  // Cek ekstensi
  const validExts = [".xlsx", ".xls"];
  const fileExt = file.name.substring(file.name.lastIndexOf('.'));
  if (!validExts.includes(fileExt)) {
    return showToast('Format harus Excel (.xlsx)', 'error');
  }

  excelFile.value = file;
  parsedExcelData.value = [];
  validationErrors.value = [];

  try {
    // Baca file dengan ExcelJS
    const workbook = new ExcelJS.Workbook();
    const arrayBuffer = await file.arrayBuffer();
    await workbook.xlsx.load(arrayBuffer);
    
    // Ambil worksheet pertama
    const worksheet = workbook.getWorksheet(1);
    
    if (!worksheet) {
      return showToast('File Excel tidak memiliki worksheet', 'error');
    }
    
    // List No Pengiriman yang sudah ada di DB (untuk cek unik)
    const existingNos = shippings.value.map(s => s.shippingNo);
    const today = new Date();
    today.setHours(0,0,0,0);

    const validRows = [];
    const errors = [];
    
    // Ambil header baris pertama
    const headerRow = worksheet.getRow(1);
    const headers = [];
    
    // Perbaikan: Gunakan eachCell dengan benar
    headerRow.eachCell((cell, colNumber) => {
      // ExcelJS colNumber dimulai dari 1, jadi kita push ke array
      headers.push(cell.value ? cell.value.toString().toLowerCase().trim() : '');
    });
    
    // Cari indeks kolom yang dibutuhkan
    const findColumnIndex = (possibleNames) => {
      for (const name of possibleNames) {
        // Perbaikan: Pastikan headers tidak undefined dan gunakan findIndex dengan benar
        const index = headers.findIndex(h => h && h.includes(name));
        if (index !== -1) return index;
      }
      return -1;
    };
    
    const noColIndex = findColumnIndex(["no. pengiriman", "no pengiriman", "nomor pengiriman"]);
    const dateColIndex = findColumnIndex(["tanggal pengiriman", "tanggal"]);
    const nameColIndex = findColumnIndex(["nama pengiriman", "nama"]);
    const priceColIndex = findColumnIndex(["harga pengiriman", "harga"]);
    
    // Proses setiap baris data (dimulai dari baris ke-2)
    worksheet.eachRow((row, rowNumber) => {
      // Skip header row
      if (rowNumber === 1) return;
      
      // Perbaikan: Ambil nilai dari setiap kolom dengan benar
      // ExcelJS row.getCell dimulai dari 1, bukan 0
      const rawNo = noColIndex !== -1 ? (row.getCell(noColIndex + 1).value || "") : "";
      const rawDate = dateColIndex !== -1 ? (row.getCell(dateColIndex + 1).value || "") : "";
      const rawName = nameColIndex !== -1 ? (row.getCell(nameColIndex + 1).value || "") : "";
      const rawPrice = priceColIndex !== -1 ? (row.getCell(priceColIndex + 1).value || "") : "";
      
      // Validasi
      let errorMsg = "";
      let validDate = "";
      let validPrice = 0;
      
      // 1. Validasi Nama
      if (!rawName) {
        errorMsg = `Baris ${rowNumber}: Nama kosong`;
      }
      
      // 2. Parse Harga
      if (!errorMsg) {
        if (typeof rawPrice === 'string') {
          // Hapus titik ribuan Indonesia (95.000 -> 95000)
          const cleanPrice = rawPrice.replace(/\./g, ''); 
          validPrice = parseInt(cleanPrice) || 0;
        } else if (typeof rawPrice === 'number') {
          validPrice = rawPrice;
        }
        
        if (!validPrice || validPrice <= 0) {
          errorMsg = `Baris ${rowNumber}: Harga tidak valid`;
        }
      }
      
      // 3. Validasi Tanggal
      if (!errorMsg) {
        let dateObj;
        
        if (typeof rawDate === 'number') {
          // Jika rawDate adalah angka serial Excel
          dateObj = new Date((rawDate - 25569) * 86400 * 1000);
        } else if (typeof rawDate === 'string') {
          // Coba parse string DD-MM-YYYY atau YYYY-MM-DD
          const parts = rawDate.includes('/') ? rawDate.split('/') : rawDate.split('-');
          if (parts.length === 3) {
            // Cek format DD-MM-YYYY atau YYYY-MM-DD
            if (parts[0].length === 4) { // YYYY-MM-DD
              dateObj = new Date(rawDate);
            } else { // DD-MM-YYYY (Assume)
              dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
          } else {
            dateObj = new Date(rawDate);
          }
        }
        
        if (isNaN(dateObj.getTime())) {
          errorMsg = `Baris ${rowNumber}: Format tanggal salah`;
        } else {
          validDate = dateObj.toISOString().split('T')[0]; // Convert back to YYYY-MM-DD
          // Cek Tanggal > Hari Ini
          if (dateObj > today) {
            errorMsg = `Baris ${rowNumber}: Tanggal tidak boleh > hari ini`;
          }
        }
      }
      
      // 4. Validasi Unik
      if (!errorMsg && existingNos.includes(rawNo)) {
        errorMsg = `Baris ${rowNumber}: No. Pengiriman '${rawNo}' sudah ada`;
      }
      
      // Push Result
      if (errorMsg) {
        errors.push(errorMsg);
      } else {
        validRows.push({
          shippingNo: rawNo || "", // Backend akan auto-generate jika kosong
          date: validDate,
          name: rawName,
          price: validPrice
        });
      }
    });

    parsedExcelData.value = validRows;
    validationErrors.value = errors;
    
    if (validRows.length === 0 && errors.length === 0) {
      showToast('File Excel kosong', 'error');
    }
    
  } catch (err) {
    console.error(err);
    showToast('Gagal membaca file Excel', 'error');
  }
};

// 3. Kirim Data Excel ke Backend
const handleExcelUpload = () => {
  if (parsedExcelData.value.length === 0) return showToast('Tidak ada data valid untuk diupload', 'error');
  
  if (validationErrors.value.length > 0) {
    showToast(`${validationErrors.value.length} data dilewati karena error. Lanjutkan upload data valid.`, 'warning');
  } else {
    showToast(`Mulai upload ${parsedExcelData.value.length} data...`, 'info');
  }

  presenter.uploadCsv(parsedExcelData.value);
  closeModal();
};

// --- HARGA INPUT LOGIC (Manual Input) ---
const formattedPrice = ref('');

const handleInputPrice = (e) => {
  const rawValue = e.target.value.replace(/\D/g, ''); // Ambil angka saja
  if (rawValue === '') {
    formattedPrice.value = '';
    form.price = 0;
  } else {
    const numVal = parseInt(rawValue, 10);
    formattedPrice.value = numVal.toLocaleString('id-ID');
    form.price = numVal; 
  }
};

onMounted(() => {
  presenter.loadShippings();
});
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>