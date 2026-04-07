// src/composables/useUserStore.js
import { reactive, computed } from 'vue';
import Storage from '../utils/storage';
import api from '../utils/api';

// ==================== SINGLETON REACTIVE STATE ====================
// Satu instance di-share ke SEMUA komponen yang import ini.
// Inilah yang fix bug "profile hilang setelah logout lalu login lagi"
// karena state-nya tidak bergantung pada props dari parent.
const state = reactive({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false
});

export function useUserStore() {

  // Baca dari localStorage sekali saat pertama kali dipanggil
  const initialize = () => {
    if (state.isAuthenticated) return; // Sudah ke-init, skip

    const token = Storage.getToken();
    const user = Storage.getUser();

    if (token && user) {
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
    }
  };

  // Dipanggil setelah login berhasil (dari presenter)
  const setUser = (userData) => {
    state.user = userData;
    state.token = Storage.getToken();
    state.isAuthenticated = true;
    Storage.setUser(userData);
  };

  // Fetch data terbaru dari API (dipakai saat mount layout/profile)
  const fetchCurrentUser = async () => {
    const token = state.token || Storage.getToken();
    if (!token) return null;

    state.isLoading = true;
    try {
      const response = await api.get('/auth/me');
      const userData = response.data.data;

      // Update state + storage
      state.user = userData;
      state.token = token;
      state.isAuthenticated = true;
      Storage.setUser(userData);

      return userData;
    } catch (error) {
      console.error('[useUserStore] fetchCurrentUser failed:', error.message);
      if (error.response?.status === 401) {
        logout();
      }
      return null;
    } finally {
      state.isLoading = false;
    }
  };

  // Update partial (misal: setelah upload avatar)
  const updateUser = (partial) => {
    if (!state.user) return;
    state.user = { ...state.user, ...partial };
    Storage.setUser(state.user);
    window.dispatchEvent(new CustomEvent('user-updated'));
  };

  // Logout: bersihkan state + storage
  const logout = () => {
    state.user = null;
    state.token = null;
    state.isAuthenticated = false;
    state.isLoading = false;
    Storage.clearUser();
  };

  // ==================== COMPUTED GETTERS ====================
  const user = computed(() => state.user);
  const isAuthenticated = computed(() => state.isAuthenticated);
  const isLoading = computed(() => state.isLoading);

  const userRole = computed(() => state.user?.role || null);
  const userName = computed(() => state.user?.name || 'User');
  const userCabang = computed(() => state.user?.namaCabang || '-');
  const userNoHp = computed(() => state.user?.noHp || '-');
  const userAvatar = computed(() => state.user?.avatarUrl || '');

  const userInitials = computed(() => {
    if (!state.user?.name) return 'U';
    return state.user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  });

  return {
    // Direct state (untuk watch jika perlu)
    state,
    // Computed
    user,
    isAuthenticated,
    isLoading,
    userRole,
    userName,
    userCabang,
    userNoHp,
    userAvatar,
    userInitials,
    // Methods
    initialize,
    setUser,
    fetchCurrentUser,
    updateUser,
    logout
  };
}