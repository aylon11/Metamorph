<script setup>
defineProps({
  size: {
    type: String,
    default: 'w-8 h-8'
  },
  textSize: {
    type: String,
    default: 'text-sm'
  }
})
</script>

<template>
  <div 
    :class="[
      size, 
      textSize,
      'rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0'
    ]"
  >
    M
  </div>
</template>
