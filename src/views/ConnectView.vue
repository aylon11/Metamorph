<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Facebook, ShieldCheck, ArrowRight } from 'lucide-vue-next'
import Logo from '../components/Logo.vue'

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
  <div class="min-h-screen bg-stone-50 flex items-center justify-center p-6 selection:bg-emerald-500/20">
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-slate-900 to-emerald-500"></div>
    
    <div class="max-w-md w-full space-y-8 animate-fade-in-up">
      <div class="text-center space-y-4">
        <div class="inline-block p-4 bg-white rounded-3xl shadow-xl border border-stone-100 premium-shadow mb-4">
          <Logo size="w-12 h-12" />
        </div>
        <h1 class="text-4xl font-black text-slate-950 tracking-tight">Connect Meta</h1>
        <p class="text-slate-500 font-medium">Authorize Metamorph to analyze your high-performing campaigns and assets.</p>
      </div>

      <div class="bg-white rounded-[32px] shadow-2xl premium-shadow p-10 border border-white relative overflow-hidden">
        <!-- Facebook Color Accent -->
        <div class="absolute top-0 left-0 w-full h-1.5 bg-[#1877F2]"></div>
        
        <div class="space-y-6">
          <div class="flex items-center gap-4 p-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl">
            <div class="w-10 h-10 bg-[#1877F2] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
               <Facebook class="w-6 h-6 text-white fill-current" />
            </div>
            <div class="flex-1">
              <div class="text-xs font-black text-[#1877F2] uppercase tracking-widest">Platform</div>
              <div class="text-sm font-bold text-slate-900">Facebook & Instagram Ads</div>
            </div>
          </div>

          <button 
            @click="handleConnect"
            :disabled="isConnecting"
            class="w-full py-4 px-6 bg-[#1877F2] hover:bg-[#166fe5] text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-between gap-3 disabled:opacity-70 disabled:cursor-not-allowed group active:scale-95"
          >
            <div class="flex items-center gap-3">
              <img src="../assets/user_avatar.png" alt="User Avatar" class="w-8 h-8 rounded-full border-2 border-white/20 object-cover" />
              <span v-if="isConnecting" class="flex items-center gap-3">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
              <span v-else>
                Sign in with Meta
              </span>
            </div>
            <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div class="flex items-center justify-center gap-2 py-4 border-t border-stone-100">
            <ShieldCheck class="w-4 h-4 text-green-500" />
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Grade Security</span>
          </div>
        </div>
      </div>

      <div class="text-center">
        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
          By connecting, you agree to our<br/>
          <a href="#" class="text-slate-600 hover:text-emerald-500 underline decoration-slate-200">Terms of Service</a> & <a href="#" class="text-slate-600 hover:text-emerald-500 underline decoration-slate-200">Privacy Policy</a>
        </p>
      </div>
    </div>
  </div>
</template>
