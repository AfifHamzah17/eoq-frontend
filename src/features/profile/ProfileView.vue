<!-- src/features/profile/ProfileView.vue -->
<template>
  <div class="max-w-3xl mx-auto space-y-6 animate-fade-in-float">

    <!-- ==================== CARD: PROFIL HEADER ==================== -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

      <!-- Banner -->
      <div class="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
        <!-- Decorative circles -->
        <div class="absolute top-4 right-12 w-20 h-20 rounded-full bg-white/10"></div>
        <div class="absolute bottom-2 right-32 w-10 h-10 rounded-full bg-white/10"></div>
        <div class="absolute top-8 left-20 w-14 h-14 rounded-full bg-white/5"></div>
      </div>

      <!-- Profile Info Area -->
      <div class="px-8 pb-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-14 relative z-10">

          <!-- Avatar -->
          <div class="relative group shrink-0">
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="openCropper"
            />
            <div class="relative cursor-pointer" @click="!isEditing ? $refs.fileInput.click() : null">
              <!-- Uploading overlay -->
              <div v-if="isUploading" class="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center z-20 cursor-wait">
                <i class="fa-solid fa-circle-notch fa-spin text-blue-600 text-2xl"></i>
              </div>
              <img
                v-if="userAvatar"
                :src="userAvatar"
                class="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                :class="{ 'opacity-90': !isEditing }"
              />
              <div
                v-else
                class="w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-4xl text-blue-600 font-bold border-4 border-white shadow-lg"
                :class="{ 'opacity-90': !isEditing }"
              >
                {{ userInitials }}
              </div>
              <!-- Hover camera icon (only in view mode) -->
              <div
                v-if="!isEditing"
                class="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                <i class="fa-solid fa-camera text-white text-2xl"></i>
              </div>
            </div>
          </div>

          <!-- Name + Meta -->
          <div class="flex-1 min-w-0 pt-2 sm:pb-1">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h1 class="text-2xl font-bold text-gray-900 leading-tight">{{ user?.name }}</h1>
                <p class="text-sm text-gray-500 mt-0.5">@{{ user?.username }}</p>
              </div>
              <!-- Edit Button -->
              <button
                v-if="!isEditing"
                @click="startEditing"
                class="shrink-0 px-4 py-2 text-sm font-semibold text-blue-700 border-2 border-blue-700 rounded-full hover:bg-blue-50 transition flex items-center gap-2"
              >
                <i class="fa-solid fa-pen-to-square text-xs"></i> Edit Profil
              </button>
            </div>

            <!-- Badges -->
            <div class="flex items-center gap-2 mt-3 flex-wrap">
              <span
                :class="user?.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'"
                class="text-xs font-bold px-3 py-1 rounded-full uppercase border"
              >
                {{ user?.role === 'admin' ? 'Administrator' : 'Karyawan' }}
              </span>
              <span class="bg-gray-50 text-gray-600 text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
                <i class="fa-solid fa-building mr-1"></i>{{ user?.namaCabang || '-' }}
              </span>
            </div>
          </div>
        </div>

        <!-- ==================== VIEW MODE ==================== -->
        <div v-if="!isEditing" class="mt-6 pt-6 border-t border-gray-100">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

            <!-- Email -->
            <div class="flex items-start gap-3 group">
              <div class="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center text-red-500 mt-0.5 shrink-0 border border-red-100">
                <i class="fa-solid fa-envelope text-sm"></i>
              </div>
              <div>
                <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Email</p>
                <a :href="`mailto:${user?.email}`" class="text-sm text-gray-800 hover:text-blue-600 transition font-medium">{{ user?.email || '-' }}</a>
              </div>
            </div>

            <!-- No HP -->
            <div class="flex items-start gap-3 group">
              <div class="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center text-green-500 mt-0.5 shrink-0 border border-green-100">
                <i class="fa-solid fa-phone text-sm"></i>
              </div>
              <div>
                <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">No. HP</p>
                <a v-if="user?.noHp" :href="generateWaLink(user.noHp)" target="_blank" class="text-sm text-gray-800 hover:text-green-600 transition font-medium">
                  {{ formatPhoneDisplay(user.noHp) }}
                </a>
                <p v-else class="text-sm text-gray-400 italic">Belum diisi</p>
              </div>
            </div>

            <!-- Cabang -->
            <div class="flex items-start gap-3 group">
              <div class="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500 mt-0.5 shrink-0 border border-indigo-100">
                <i class="fa-solid fa-store text-sm"></i>
              </div>
              <div>
                <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Cabang</p>
                <p class="text-sm text-gray-800 font-medium">{{ user?.namaCabang || '-' }}</p>
              </div>
            </div>

            <!-- Bergabung -->
            <div class="flex items-start gap-3 group">
              <div class="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500 mt-0.5 shrink-0 border border-amber-100">
                <i class="fa-solid fa-calendar-check text-sm"></i>
              </div>
              <div>
                <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Bergabung</p>
                <p class="text-sm text-gray-800 font-medium">{{ formatDate(user?.createdAt) }}</p>
              </div>
            </div>

          </div>
        </div>

        <!-- ==================== EDIT MODE ==================== -->
        <div v-else class="mt-6 pt-6 border-t border-gray-100">
          <form @submit.prevent="handleSaveProfile" class="space-y-5">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

              <!-- Nama -->
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                <div class="relative">
                  <i class="fa-solid fa-id-card absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <input
                    v-model="editForm.name"
                    type="text"
                    class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                <div class="relative">
                  <i class="fa-solid fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <input
                    v-model="editForm.email"
                    type="email"
                    class="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    :class="emailError ? 'border-red-400 bg-red-50' : 'border-gray-300'"
                    placeholder="contoh@email.com"
                    required
                  />
                </div>
                <p v-if="emailError" class="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-circle-exclamation text-[10px]"></i> {{ emailError }}
                </p>
              </div>

              <!-- No HP -->
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">No. HP</label>
                <div class="relative">
                  <i class="fa-solid fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <input
                    v-model="editForm.noHp"
                    type="tel"
                    inputmode="numeric"
                    class="w-full pl-10 pr-16 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    :class="noHpError ? 'border-red-400 bg-red-50' : 'border-gray-300'"
                    placeholder="08123456789"
                    @input="onNoHpInput"
                    required
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none font-medium">
                    {{ editForm.noHp.length }}/14
                  </span>
                </div>
                <p v-if="noHpError" class="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-circle-exclamation text-[10px]"></i> {{ noHpError }}
                </p>
              </div>

              <!-- Cabang -->
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Cabang</label>
                <div class="relative">
                  <i class="fa-solid fa-store absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <select
                    v-model="editForm.namaCabang"
                    class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition"
                    required
                  >
                    <option disabled value="">Pilih Cabang</option>
                    <option v-for="store in storeList" :key="store" :value="store">{{ store }}</option>
                  </select>
                  <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                </div>
              </div>

            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-3 pt-3 border-t border-gray-100">
              <button
                type="submit"
                :disabled="isSaving"
                class="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
              >
                <i v-if="isSaving" class="fa-solid fa-spinner fa-spin text-xs"></i>
                <i v-else class="fa-solid fa-check text-xs"></i>
                {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
              <button
                type="button"
                @click="cancelEditing"
                :disabled="isSaving"
                class="px-6 py-2.5 bg-white text-gray-600 text-sm font-semibold rounded-full border-2 border-gray-300 hover:bg-gray-50 transition disabled:opacity-60"
              >
                Batal
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>

    <!-- ==================== CARD: GANTI PASSWORD ==================== -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 border border-amber-100">
            <i class="fa-solid fa-shield-halved text-sm"></i>
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-800">Keamanan Akun</h3>
            <p class="text-xs text-gray-400">Ubah password untuk menjaga keamanan</p>
          </div>
        </div>
      </div>

      <div class="px-8 py-6">
        <form @submit.prevent="handleMyPasswordChange" class="space-y-4 max-w-lg">
          <div class="relative">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password Lama</label>
            <div class="relative">
              <i class="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                v-model="myPassForm.current"
                :type="showMyPasswords.current ? 'text' : 'password'"
                placeholder="Masukkan password saat ini"
                class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                required
              />
              <button type="button" @click="showMyPasswords.current = !showMyPasswords.current" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition">
                <i :class="showMyPasswords.current ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="relative">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password Baru</label>
            <div class="relative">
              <i class="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                v-model="myPassForm.new"
                :type="showMyPasswords.new ? 'text' : 'password'"
                placeholder="Min 8 karakter, 1 huruf besar, 1 angka"
                class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                required
              />
              <button type="button" @click="showMyPasswords.new = !showMyPasswords.new" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition">
                <i :class="showMyPasswords.new ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
            <!-- Password strength indicator -->
            <div v-if="myPassForm.new" class="flex gap-1 mt-2">
              <div class="h-1 flex-1 rounded-full transition-colors duration-300" :class="passStrength >= 1 ? 'bg-red-500' : 'bg-gray-200'"></div>
              <div class="h-1 flex-1 rounded-full transition-colors duration-300" :class="passStrength >= 2 ? 'bg-orange-500' : 'bg-gray-200'"></div>
              <div class="h-1 flex-1 rounded-full transition-colors duration-300" :class="passStrength >= 3 ? 'bg-green-500' : 'bg-gray-200'"></div>
            </div>
            <p v-if="myPassForm.new && passStrength < 3" class="text-[11px] text-orange-500 mt-1">
              <i class="fa-solid fa-circle-info mr-1"></i>Butuh: min 8 char, 1 huruf besar, 1 angka/simbol
            </p>
          </div>

          <div class="relative">
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Ulangi Password Baru</label>
            <div class="relative">
              <i class="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                v-model="myPassForm.confirm"
                :type="showMyPasswords.confirm ? 'text' : 'password'"
                placeholder="Ulangi password baru"
                class="w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                :class="myPassForm.new && myPassForm.confirm && myPassForm.new !== myPassForm.confirm ? 'border-red-400 bg-red-50' : 'border-gray-300'"
                required
              />
              <button type="button" @click="showMyPasswords.confirm = !showMyPasswords.confirm" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition">
                <i :class="showMyPasswords.confirm ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
            <p v-if="myPassForm.new && myPassForm.confirm && myPassForm.new !== myPassForm.confirm" class="text-xs text-red-500 mt-1 flex items-center gap-1">
              <i class="fa-solid fa-circle-exclamation text-[10px]"></i> Password tidak cocok
            </p>
          </div>

          <button
            type="submit"
            :disabled="isChangingPass"
            class="mt-2 px-5 py-2.5 bg-amber-600 text-white text-sm font-semibold rounded-full hover:bg-amber-700 transition disabled:opacity-60 flex items-center gap-2 shadow-sm"
          >
            <i v-if="isChangingPass" class="fa-solid fa-spinner fa-spin text-xs"></i>
            <i v-else class="fa-solid fa-key text-xs"></i>
            {{ isChangingPass ? 'Mengubah...' : 'Update Password' }}
          </button>
        </form>
      </div>
    </div>

    <!-- ==================== MODAL: CROP AVATAR ==================== -->
    <Teleport to="#modal-portal">
      <Transition name="modal">
        <div v-if="showCropper" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div @click="closeCropper" class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div class="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl z-10 pointer-events-auto overflow-hidden">
            <div class="px-5 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 class="font-bold text-gray-800 text-sm"><i class="fa-solid fa-crop-simple mr-2 text-blue-500"></i>Potong Foto Profil</h3>
              <button @click="closeCropper" class="text-gray-400 hover:text-red-500 transition">
                <i class="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <div class="p-4 bg-gray-100" style="height: 340px;">
              <Cropper
                ref="cropper"
                :src="imageToCrop"
                :stencil-props="{ aspectRatio: 1 }"
                class="w-full h-full"
                image-restriction="stencil"
              />
            </div>
            <div class="px-5 py-4 border-t flex justify-end gap-3 bg-white">
              <button @click="closeCropper" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition">Batal</button>
              <button @click="saveCroppedImage" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition flex items-center gap-2">
                <i class="fa-solid fa-check text-xs"></i> Simpan
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import api from '../../utils/api';
import { showToast } from '../../utils/toastify';
import { useUserStore } from '../../composables/useUserStore';
import { STORE_LIST } from '../auth/AuthModel';

// ==================== STORE ====================
const {
  user,
  isLoading,
  userAvatar,
  userInitials,
  fetchCurrentUser,
  updateUser
} = useUserStore();

const storeList = STORE_LIST;

// ==================== EDIT MODE STATE ====================
const isEditing = ref(false);
const isSaving = ref(false);
const editForm = reactive({
  name: '',
  email: '',
  noHp: '',
  namaCabang: ''
});

// Validation errors
const emailError = ref('');
const noHpError = ref('');

// ==================== PASSWORD STATE ====================
const myPassForm = reactive({ current: '', new: '', confirm: '' });
const showMyPasswords = reactive({ current: false, new: false, confirm: false });
const isChangingPass = ref(false);

// Password strength (0-3)
const passStrength = computed(() => {
  const p = myPassForm.new;
  if (!p) return 0;
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[\d!@#$%^&*]/.test(p)) score++;
  return score;
});

// ==================== CROPPER STATE ====================
const fileInput = ref(null);
const isUploading = ref(false);
const showCropper = ref(false);
const imageToCrop = ref(null);
const cropper = ref(null);

// ==================== MOUNT ====================
onMounted(async () => {
  await fetchCurrentUser();
});

// ==================== EDIT PROFILE LOGIC ====================
const startEditing = () => {
  if (!user.value) return;
  // Pre-fill form dengan data saat ini
  editForm.name = user.value.name || '';
  editForm.email = user.value.email || '';
  editForm.noHp = user.value.noHp || '';
  editForm.namaCabang = user.value.namaCabang || '';
  emailError.value = '';
  noHpError.value = '';
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
  emailError.value = '';
  noHpError.value = '';
};

const onNoHpInput = (e) => {
  const raw = e.target.value.replace(/[^0-9]/g, '');
  editForm.noHp = raw.substring(0, 14);
  noHpError.value = '';
};

const validateEditForm = () => {
  let valid = true;
  emailError.value = '';
  noHpError.value = '';

  // Email
  if (!editForm.email || !/\S+@\S+\.\S+/.test(editForm.email)) {
    emailError.value = 'Format email tidak valid';
    valid = false;
  }

  // No HP
  if (!editForm.noHp) {
    noHpError.value = 'No. HP wajib diisi';
    valid = false;
  } else if (!editForm.noHp.startsWith('0')) {
    noHpError.value = 'Harus diawali angka 0';
    valid = false;
  } else if (editForm.noHp.length < 10) {
    noHpError.value = 'Minimal 10 digit';
    valid = false;
  }

  return valid;
};

const handleSaveProfile = async () => {
  if (!validateEditForm()) return;

  isSaving.value = true;
  try {
    const response = await api.put('/auth/me', {
      name: editForm.name,
      email: editForm.email,
      noHp: editForm.noHp,
      namaCabang: editForm.namaCabang
    });

    // Update store + sidebar
    updateUser(response.data.data);
    isEditing.value = false;
    showToast(response.data.message || 'Profil berhasil diperbarui', 'success');
  } catch (error) {
    const msg = error.response?.data?.message || 'Gagal memperbarui profil';

    // Set specific error
    if (msg.toLowerCase().includes('email')) {
      emailError.value = msg;
    } else if (msg.toLowerCase().includes('hp') || msg.toLowerCase().includes('nomor')) {
      noHpError.value = msg;
    } else {
      showToast(msg, 'error');
    }
  } finally {
    isSaving.value = false;
  }
};

// ==================== PASSWORD LOGIC ====================
const handleMyPasswordChange = async () => {
  if (!myPassForm.current || !myPassForm.new || !myPassForm.confirm) {
    return showToast('Isi semua kolom password', 'error');
  }
  if (myPassForm.new !== myPassForm.confirm) {
    return showToast('Password baru tidak cocok!', 'error');
  }
  if (passStrength.value < 3) {
    return showToast('Password baru tidak cukup kuat!', 'error');
  }

  isChangingPass.value = true;
  try {
    await api.post('/auth/change-password', {
      currentPassword: myPassForm.current,
      newPassword: myPassForm.new
    });
    showToast('Password berhasil diperbarui', 'success');
    myPassForm.current = '';
    myPassForm.new = '';
    myPassForm.confirm = '';
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal update password', 'error');
  } finally {
    isChangingPass.value = false;
  }
};

// ==================== AVATAR CROP & UPLOAD ====================
const openCropper = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
    return showToast('Format harus JPG/PNG', 'error');
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    imageToCrop.value = e.target.result;
    showCropper.value = true;
  };
  reader.readAsDataURL(file);
};

