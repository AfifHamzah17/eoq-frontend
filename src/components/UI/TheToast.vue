<template>
  <div id="toast-container" class="fixed top-5 right-5 z-50 flex flex-col gap-2">
    <transition-group name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        :class="`toast bg-white px-4 py-3 rounded shadow border-l-4 ${toast.type === 'success' ? 'border-green-500' : 'border-red-500'} flex items-center`"
      >
        <div class="mr-3" :class="`text-${toast.type === 'success' ? 'green' : 'red'}-500`">
          <i :class="`fa-solid ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`"></i>
        </div>
        <div class="text-sm font-medium text-gray-800">{{ toast.message }}</div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const toasts = ref([]);

const showToast = (message, type = 'success') => {
  const id = Date.now();
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 3000);
};

defineExpose({ showToast });
</script>

<style>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(30px); }
</style>