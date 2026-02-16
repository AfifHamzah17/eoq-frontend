<template>
  <div class="max-w-4xl mx-auto space-y-8 animate-fade-in-float">
    
    <!-- SECTION 1: PROFIL SAYA -->
    <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h3 class="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Profil Saya</h3>
      
      <div class="flex items-start gap-6 mb-8">
        <!-- Avatar Image -->
        <div class="relative group">
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*"
            class="hidden"
            @change="handleAvatarUpload"
          />
          <div class="relative" @click="$refs.fileInput.click()">
            <div v-if="isUploading" class="absolute inset-0 bg-white bg-opacity-80 rounded-full flex items-center justify-center z-10 cursor-wait">
              <i class="fa-solid fa-circle-notch fa-spin text-blue-600 text-2xl"></i>
            </div>
            <img 
              v-if="user?.avatarUrl" 
              :src="user.avatarUrl" 
              class="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-sm cursor-pointer hover:opacity-90 transition"
              alt="Profile"
            />
            <div 
              v-else 
              class="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl text-blue-600 font-bold border-4 border-blue-100 cursor-pointer hover:bg-blue-200 transition"
            >
              {{ user?.name ? user.name.charAt(0).toUpperCase() : '?' }}
            </div>
            <div class="absolute inset-0 rounded-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
              <i class="fa-solid fa-camera text-white text-xl"></i>
            </div>
          </div>
        </div>

        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-800">{{ user?.name }}</h2>
          <p class="text-gray-500 mb-1">{{ user?.role === 'admin' ? 'Administrator' : 'Karyawan' }}</p>
          <div class="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded inline-block">
            @{{ user?.username }} / {{ user?.email }}
          </div>
        </div>
      </div>

      <!-- FORM GANTI PASSWORD SENDIRI -->
      <form @submit.prevent="handleMyPasswordChange" class="space-y-5 max-w-lg">
        
        <!-- 1. Password Lama -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
          <input 
            v-model="myPassForm.current" 
            :type="showMyPasswords.current ? 'text' : 'password'" 
            placeholder="Masukkan password saat ini" 
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10" 
            required 
          />
          <button 
            type="button" 
            @click="showMyPasswords.current = !showMyPasswords.current" 
            class="absolute right-3 top-[38px] text-gray-500 hover:text-blue-600 focus:outline-none"
          >
            <i :class="showMyPasswords.current ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
        </div>

        <!-- 2. Password Baru -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
          <input 
            v-model="myPassForm.new" 
            :type="showMyPasswords.new ? 'text' : 'password'" 
            placeholder="Masukkan password baru" 
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10" 
            required 
          />
          <button 
            type="button" 
            @click="showMyPasswords.new = !showMyPasswords.new" 
            class="absolute right-3 top-[38px] text-gray-500 hover:text-blue-600 focus:outline-none"
          >
            <i :class="showMyPasswords.new ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
        </div>

        <!-- 3. Ulangi Password Baru -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">Ulangi Password Baru <span class="text-red-500">*</span></label>
          <input 
            v-model="myPassForm.confirm" 
            :type="showMyPasswords.confirm ? 'text' : 'password'" 
            placeholder="Ulangi password baru" 
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10" 
            :class="{'border-red-500': myPassForm.new && myPassForm.new !== myPassForm.confirm}"
            required 
          />
          <button 
            type="button" 
            @click="showMyPasswords.confirm = !showMyPasswords.confirm" 
            class="absolute right-3 top-[38px] text-gray-500 hover:text-blue-600 focus:outline-none"
          >
            <i :class="showMyPasswords.confirm ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
          <div v-if="myPassForm.new && myPassForm.new !== myPassForm.confirm" class="text-xs text-red-500 mt-1">
            Password tidak cocok!
          </div>
        </div>

        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
          <i class="fa-solid fa-key mr-2"></i> Update Password
        </button>
      </form>
    </div>

    <!-- SECTION 2: MANAJEMEN USER (Admin) -->
    <div v-if="user?.role === 'admin'" class="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h3 class="text-xl font-bold text-gray-800 mb-6 border-b pb-2 flex justify-between items-center">
        <span>Daftar Pengguna</span>
        <span class="text-xs font-normal text-gray-500 bg-blue-50 text-blue-700 px-2 py-1 rounded">Admin Only</span>
      </h3>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left border-collapse">
          <thead class="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th class="px-4 py-3">Nama</th>
              <th class="px-4 py-3">Username</th>
              <th class="px-4 py-3">Email</th>
              <th class="px-4 py-3">Role</th>
              <th class="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="users.length === 0">
              <td colspan="5" class="text-center py-4 text-gray-500">Memuat data...</td>
            </tr>
            <tr v-for="u in users" :key="u.id" class="border-b hover:bg-gray-50">
              <td class="px-4 py-3 font-medium">{{ u.name }}</td>
              <td class="px-4 py-3 text-gray-600">@{{ u.username }}</td>
              <td class="px-4 py-3 text-gray-600">{{ u.email }}</td>
              <td class="px-4 py-3">
                <span :class="u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'" class="px-2 py-1 rounded text-xs font-bold">
                  {{ u.role }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <button 
                  @click="openResetModal(u)" 
                  :disabled="u.role === 'admin' && u.username === props.user?.username ? true : false" 
                  class="text-yellow-600 hover:text-yellow-700 bg-yellow-50 hover:bg-yellow-100 p-2 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Reset Password"
                >
                  <i class="fa-solid fa-key"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL RESET PASSWORD (ADMIN) -->
    <div v-if="isResetModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-md p-6 m-4 shadow-2xl animate-fade-in">
        <h3 class="text-lg font-bold text-gray-800 mb-4">Reset Password User</h3>
        
        <div class="mb-4">
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Target User</label>
          <input type="text" :value="resetForm.targetName" disabled class="w-full p-2 bg-gray-100 border rounded text-gray-500 cursor-not-allowed">
        </div>

        <div class="mb-6 relative">
          <label class="block text-sm font-medium text-gray-700 mb-1">Password Baru <span class="text-red-500">*</span></label>
          <input 
            v-model="resetForm.newPassword" 
            :type="showResetPassword ? 'text' : 'password'" 
            placeholder="Password baru untuk user ini" 
            class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10" 
            required 
          />
          <button 
            type="button" 
            @click="showResetPassword = !showResetPassword" 
            class="absolute right-3 top-[38px] text-gray-500 hover:text-blue-600 focus:outline-none"
          >
            <i :class="showResetPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
        </div>

        <div class="flex justify-end gap-2">
          <button type="button" @click="isResetModalOpen = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Batal</button>
          <button @click="handleAdminReset" class="px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 rounded font-medium">Reset Password</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps } from 'vue';