const closeCropper = () => {
  showCropper.value = false;
  imageToCrop.value = null;
  if (fileInput.value) fileInput.value.value = null;
};

const saveCroppedImage = async () => {
  if (!cropper.value) return;
  const { canvas } = cropper.value.getResult();

  canvas.toBlob(async (blob) => {
    if (!blob) return showToast('Gagal memotong gambar', 'error');
    const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('avatar', file);

    isUploading.value = true;
    showCropper.value = false;

    try {
      const response = await api.post('/upload/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newAvatarUrl = response.data.data.avatarUrl;
      updateUser({ avatarUrl: newAvatarUrl });
      showToast('Foto profil berhasil diperbarui', 'success');
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || 'Gagal upload foto', 'error');
    } finally {
      isUploading.value = false;
      if (fileInput.value) fileInput.value.value = null;
    }
  }, 'image/jpeg', 0.9);
};

// ==================== UTILS ====================
const formatPhoneDisplay = (val) => {
  if (!val) return '';
  let num = val.replace(/\D/g, '');
  if (num.length > 14) num = num.substring(0, 14);
  if (num.length > 4) num = num.substring(0, 4) + '-' + num.substring(4);
  if (num.length > 9) num = num.substring(0, 9) + '-' + num.substring(9);
  return num;
};

const generateWaLink = (val) => {
  if (!val) return '#';
  let num = val.replace(/\D/g, '');
  if (num.length < 10) return '#';
  if (num.startsWith('0')) num = '62' + num.substring(1);
  return `https://wa.me/${num}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>