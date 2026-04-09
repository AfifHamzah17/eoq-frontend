<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
        <p class="text-sm text-gray-500">Kelola pendaftaran, akun karyawan, dan hak akses sistem.</p>
      </div>
    </div>

    <div class="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
      <div class="flex border-b">
        <button @click="filterStatus = 'pending'" :class="filterStatus === 'pending' ? 'border-b-2 border-yellow-500 bg-yellow-50 text-yellow-700' : 'text-gray-500 hover:bg-gray-50'" class="flex-1 py-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
          <i class="fa-solid fa-user-clock"></i> Permintaan Baru
          <span v-if="pendingCount > 0" class="bg-yellow-200 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">{{ pendingCount }}</span>
        </button>
        <button @click="filterStatus = 'active'" :class="filterStatus === 'active' ? 'border-b-2 border-blue-600 bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'" class="flex-1 py-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
          <i class="fa-solid fa-users-viewfinder"></i> Pengguna Aktif
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
      <div v-if="isLoading" class="p-10 text-center text-gray-400">
        <i class="fa-solid fa-spinner fa-spin text-4xl mb-3 text-blue-500"></i>
        <p>Memuat data pengguna...</p>
      </div>

      <div v-else-if="filterStatus === 'pending'">
        <table class="w-full text-sm text-left text-gray-600">
          <thead class="text-xs text-gray-500 uppercase bg-yellow-50 border-b border-yellow-100">
            <tr>
              <th class="px-6 py-3">Info Pendaftar</th>
              <th class="px-6 py-3">No. HP</th>
              <th class="px-6 py-3">Asal Cabang</th>
              <th class="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="pendingUsers.length === 0">
              <td colspan="4" class="text-center py-16 text-gray-400 bg-gray-50">
                <i class="fa-solid fa-inbox text-5xl mb-3 block text-gray-300"></i>
                Tidak ada permintaan pendaftaran baru.
              </td>
            </tr>
            <tr v-for="user in pendingUsers" :key="user._id || user.id" class="hover:bg-yellow-50/30 transition">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold uppercase border cursor-pointer" @click="openProfileModal(user)">{{ user.name?.charAt(0) }}</div>
                  <div>
                    <p class="font-semibold text-gray-800 cursor-pointer hover:text-blue-600 hover:underline" @click="openProfileModal(user)">{{ user.name }}</p>
                    <p class="text-xs text-gray-500">{{ user.email }} • @{{ user.username }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm">{{ user.noHp || '-' }}</td>
              <td class="px-6 py-4"><span class="bg-blue-100 text-blue-700 py-1 px-2.5 rounded text-xs font-medium border border-blue-200">{{ user.namaCabang || user.asalToko }}</span></td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="approveUser(user._id || user.id)" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5"><i class="fa-solid fa-check"></i> Setujui</button>
                  <button @click="rejectUser(user)" class="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5"><i class="fa-solid fa-times"></i> Tolak</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else>
        <table class="w-full text-sm text-left text-gray-600">
          <thead class="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th class="px-6 py-3">Pengguna</th>
              <th class="px-6 py-3">No. HP</th>
              <th class="px-6 py-3">Role</th>
              <th class="px-6 py-3">Cabang</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-if="activeUsers.length === 0"><td colspan="6" class="text-center py-10 text-gray-500">Tidak ada pengguna aktif.</td></tr>
            <tr v-for="user in activeUsers" :key="user._id || user.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img v-if="user.avatarUrl" :src="user.avatarUrl" class="w-9 h-9 rounded-full object-cover border bg-gray-100 cursor-pointer" @click="openProfileModal(user)" />
                  <div v-else class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase text-sm border cursor-pointer" @click="openProfileModal(user)">{{ user.name?.charAt(0) }}</div>
                  <div>
                    <p class="font-medium text-gray-800 cursor-pointer hover:text-blue-600 hover:underline" @click="openProfileModal(user)">{{ user.name }}</p>
                    <p class="text-xs text-gray-500">@{{ user.username }}</p>
                    <p v-if="isSelf(user)" class="text-[10px] text-blue-500 font-semibold italic">(Anda)</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm">{{ user.noHp || '-' }}</td>
              <td class="px-6 py-4"><span :class="user.role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-gray-100 text-gray-600 border-gray-200'" class="py-1 px-2.5 rounded text-xs font-medium border">{{ user.role }}</span></td>
              <td class="px-6 py-4 text-xs font-medium text-gray-700">{{ user.namaCabang || user.asalToko || '-' }}</td>
              <td class="px-6 py-4"><span class="flex items-center gap-1.5 text-green-600 text-xs font-semibold"><i class="w-2 h-2 bg-green-500 rounded-full"></i> Aktif</span></td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button v-if="!isSelf(user)" @click="openResetModal(user)" class="text-orange-600 hover:text-white hover:bg-orange-500 border border-orange-200 hover:border-orange-500 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1"><i class="fa-solid fa-key"></i> Reset</button>
                  <span v-else class="text-gray-300 text-xs px-3 py-1.5 border border-gray-100 rounded-lg cursor-not-allowed"><i class="fa-solid fa-key"></i> Reset</span>
                  <button v-if="canDelete(user)" @click="confirmDelete(user)" class="text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1"><i class="fa-solid fa-trash"></i> Hapus</button>
                  <span v-else class="text-gray-300 text-xs px-3 py-1.5 border border-gray-100 rounded-lg cursor-not-allowed" :title="deleteDisabledReason(user)"><i class="fa-solid fa-trash"></i> Hapus</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="#modal-portal"><Transition name="modal"><div v-if="isDeleteModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4"><div @click="isDeleteModalOpen = false" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div><div class="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 z-10 pointer-events-auto overflow-hidden"><div class="px-6 py-4 border-b flex justify-between items-center bg-gradient-to-r from-red-50 to-white"><h3 class="font-bold text-gray-800"><i class="fa-solid fa-triangle-exclamation mr-2 text-red-500"></i> Konfirmasi Hapus</h3><button type="button" @click="isDeleteModalOpen = false" class="text-gray-400 hover:text-red-500 transition"><i class="fa-solid fa-xmark text-xl"></i></button></div><div class="p-6"><div class="bg-red-50 p-4 rounded-lg mb-4 border border-red-200"><p class="text-sm text-red-800">Anda yakin ingin menghapus akun <strong>{{ userToDelete?.name }}</strong> (@{{ userToDelete?.username }})?</p><p class="text-xs text-red-600 mt-2"><i class="fa-solid fa-circle-info mr-1"></i> Tindakan ini tidak dapat dibatalkan.</p></div><div class="flex gap-2"><button type="button" @click="isDeleteModalOpen = false" class="flex-1 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition">Batal</button><button type="button" @click="executeDelete" :disabled="isDeleting" class="flex-1 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"><i v-if="isDeleting" class="fa-solid fa-spinner fa-spin"></i><span>{{ isDeleting ? 'Menghapus...' : 'Ya, Hapus' }}</span></button></div></div></div></div></Transition></Teleport>

    <Teleport to="#modal-portal"><Transition name="modal"><div v-if="isProfileModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4"><div @click="isProfileModalOpen = false" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div><div class="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 z-10 pointer-events-auto overflow-hidden"><div class="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative"><button @click="isProfileModalOpen = false" class="absolute top-3 right-3 text-white/80 hover:text-white transition"><i class="fa-solid fa-xmark text-xl"></i></button></div><div class="flex justify-center -mt-12 relative z-10"><div class="border-4 border-white rounded-full shadow-lg bg-gray-100 overflow-hidden"><img v-if="selectedProfile?.avatarUrl" :src="selectedProfile.avatarUrl" class="w-24 h-24 object-cover" /><div v-else class="w-24 h-24 bg-blue-100 flex items-center justify-center text-4xl text-blue-600 font-bold">{{ selectedProfile?.name?.charAt(0)?.toUpperCase() }}</div></div></div><div class="px-6 pt-3 pb-6 text-center space-y-4"><div><h2 class="text-xl font-bold text-gray-800">{{ selectedProfile?.name }}</h2><p class="text-sm text-gray-500 mt-1">@{{ selectedProfile?.username }}</p></div><div class="flex justify-center gap-2 flex-wrap"><span :class="selectedProfile?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'" class="text-xs font-bold px-3 py-1 rounded-full uppercase">{{ selectedProfile?.role }}</span><span class="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full"><i class="fa-solid fa-building mr-1"></i>{{ selectedProfile?.namaCabang || selectedProfile?.asalToko || 'Default' }}</span></div><div class="bg-gray-50 rounded-xl p-4 space-y-3 text-left border"><a :href="`mailto:${selectedProfile?.email}`" class="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition group"><div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-500 group-hover:bg-red-200 transition"><i class="fa-solid fa-envelope text-xs"></i></div><span>{{ selectedProfile?.email }}</span></a><a v-if="selectedProfile?.noHp" :href="generateWaLink(selectedProfile.noHp)" target="_blank" class="flex items-center gap-3 text-sm text-gray-700 hover:text-green-600 transition group"><div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-500 group-hover:bg-green-200 transition"><i class="fa-brands fa-whatsapp text-base"></i></div><span>{{ formatPhoneDisplay(selectedProfile.noHp) }}</span></a><div v-else class="flex items-center gap-3 text-sm text-gray-400 italic"><div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"><i class="fa-solid fa-phone text-xs"></i></div><span>Belum ada No. HP</span></div></div></div></div></div></Transition></Teleport>

    <Teleport to="#modal-portal"><Transition name="modal"><div v-if="isResetModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4"><div @click="closeResetModal" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div><div class="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 z-10 pointer-events-auto overflow-hidden"><div class="px-6 py-4 border-b flex justify-between items-center bg-gradient-to-r from-orange-50 to-white"><h3 class="font-bold text-gray-800"><i class="fa-solid fa-key mr-2 text-orange-500"></i> Reset Password User</h3><button type="button" @click="closeResetModal" class="text-gray-400 hover:text-red-500 transition"><i class="fa-solid fa-xmark text-xl"></i></button></div><div class="p-6"><div class="bg-gray-50 p-3 rounded-lg mb-4 border flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase border">{{ selectedUser?.name?.charAt(0) }}</div><div><p class="font-bold text-gray-800 text-sm">{{ selectedUser?.name }}</p><p class="text-xs text-gray-500">@{{ selectedUser?.username }}</p></div></div><div class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">Password Baru</label><div class="relative"><input v-model="newPassword" :type="showPass ? 'text' : 'password'" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none pr-10" placeholder="Min 8 char, 1 Huruf Besar, 1 Angka" /><button type="button" @click="showPass = !showPass" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600"><i :class="showPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i></button></div></div></div><div class="flex gap-2 pt-5"><button type="button" @click="closeResetModal" class="flex-1 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition">Batal</button><button type="button" @click="handleResetPassword" class="flex-1 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition">Simpan Password</button></div></div></div></div></Transition></Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../../composables/useUserStore';
import UserManagementPresenter from './UserManagementPresenter';
import { showToast } from '../../utils/toastify';

const { user: currentUser } = useUserStore();
const isLoading = ref(false);
const users = ref([]);
const filterStatus = ref('pending');
const isResetModalOpen = ref(false);
const selectedUser = ref(null);
const newPassword = ref('');
const showPass = ref(false);
const isDeleteModalOpen = ref(false);
const userToDelete = ref(null);
const isDeleting = ref(false);
const isProfileModalOpen = ref(false);
const selectedProfile = ref(null);

const presenter = new UserManagementPresenter({
  setLoading: (val) => (isLoading.value = val),
  setUsers: (data) => (users.value = data),
  onSuccess: (msg) => showToast(msg, 'success'),
  onError: (msg) => showToast(msg, 'error'),
  closeModal: () => (isResetModalOpen.value = false)
});

const pendingUsers = computed(() => users.value.filter((u) => !u.isApproved));
const activeUsers = computed(() => users.value.filter((u) => u.isApproved));
const pendingCount = computed(() => pendingUsers.value.length);

const isSelf = (targetUser) => currentUser.value?._id && targetUser?._id ? currentUser.value._id.toString() === targetUser._id.toString() : false;
const canDelete = (targetUser) => !isSelf(targetUser) && targetUser.role !== 'admin';
const deleteDisabledReason = (targetUser) => isSelf(targetUser) ? 'Tidak bisa hapus akun sendiri' : targetUser.role === 'admin' ? 'Tidak bisa hapus akun admin' : '';

const confirmDelete = (user) => { if (!canDelete(user)) return; userToDelete.value = user; isDeleteModalOpen.value = true; };
const executeDelete = async () => { if (!userToDelete.value) return; isDeleting.value = true; try { await presenter.deleteUser(userToDelete.value); isDeleteModalOpen.value = false; userToDelete.value = null; } finally { isDeleting.value = false; } };

const fetchUsers = () => presenter.loadUsers();
const approveUser = (id) => presenter.approveUser(id);
const rejectUser = (user) => presenter.rejectUser(user);
const openProfileModal = (user) => { selectedProfile.value = user; isProfileModalOpen.value = true; };
const openResetModal = (user) => { selectedUser.value = user; newPassword.value = ''; isResetModalOpen.value = true; };
const closeResetModal = () => { isResetModalOpen.value = false; selectedUser.value = null; };
const handleResetPassword = () => { if (!newPassword.value) return showToast('Password wajib diisi', 'error'); presenter.resetPassword(selectedUser.value._id || selectedUser.value.id, newPassword.value); };

const formatPhoneDisplay = (val) => { if (!val) return ''; let num = val.replace(/\D/g, ''); if (num.length > 14) num = num.substring(0, 14); if (num.length > 4) num = num.substring(0, 4) + '-' + num.substring(4); if (num.length > 9) num = num.substring(0, 9) + '-' + num.substring(9); return num; };
const generateWaLink = (val) => { if (!val) return '#'; let num = val.replace(/\D/g, ''); if (num.length < 10) return '#'; if (num.startsWith('0')) num = '62' + num.substring(1); return `https://wa.me/${num}`; };

onMounted(() => fetchUsers());
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>