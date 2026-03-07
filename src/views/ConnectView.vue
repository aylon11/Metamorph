<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isConnecting = ref(false)

const handleConnect = () => {
  isConnecting.value = true
  setTimeout(() => {
    router.push('/processing')
  }, 2000)
}
</script>

<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full space-y-6 text-center">
      <div class="w-16 h-16 bg-blue-600 rounded-full mx-auto flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900">Connect to Meta</h2>
      <p class="text-gray-600">Authorize Metamorph to access your ad campaigns and performance data.</p>
      
      <button 
        @click="handleConnect"
        :disabled="isConnecting"
        class="w-full py-3 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <svg v-if="!isConnecting" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9.998 21.375V11.25H7.5v-3.75h2.498V5.378c0-2.472 1.51-3.818 3.715-3.818 1.056 0 2.162.189 2.162.189v2.375h-1.218c-1.225 0-1.606.76-1.606 1.541V7.5h2.682l-.428 3.75h-2.254v10.125h-3z"/></svg>
        <span v-if="isConnecting">Connecting...</span>
        <span v-else>Continue with Facebook</span>
      </button>
      
      <p class="text-xs text-gray-400 mt-4">
        By connecting, you agree to Metamorph's Terms of Service and Privacy Policy.
      </p>
    </div>
  </div>
</template>
