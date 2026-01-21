<template>
  <header class="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-10">
    <h2 id="page-title" class="text-xl font-bold text-gray-800">{{ title }}</h2>
    <div class="flex items-center gap-4">
      <button class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition relative">
        <i class="fa-solid fa-bell"></i>
        <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      <button @click="$emit('navigate', 'profile')" class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition">
        <i class="fa-solid fa-user-gear"></i>
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: String
});
defineEmits(['navigate']);
</script>