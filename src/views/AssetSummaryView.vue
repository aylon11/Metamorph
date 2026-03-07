<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { extractedAssets } from '../data/mockData'
import { CheckCircle, Layout, ArrowRight, SkipForward, Sparkles, Image as ImageIcon, Type, Users } from 'lucide-vue-next'
import Logo from '../components/Logo.vue'

const router = useRouter()
const manualUrl = ref('')

const handleCreateLandingPage = () => {
  // Open Landing Page in new tab
  const route = router.resolve({ name: 'generated-site' })
  window.open(route.href, '_blank')
  
  // Navigate current tab to Config
  router.push('/config')
}

const handleSkip = () => {
  router.push('/config')
}

const handleSubmitUrl = () => {
  if (manualUrl.value) {
    // Navigate to Config, similar to handleSkip or handleCreateLandingPage
    router.push('/config')
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#0f172a] text-white font-sans flex flex-col">
    <!-- Navbar -->
    <nav class="bg-[#1e293b] border-b border-gray-700">
      <div class="w-full px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
           <Logo />
           <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Metamorph</span>
        </div>
        <div class="px-3 py-1 bg-blue-900/30 border border-blue-500/30 rounded-full text-xs font-medium text-blue-300">
          Asset Extraction Complete
        </div>
      </div>
    </nav>

    <main class="flex-1 max-w-7xl mx-auto w-full p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      
      <!-- Left: Asset Grid -->
      <div class="space-y-8">
        <div>
           <div class="flex items-center gap-2 mb-3">
              <div class="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <Sparkles class="w-6 h-6" />
              </div>
              <h2 class="text-3xl font-bold text-white">Assets Extracted Successfully</h2>
           </div>
           <p class="text-gray-400 text-lg leading-relaxed">
             Metamorph analyzed your Meta history and identified high-performing creatives ready for your new campaign.
           </p>
        </div>

        <!-- Stats Row -->
        <div class="grid grid-cols-3 gap-4">
             <div class="bg-[#1e293b] border border-gray-700 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                 <ImageIcon class="w-6 h-6 text-purple-400 mb-2" />
                 <span class="text-2xl font-bold text-white">12</span>
                 <span class="text-xs text-gray-500 uppercase tracking-wider font-bold">Images</span>
             </div>
             <div class="bg-[#1e293b] border border-gray-700 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                 <Type class="w-6 h-6 text-blue-400 mb-2" />
                 <span class="text-2xl font-bold text-white">8</span>
                 <span class="text-xs text-gray-500 uppercase tracking-wider font-bold">Headlines</span>
             </div>
             <div class="bg-[#1e293b] border border-gray-700 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                 <Users class="w-6 h-6 text-pink-400 mb-2" />
                 <span class="text-2xl font-bold text-white">3</span>
                 <span class="text-xs text-gray-500 uppercase tracking-wider font-bold">Audiences</span>
             </div>
        </div>

        <div class="space-y-4">
             <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest">Preview Assets</h3>
             <div class="grid grid-cols-4 gap-4">
               <div v-for="(img, idx) in extractedAssets.images.slice(0, 4)" :key="idx" class="relative aspect-square rounded-xl overflow-hidden shadow-lg border border-gray-700 group cursor-pointer">
                 <img :src="img" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                 <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                 <div class="absolute top-1 right-1">
                     <div class="bg-black/60 backdrop-blur text-[10px] font-bold px-1.5 py-0.5 rounded text-green-400 flex items-center gap-1 border border-green-500/30">
                       <CheckCircle class="w-2.5 h-2.5" /> Ready
                     </div>
                 </div>
               </div>
             </div>

            <div class="flex flex-wrap gap-2">
               <span v-for="(copy, i) in extractedAssets.headlines" :key="i" class="px-3 py-1.5 bg-[#1e293b] border border-gray-700 text-gray-300 rounded-lg text-sm hover:border-blue-500/50 transition-colors cursor-default">
                 "{{ copy }}"
               </span>
            </div>
        </div>
      </div>

      <!-- Right: Action Card -->
      <div class="bg-[#1e293b] rounded-3xl p-1 border border-gray-700 shadow-2xl relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-50"></div>
        
        <div class="bg-slate-900/50 backdrop-blur-sm rounded-[22px] p-8 relative z-10 h-full flex flex-col">
            <div class="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Layout class="w-64 h-64 text-white" />
            </div>

            <div class="space-y-6 flex-1">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/30 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wide">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Critical Action Required
              </div>

              <div>
                  <h3 class="text-3xl font-bold text-white leading-tight mb-3">
                    Missing: High-Performance Landing Page
                  </h3>
                  <p class="text-gray-400 text-base leading-relaxed">
                    To maximize your Google Ads ROAS, you need a dedicated destination. We can instantly generate a conversion-optimized page for <strong>Urban Jungle Plants</strong> using your extracted assets.
                  </p>
              </div>

              <!-- Value Props -->
              <div class="space-y-3 pl-1">
                  <div class="flex items-center gap-3 text-sm text-gray-300">
                      <div class="w-6 h-6 rounded-full bg-blue-900/50 flex items-center justify-center border border-blue-500/30 shrink-0">
                          <CheckCircle class="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <span>Matches your extracted brand imagery</span>
                  </div>
                  <div class="flex items-center gap-3 text-sm text-gray-300">
                      <div class="w-6 h-6 rounded-full bg-blue-900/50 flex items-center justify-center border border-blue-500/30 shrink-0">
                          <CheckCircle class="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <span>Optimized for Quality Score</span>
                  </div>
                   <div class="flex items-center gap-3 text-sm text-gray-300">
                      <div class="w-6 h-6 rounded-full bg-blue-900/50 flex items-center justify-center border border-blue-500/30 shrink-0">
                          <CheckCircle class="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <span>Mobile-responsive & fast loading</span>
                  </div>
              </div>
            </div>

            <div class="space-y-4 pt-8 mt-4 border-t border-gray-700/50">
              <button 
                @click="handleCreateLandingPage"
                class="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 relative overflow-hidden group/btn"
              >
                <div class="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                <Layout class="w-5 h-5" />
                <span>Generate Landing Page</span>
                <ArrowRight class="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
              
              <div class="flex items-center gap-4 py-2">
                <div class="flex-1 h-px bg-gray-700/50"></div>
                <span class="text-xs text-gray-500 font-bold uppercase tracking-widest">or</span>
                <div class="flex-1 h-px bg-gray-700/50"></div>
              </div>

              <div class="flex gap-2 relative">
                <input
                  v-model="manualUrl"
                  type="url"
                  placeholder="Enter existing landing page URL..."
                  class="w-full flex-1 py-3.5 px-4 bg-slate-900/50 border border-gray-700 rounded-xl text-white outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm placeholder:text-gray-500"
                  @keyup.enter="handleSubmitUrl"
                />
                <button 
                  @click="handleSubmitUrl"
                  :disabled="!manualUrl"
                  class="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors shrink-0"
                >
                  Submit
                </button>
              </div>

              <button 
                @click="handleSkip"
                class="w-full py-3 text-gray-500 hover:text-white font-medium transition-colors flex items-center justify-center gap-2 text-sm"
              >
                Continue to Configuration <SkipForward class="w-4 h-4" />
              </button>
            </div>
        </div>
      </div>

    </main>
  </div>
</template>

