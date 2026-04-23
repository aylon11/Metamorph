<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { extractedAssets } from '../data/metaIngestion'
import { CheckCircle, Layout, ArrowRight, SkipForward, Sparkles, Image as ImageIcon, Type, Users, AlertTriangle } from 'lucide-vue-next'
import Logo from '../components/Logo.vue'

const router = useRouter()
const manualUrl = ref('')

const handleCreateLandingPage = () => {
  const route = router.resolve({ name: 'generated-site' })
  window.open(route.href, '_blank')
  router.push('/config')
}

const handleSkip = () => {
  router.push('/config')
}

const handleSubmitUrl = () => {
  if (manualUrl.value) {
    router.push('/config')
  }
}
</script>

<template>
  <div class="min-h-screen bg-stone-50 text-slate-900 font-sans flex flex-col selection:bg-emerald-500/20">
    <!-- Navbar -->
    <nav class="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div class="w-full px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3 cursor-pointer" @click="router.push('/')">
           <Logo size="w-8 h-8" />
           <span class="text-xl font-extrabold tracking-tight">Metamorph</span>
        </div>
        <div class="px-4 py-1.5 bg-green-50 border border-green-100 rounded-full text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-2">
          <CheckCircle class="w-3 h-3" />
          Extraction Complete
        </div>
      </div>
    </nav>

    <main class="flex-1 max-w-7xl mx-auto w-full p-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      
      <!-- Left: Asset Grid -->
      <div class="space-y-12 animate-fade-in-up">
        <div class="space-y-6">
           <div class="flex items-center gap-4">
              <div class="p-3 bg-white rounded-2xl shadow-xl border border-stone-100 text-emerald-500 premium-shadow">
                <Sparkles class="w-8 h-8" />
              </div>
              <h2 class="text-4xl font-black text-slate-950 tracking-tight">Assets Harvested</h2>
           </div>
           <p class="text-slate-500 font-medium text-lg leading-relaxed max-w-lg">
             Metamorph analyzed your Meta history and identified high-performing creatives ready for Google Ads deployment.
           </p>
        </div>

        <!-- Stats Row -->
        <div class="grid grid-cols-3 gap-6">
             <div class="bg-white border border-stone-100 p-6 rounded-[24px] flex flex-col items-center justify-center text-center shadow-lg premium-shadow group hover:translate-y-[-4px] transition-transform">
                 <div class="p-2 bg-blue-50 rounded-xl mb-3 group-hover:bg-blue-100 transition-colors">
                  <ImageIcon class="w-6 h-6 text-blue-500" />
                 </div>
                 <span class="text-3xl font-black text-slate-950 tracking-tighter">12</span>
                 <span class="text-[9px] text-slate-400 uppercase tracking-widest font-black mt-1">Images</span>
             </div>
             <div class="bg-white border border-stone-100 p-6 rounded-[24px] flex flex-col items-center justify-center text-center shadow-lg premium-shadow group hover:translate-y-[-4px] transition-transform">
                 <div class="p-2 bg-emerald-50 rounded-xl mb-3 group-hover:bg-emerald-100 transition-colors">
                  <Type class="w-6 h-6 text-emerald-500" />
                 </div>
                 <span class="text-3xl font-black text-slate-950 tracking-tighter">8</span>
                 <span class="text-[9px] text-slate-400 uppercase tracking-widest font-black mt-1">Headlines</span>
             </div>
             <div class="bg-white border border-stone-100 p-6 rounded-[24px] flex flex-col items-center justify-center text-center shadow-lg premium-shadow group hover:translate-y-[-4px] transition-transform">
                 <div class="p-2 bg-slate-50 rounded-xl mb-3 group-hover:bg-slate-100 transition-colors">
                  <Users class="w-6 h-6 text-slate-900" />
                 </div>
                 <span class="text-3xl font-black text-slate-950 tracking-tighter">3</span>
                 <span class="text-[9px] text-slate-400 uppercase tracking-widest font-black mt-1">Audiences</span>
             </div>
        </div>

        <div class="space-y-6">
             <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Preview</h3>
             <div class="grid grid-cols-4 gap-4">
               <div v-for="(img, idx) in extractedAssets.images.slice(0, 4)" :key="idx" class="relative aspect-square rounded-2xl overflow-hidden shadow-xl border border-stone-200 group cursor-pointer transition-all hover:scale-105">
                 <img :src="img" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div class="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors"></div>
                 <div class="absolute top-2 right-2">
                     <div class="bg-white/90 backdrop-blur text-[9px] font-black px-2 py-1 rounded-lg text-green-600 flex items-center gap-1 border border-stone-100 shadow-sm">
                       <CheckCircle class="w-2.5 h-2.5" /> READY
                     </div>
                 </div>
               </div>
             </div>

            <div class="flex flex-wrap gap-2 pt-4">
               <span v-for="(copy, i) in extractedAssets.headlines" :key="i" class="px-4 py-2 bg-white border border-stone-100 text-slate-600 font-bold rounded-xl text-sm shadow-sm hover:border-emerald-500/30 transition-colors cursor-default select-none">
                 "{{ copy }}"
               </span>
            </div>
        </div>
      </div>

      <!-- Right: Action Card -->
      <div class="bg-slate-950 rounded-[40px] p-1.5 shadow-2xl relative overflow-hidden group animate-fade-in-up shadow-slate-900/40" style="animation-delay: 0.1s">
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent"></div>
        
        <div class="bg-slate-950 rounded-[38px] p-10 relative z-10 h-full flex flex-col">
            <div class="space-y-8 flex-1">
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest">
                <AlertTriangle class="w-4 h-4" />
                Critical Requirement
              </div>

              <div class="space-y-4">
                  <h3 class="text-4xl font-black text-white leading-tight tracking-tight">
                    Landing Page <span class="text-red-500">Missing</span>
                  </h3>
                  <p class="text-slate-400 text-lg leading-relaxed font-medium">
                    Google Ads requires a dedicated destination for high Quality Scores. Let our AI construct a conversion-optimized page for <span class="text-white font-bold">Urban Roots</span> using your harvested assets.
                  </p>
              </div>

              <!-- Value Props -->
              <div class="space-y-4 pt-4">
                  <div class="flex items-center gap-4 text-sm font-bold text-slate-300">
                      <div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/5 shrink-0">
                          <CheckCircle class="w-4 h-4 text-emerald-500" />
                      </div>
                      <span>Matches Meta brand imagery 1:1</span>
                  </div>
                  <div class="flex items-center gap-4 text-sm font-bold text-slate-300">
                      <div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/5 shrink-0">
                          <CheckCircle class="w-4 h-4 text-emerald-500" />
                      </div>
                      <span>Maximized Quality Score potential</span>
                  </div>
                   <div class="flex items-center gap-4 text-sm font-bold text-slate-300">
                      <div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/5 shrink-0">
                          <CheckCircle class="w-4 h-4 text-emerald-500" />
                      </div>
                      <span>Mobile-First dynamic scaling</span>
                  </div>
              </div>
            </div>

            <div class="space-y-6 pt-10 mt-10 border-t border-white/10">
              <button 
                @click="handleCreateLandingPage"
                class="w-full py-5 bg-white hover:bg-stone-100 text-slate-950 text-lg font-black rounded-2xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 relative overflow-hidden group/btn"
              >
                <Layout class="w-6 h-6 px-0.5" />
                <span class="uppercase tracking-widest">Generate Landing Page</span>
                <ArrowRight class="w-6 h-6 text-emerald-500 group-hover/btn:translate-x-2 transition-transform" />
              </button>
              
              <div class="flex items-center gap-6 px-10">
                <div class="flex-1 h-px bg-white/10"></div>
                <span class="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">or</span>
                <div class="flex-1 h-px bg-white/10"></div>
              </div>

              <div class="space-y-3">
                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Existing Destination URL</label>
                <div class="flex gap-3">
                  <input
                    v-model="manualUrl"
                    type="url"
                    placeholder="https://yourwebsite.com/landing"
                    class="w-full flex-1 py-4 px-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-bold placeholder:text-slate-600"
                    @keyup.enter="handleSubmitUrl"
                  />
                  <button 
                    @click="handleSubmitUrl"
                    :disabled="!manualUrl"
                    class="px-8 py-4 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all border border-white/10 flex items-center justify-center"
                  >
                    SUBMIT
                  </button>
                </div>
              </div>

              <button 
                @click="handleSkip"
                class="w-full py-2 text-slate-500 hover:text-white font-black uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-1.5 text-[10px]"
              >
                Skip to Configuration <SkipForward class="w-3 h-3" />
              </button>
            </div>
        </div>
      </div>

    </main>
  </div>
</template>