import axios from 'axios';
import { showToast } from '../../utils/toastify';
import Storage from '../../utils/storage';

const props = defineProps({
  user: Object
});

// --- STATE FORMS ---
const myPassForm = reactive({
  current: '',
  new: '',
  confirm: ''
});

const showMyPasswords = reactive({
  current: false,
  new: false,
  confirm: false
});

const resetForm = reactive({
  targetName: '',
  targetUsername: '',
  targetUserId: '',
  newPassword: '',
  isAdmin: false
});

const users = ref([]);
const isResetModalOpen = ref(false);
const showResetPassword = ref(false);
const API_URL = 'http://localhost:3000/api';

// --- FUNGSI 1: GANTI PASSWORD SENDIRI ---
const handleMyPasswordChange = async () => {
  if (!myPassForm.current || !myPassForm.new || !myPassForm.confirm) {
    showToast('Isi semua kolom password', 'error');
    return;
  }

  if (myPassForm.new !== myPassForm.confirm) {
    showToast('Password baru tidak sama dengan ulangi password!', 'error');
    return;
  }

  try {
    const token = Storage.getToken();
    if (!token) { showToast('Sesi habis', 'error'); return; }

    await axios.post(`${API_URL}/auth/change-password`, {
      currentPassword: myPassForm.current,
      newPassword: myPassForm.new
    }, { headers: { Authorization: `Bearer ${token}` } });

    showToast('Password berhasil diperbarui', 'success');
    
    myPassForm.current = '';
    myPassForm.new = '';
    myPassForm.confirm = '';
    
    showMyPasswords.current = false;
    showMyPasswords.new = false;
    showMyPasswords.confirm = false;
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    showToast(msg, 'error');
  }
};

// --- FUNGSI 2: AMBIL USERS ---
const fetchUsers = async () => {
  if (props.user?.role !== 'admin') return;

  try {
    const token = Storage.getToken();
    if (!token) return;

    const response = await axios.get(`${API_URL}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    users.value = response.data.data;
  } catch (error) {
    console.error("Gagal ambil users", error);
  }
};

// --- FUNGSI 3: UPLOAD AVATAR ---
const fileInput = ref(null);
const isUploading = ref(false);

const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 1024 * 1024) {
    showToast('Ukuran file maksimal 1MB', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('avatar', file);

  isUploading.value = true;
  try {
    const token = Storage.getToken();
    const response = await axios.post(`${API_URL}/upload/profile`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const newAvatarUrl = response.data.data.avatarUrl;

    const currentUser = Storage.getUser();
    currentUser.avatarUrl = newAvatarUrl;
    Storage.setUser(currentUser);

    window.dispatchEvent(new CustomEvent('user-updated'));

    showToast('Foto profil berhasil diperbarui', 'success');
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    showToast(msg, 'error');
  } finally {
    isUploading.value = false;
    event.target.value = null;
  }
};

// --- FUNGSI 4: OPEN MODAL RESET (DIPERBAIKI) ---
const openResetModal = (userData) => {
  const targetIsAdmin = userData.role === 'admin';

  resetForm.targetName = userData.name;
  resetForm.targetUsername = userData.username;
  
  // PERBAIKAN: Ambil ID dari 'id' atau '_id', jangan 'userId'
  // Karena UserModel toJSON mengubah _id menjadi id
  resetForm.targetUserId = userData.id || userData._id; 
  
  resetForm.newPassword = '';
  resetForm.isAdmin = targetIsAdmin;
  showResetPassword.value = false; 
  isResetModalOpen.value = true;
};

// --- FUNGSI 5: SUBMIT RESET ---
const handleAdminReset = async () => {
  if (!resetForm.newPassword) {
    showToast('Password Baru wajib diisi', 'error');
    return;
  }

  // Validasi tambahan jika ID masih belum kebaca (defensive coding)
  if (!resetForm.targetUserId) {
    showToast('Error: ID User tidak terdeteksi. Coba refresh halaman.', 'error');
    console.error('Data user yang diklik tidak memiliki ID:', resetForm);
    return;
  }

  try {
    const token = Storage.getToken();
    if (!token) { showToast('Sesi habis', 'error'); return; }

    await axios.post(`${API_URL}/auth/users/reset-password`, {
      iduser: resetForm.targetUserId,
      newPassword: resetForm.newPassword
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    showToast(`Password ${resetForm.targetName} berhasil direset`, 'success');
    isResetModalOpen.value = false;
    fetchUsers(); 
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    showToast(msg, 'error');
  }
};

onMounted(() => {
  fetchUsers();
});
</script>