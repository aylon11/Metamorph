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
      'flex items-center justify-center shrink-0'
    ]"
  >
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
      <!-- Minimalist 'M' + Transformation Mark -->
      <path 
        d="M20 80L50 20L80 80" 
        stroke="#0F172A" 
        stroke-width="12" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      />
      <path 
        d="M50 20L75 55L100 20" 
        class="stroke-gold-500"
        stroke-width="12" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      />
      <!-- Growth Arrow Tip -->
      <path 
        d="M85 35L100 20L100 45" 
        class="fill-gold-500"
      />
    </svg>
  </div>
</template>
