<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, ShieldCheck } from 'lucide-vue-next'
import Logo from '../components/Logo.vue'

const router = useRouter()
const isSigningIn = ref(false)

const handleSignIn = () => {
  isSigningIn.value = true
  setTimeout(() => {
    router.push('/profile')
  }, 1500)
}
</script>

<template>
  <div class="min-h-screen bg-stone-50 flex items-center justify-center p-6 selection:bg-emerald-500/20">
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-slate-900 to-emerald-500"></div>
    
    <div class="max-w-md w-full space-y-8 animate-fade-in-up">
      <div class="text-center space-y-4">
        <div class="inline-block p-4 bg-white rounded-3xl shadow-xl border border-stone-100 premium-shadow mb-4">
          <Logo size="w-12 h-12" />
        </div>
        <h1 class="text-4xl font-black text-slate-950 tracking-tight">Sign In</h1>
        <p class="text-slate-500 font-medium">Access your profile and campaign dashboard.</p>
      </div>

      <div class="bg-white rounded-[32px] shadow-2xl premium-shadow p-10 border border-white relative overflow-hidden">
        <!-- Google Color Accent -->
        <div class="absolute top-0 left-0 w-full h-1.5 bg-[#4285F4]"></div>
        
        <div class="space-y-6">
          <button 
            @click="handleSignIn"
            :disabled="isSigningIn"
            class="w-full py-4 px-6 bg-white hover:bg-stone-50 text-slate-900 border border-stone-200 font-bold rounded-2xl transition-all shadow-lg shadow-stone-900/5 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group active:scale-95"
          >
            <div class="flex items-center gap-3" v-if="!isSigningIn">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="w-5 h-5">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
              <span>Sign in with Google</span>
            </div>
            <div v-else class="flex items-center gap-3">
              <svg class="animate-spin h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Signing in...</span>
            </div>
          </button>

          <div class="flex items-center justify-center gap-2 py-4 border-t border-stone-100">
            <ShieldCheck class="w-4 h-4 text-green-500" />
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Authentication</span>
          </div>
        </div>
      </div>

      <div class="text-center">
        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
          By signing in, you agree to our<br/>
          <a href="#" class="text-slate-600 hover:text-emerald-500 underline decoration-slate-200">Terms of Service</a> & <a href="#" class="text-slate-600 hover:text-emerald-500 underline decoration-slate-200">Privacy Policy</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.premium-shadow {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
}
.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
