<template>
  <div class="max-w-3xl mx-auto space-y-6 animate-fade-in-float">

    <!-- ==================== CARD: PROFIL ==================== -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

      <!-- Banner tipis dengan mesh gradient subtle -->
      <div class="h-28 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"></div>
        <!-- Pattern overlay -->
        <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px); background-size: 40px 40px;"></div>
        <div class="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-blue-500/20 blur-2xl"></div>
        <div class="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-indigo-500/20 blur-2xl"></div>
      </div>

      <!-- Content area — putih bersih, terpisah jelas dari banner -->
      <div class="px-8 pb-8">

        <!-- Avatar menumpuk banner -->
        <div class="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-14 relative z-10 mb-6">

          <!-- Avatar -->
          <div class="relative group shrink-0">
            <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="openCropper" />
            <div class="relative cursor-pointer" @click="!isEditing ? $refs.fileInput.click() : null">
              <div v-if="isUploading" class="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center z-20 cursor-wait">
                <i class="fa-solid fa-circle-notch fa-spin text-blue-600 text-2xl"></i>
              </div>
              <!-- Ring luar putih tebal sebagai pemisah -->
              <div class="w-[112px] h-[112px] rounded-2xl bg-white p-1 shadow-lg">
                <img
                  v-if="userAvatar"
                  :src="userAvatar"
                  class="w-full h-full rounded-xl object-cover"
                />
                <div
                  v-else
                  class="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl text-white font-bold"
                >
                  {{ userInitials }}
                </div>
              </div>
              <!-- Camera overlay -->
              <div
                v-if="!isEditing"
                class="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 p-1"
              >
                <div class="w-full h-full rounded-xl bg-black/20 flex items-center justify-center">
                  <i class="fa-solid fa-camera text-white text-xl drop-shadow-lg"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Nama + meta — di atas putih bersih -->
          <div class="flex-1 min-w-0 pb-1">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <h1 class="text-2xl font-extrabold text-gray-900 leading-tight truncate">{{ user?.name }}</h1>
                <p class="text-sm text-gray-500 mt-0.5 font-medium">@{{ user?.username }}</p>
              </div>
              <button
                v-if="!isEditing"
                @click="startEditing"
                class="shrink-0 px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 border border-gray-200"
              >
                <i class="fa-solid fa-pen text-[10px]"></i> Edit
              </button>
            </div>

            <!-- Badges -->
            <div class="flex items-center gap-2 mt-3 flex-wrap">
              <span
                :class="user?.role === 'admin' ? 'bg-violet-50 text-violet-700 border-violet-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'"
                class="text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border"
              >
                {{ user?.role === 'admin' ? 'Administrator' : 'Petugas Cabang' }}
              </span>
              <span class="bg-slate-50 text-slate-600 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-slate-200">
                <i class="fa-solid fa-store mr-1 text-slate-400"></i>{{ user?.namaCabang || '-' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Divider tipis -->
        <div class="h-px bg-gray-100 mb-6"></div>

        <!-- ==================== VIEW MODE ==================== -->
        <div v-if="!isEditing" class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <!-- Email -->
          <div class="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-gray-50 transition group">
            <div class="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 shrink-0 border border-rose-100 group-hover:scale-105 transition-transform">
              <i class="fa-solid fa-envelope text-sm"></i>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</p>
              <a :href="`mailto:${user?.email}`" class="text-sm text-gray-800 hover:text-blue-600 transition font-semibold truncate block">{{ user?.email || '-' }}</a>
            </div>
          </div>

          <!-- No HP -->
          <div class="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-gray-50 transition group">
            <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-100 group-hover:scale-105 transition-transform">
              <i class="fa-brands fa-whatsapp text-lg"></i>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No. HP</p>
              <a v-if="user?.noHp" :href="generateWaLink(user.noHp)" target="_blank" class="text-sm text-gray-800 hover:text-emerald-600 transition font-semibold truncate block">
                {{ formatPhoneDisplay(user.noHp) }}
              </a>
              <p v-else class="text-sm text-gray-400 italic font-medium">Belum diisi</p>
            </div>
          </div>

          <!-- Cabang -->
          <div class="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-gray-50 transition group">
            <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0 border border-blue-100 group-hover:scale-105 transition-transform">
              <i class="fa-solid fa-location-dot text-sm"></i>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cabang</p>
              <p class="text-sm text-gray-800 font-semibold truncate">{{ user?.namaCabang || '-' }}</p>
            </div>
          </div>

          <!-- Bergabung -->
          <div class="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-gray-50 transition group">
            <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 shrink-0 border border-amber-100 group-hover:scale-105 transition-transform">
              <i class="fa-solid fa-calendar text-sm"></i>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bergabung</p>
              <p class="text-sm text-gray-800 font-semibold">{{ formatDate(user?.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- ==================== EDIT MODE ==================== -->
        <div v-else>
          <form @submit.prevent="handleSaveProfile" class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <!-- Nama -->
              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nama Lengkap</label>
                <div class="relative">
                  <i class="fa-solid fa-id-card absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <input
                    v-model="editForm.name"
                    type="text"
                    class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white"
                    placeholder="Nama lengkap"
                    required
                  />
                </div>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email</label>
                <div class="relative">
                  <i class="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <input
                    v-model="editForm.email"
                    type="email"
                    class="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white"
                    :class="emailError ? 'border-red-400 bg-red-50/50' : 'border-gray-200'"
                    placeholder="contoh@email.com"
                    required
                  />
                </div>
                <p v-if="emailError" class="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                  <i class="fa-solid fa-circle-exclamation text-[9px]"></i> {{ emailError }}
                </p>
              </div>

              <!-- No HP -->
              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">No. HP</label>
                <div class="relative">
                  <i class="fa-solid fa-phone absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <input
                    v-model="editForm.noHp"
                    type="tel"
                    inputmode="numeric"
                    class="w-full pl-10 pr-16 py-2.5 border rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white"
                    :class="noHpError ? 'border-red-400 bg-red-50/50' : 'border-gray-200'"
                    placeholder="08123456789"
                    @input="onNoHpInput"
                    required
                  />
                  <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none font-semibold tabular-nums">
                    {{ editForm.noHp.length }}/14
                  </span>
                </div>
                <p v-if="noHpError" class="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
                  <i class="fa-solid fa-circle-exclamation text-[9px]"></i> {{ noHpError }}
                </p>
              </div>

              <!-- Cabang -->
              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Cabang</label>
                <div class="relative">
                  <i class="fa-solid fa-store absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <select
                    v-model="editForm.namaCabang"
                    class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-gray-50 focus:bg-white transition"
                    required
                  >
                    <option disabled value="">Pilih Cabang</option>
                    <option v-for="store in storeList" :key="store" :value="store">{{ store }}</option>
                  </select>
                  <i class="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none"></i>
                </div>
              </div>

            </div>

            <!-- Actions -->
            <div class="flex items-center gap-3 pt-2">
              <button
                type="submit"
                :disabled="isSaving"
                class="px-5 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <i v-if="isSaving" class="fa-solid fa-spinner fa-spin text-[10px]"></i>
                <i v-else class="fa-solid fa-check text-[10px]"></i>
                {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
              </button>
              <button
                type="button"
                @click="cancelEditing"
                :disabled="isSaving"
                class="px-5 py-2.5 text-xs font-bold text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>

    <!-- ==================== CARD: KEAMANAN ==================== -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-8 py-5 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100">
            <i class="fa-solid fa-shield-halved text-sm"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-800">Keamanan Akun</h3>
            <p class="text-xs text-gray-400 mt-0.5">Ubah password untuk menjaga keamanan</p>
          </div>
        </div>
      </div>

      <div class="px-8 py-6">
        <form @submit.prevent="handleMyPasswordChange" class="space-y-4 max-w-lg">
          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Password Lama</label>
            <div class="relative">
              <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
              <input
                v-model="myPassForm.current"
                :type="showMyPasswords.current ? 'text' : 'password'"
                placeholder="Masukkan password saat ini"
                class="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-gray-50 focus:bg-white"
                required
              />
              <button type="button" @click="showMyPasswords.current = !showMyPasswords.current" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition">
                <i :class="showMyPasswords.current ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" class="text-xs"></i>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Password Baru</label>
            <div class="relative">
              <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
              <input
                v-model="myPassForm.new"
                :type="showMyPasswords.new ? 'text' : 'password'"
                placeholder="Min 8 karakter, 1 huruf besar, 1 angka"
                class="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-gray-50 focus:bg-white"
                required
              />
              <button type="button" @click="showMyPasswords.new = !showMyPasswords.new" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition">
                <i :class="showMyPasswords.new ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" class="text-xs"></i>
              </button>
            </div>
            <!-- Strength bar -->
            <div v-if="myPassForm.new" class="flex gap-1 mt-2.5">
              <div class="h-1 flex-1 rounded-full transition-colors duration-300" :class="passStrength >= 1 ? 'bg-red-400' : 'bg-gray-200'"></div>
              <div class="h-1 flex-1 rounded-full transition-colors duration-300" :class="passStrength >= 2 ? 'bg-amber-400' : 'bg-gray-200'"></div>
              <div class="h-1 flex-1 rounded-full transition-colors duration-300" :class="passStrength >= 3 ? 'bg-emerald-400' : 'bg-gray-200'"></div>
            </div>
            <p v-if="myPassForm.new && passStrength < 3" class="text-[11px] text-amber-600 mt-1 font-medium">
              <i class="fa-solid fa-circle-info mr-1 text-[9px]"></i>Min 8 char, 1 huruf besar, 1 angka/simbol
            </p>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Ulangi Password Baru</label>
            <div class="relative">
              <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
              <input
                v-model="myPassForm.confirm"
                :type="showMyPasswords.confirm ? 'text' : 'password'"
                placeholder="Ulangi password baru"
                class="w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition bg-gray-50 focus:bg-white"
                :class="myPassForm.new && myPassForm.confirm && myPassForm.new !== myPassForm.confirm ? 'border-red-400 bg-red-50/50' : 'border-gray-200'"
                required
              />
              <button type="button" @click="showMyPasswords.confirm = !showMyPasswords.confirm" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition">
                <i :class="showMyPasswords.confirm ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" class="text-xs"></i>
              </button>
            </div>
            <p v-if="myPassForm.new && myPassForm.confirm && myPassForm.new !== myPassForm.confirm" class="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-medium">
              <i class="fa-solid fa-circle-exclamation text-[9px]"></i> Password tidak cocok
            </p>
          </div>

          <button
            type="submit"
            :disabled="isChangingPass"
            class="mt-2 px-5 py-2.5 bg-amber-500 text-white text-xs font-bold rounded-lg hover:bg-amber-600 transition disabled:opacity-50 flex items-center gap-2"
          >
            <i v-if="isChangingPass" class="fa-solid fa-spinner fa-spin text-[10px]"></i>
            <i v-else class="fa-solid fa-key text-[10px]"></i>
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
            <div class="px-5 py-4 border-b flex justify-between items-center">
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
            <div class="px-5 py-4 border-t flex justify-end gap-3">
              <button @click="closeCropper" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition">Batal</button>
              <button @click="saveCroppedImage" class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-medium transition flex items-center gap-2">
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

const {
  user,
  isLoading,
  userAvatar,
  userInitials,
  fetchCurrentUser,
  updateUser
} = useUserStore();

const storeList = STORE_LIST;

// Edit mode
const isEditing = ref(false);
const isSaving = ref(false);
const editForm = reactive({ name: '', email: '', noHp: '', namaCabang: '' });
const emailError = ref('');
const noHpError = ref('');

// Password
const myPassForm = reactive({ current: '', new: '', confirm: '' });
const showMyPasswords = reactive({ current: false, new: false, confirm: false });
const isChangingPass = ref(false);

const passStrength = computed(() => {
  const p = myPassForm.new;
  if (!p) return 0;
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[\d!@#$%^&*]/.test(p)) s++;
  return s;
});

// Cropper
const fileInput = ref(null);
const isUploading = ref(false);
const showCropper = ref(false);
const imageToCrop = ref(null);
const cropper = ref(null);

onMounted(async () => {
  await fetchCurrentUser();
});

// ==================== EDIT ====================
const startEditing = () => {
  if (!user.value) return;
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
  let ok = true;
  emailError.value = '';
  noHpError.value = '';
  if (!editForm.email || !/\S+@\S+\.\S+/.test(editForm.email)) {
    emailError.value = 'Format email tidak valid';
    ok = false;
  }
  if (!editForm.noHp) {
    noHpError.value = 'No. HP wajib diisi';
    ok = false;
  } else if (!editForm.noHp.startsWith('0')) {
    noHpError.value = 'Harus diawali angka 0';
    ok = false;
  } else if (editForm.noHp.length < 10) {
    noHpError.value = 'Minimal 10 digit';
    ok = false;
  }
  return ok;
};

const handleSaveProfile = async () => {
  if (!validateEditForm()) return;
  isSaving.value = true;
  try {
    const res = await api.put('/auth/me', {
      name: editForm.name,
      email: editForm.email,
      noHp: editForm.noHp,
      namaCabang: editForm.namaCabang
    });
    updateUser(res.data.data);
    isEditing.value = false;
    showToast(res.data.message || 'Profil berhasil diperbarui', 'success');
  } catch (error) {
    const msg = error.response?.data?.message || 'Gagal memperbarui profil';
    if (msg.toLowerCase().includes('email')) emailError.value = msg;
    else if (msg.toLowerCase().includes('hp') || msg.toLowerCase().includes('nomor')) noHpError.value = msg;
    else showToast(msg, 'error');
  } finally {
    isSaving.value = false;
  }
};

// ==================== PASSWORD ====================
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

// ==================== AVATAR ====================
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
      const res = await api.post('/upload/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser({ avatarUrl: res.data.data.avatarUrl });
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
