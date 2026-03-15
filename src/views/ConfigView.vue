<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Settings, MapPin, Users, Target, Rocket, Sparkles, ChevronRight, Check } from 'lucide-vue-next'
import Logo from '../components/Logo.vue'

const router = useRouter()

const config = ref({
  geo: 'ai',
  audience: 'ai',
  intent: 'ai'
})

const isGenerating = ref(false)

const handleGenerate = () => {
  isGenerating.value = true
  setTimeout(() => {
    router.push('/draft-processing')
  }, 1000)
}
</script>

<template>
  <div class="min-h-screen bg-stone-50 text-slate-900 font-sans flex flex-col selection:bg-gold-500/20">
    <!-- Navbar -->
    <nav class="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div class="w-full px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
           <Logo size="w-7 h-7" />
           <span class="text-xl font-extrabold tracking-tight">Metamorph</span>
        </div>
        <div class="px-4 py-1.5 bg-stone-100 border border-stone-200 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Campaign Architect
        </div>
      </div>
    </nav>

    <main class="flex-1 max-w-4xl mx-auto w-full p-8 py-20 pb-40">
      <div class="mb-16 text-center space-y-6 animate-fade-in-up">
        <div class="inline-flex p-4 bg-white rounded-3xl shadow-xl border border-stone-100 premium-shadow mb-4">
          <Settings class="w-8 h-8 text-gold-500" />
        </div>
        <h1 class="text-5xl font-black text-slate-950 tracking-tight">Configure Your Campaign</h1>
        <p class="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          Fine-tune your deployment logic. Let our AI analyze your data for optimal targeting, or specify your constraints manually.
        </p>
      </div>

      <div class="space-y-8 animate-fade-in-up" style="animation-delay: 0.1s">
        <!-- Configuration Card: Geo -->
        <div class="bg-white border border-stone-200 rounded-[32px] p-8 shadow-2xl premium-shadow relative overflow-hidden group">
          <div class="flex items-start gap-6 border-b border-stone-100 pb-8 mb-8">
            <div class="p-3 bg-stone-50 rounded-2xl text-slate-900 border border-stone-100 shadow-sm shrink-0">
              <MapPin class="w-6 h-6" />
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-extrabold text-slate-950 mb-1 tracking-tight">Geographic Targeting</h3>
              <p class="text-sm font-medium text-slate-400">Specify exactly where your ads should appear.</p>
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-4">
            <label class="cursor-pointer group relative">
              <input type="radio" value="ai" v-model="config.geo" class="sr-only" />
              <div class="p-8 rounded-2xl border-4 transition-all duration-300 flex flex-col items-center gap-4 text-center overflow-hidden h-full"
                   :class="config.geo === 'ai' ? 'border-gold-500 bg-white shadow-2xl scale-[1.02]' : 'border-transparent bg-stone-50/50 hover:border-gold-500/30'">
                
                <div class="absolute top-4 right-4 transition-opacity duration-300"
                     :class="config.geo === 'ai' ? 'opacity-100' : 'opacity-0'">
                    <div class="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center shadow-lg">
                        <Check class="w-4 h-4 text-white" />
                    </div>
                </div>

                <div class="w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center transition-all duration-500"
                     :class="config.geo === 'ai' ? 'scale-110 bg-slate-950' : 'bg-white'">
                  <Sparkles class="w-7 h-7 transition-colors duration-500" :class="config.geo === 'ai' ? 'text-white' : 'text-slate-950'" />
                </div>
                <div>
                  <div class="font-black text-slate-950 text-base uppercase tracking-widest">AI Optimized</div>
                  <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Best for global reach</div>
                </div>
              </div>
            </label>
            
            <label class="cursor-pointer group relative">
              <input type="radio" value="manual" v-model="config.geo" class="sr-only" />
              <div class="p-8 rounded-2xl border-4 transition-all duration-300 flex flex-col items-center gap-4 text-center overflow-hidden h-full"
                   :class="config.geo === 'manual' ? 'border-gold-500 bg-white shadow-2xl scale-[1.02]' : 'border-transparent bg-stone-50/50 hover:border-gold-500/30'">
                
                <div class="absolute top-4 right-4 transition-opacity duration-300"
                     :class="config.geo === 'manual' ? 'opacity-100' : 'opacity-0'">
                    <div class="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center shadow-lg">
                        <Check class="w-4 h-4 text-white" />
                    </div>
                </div>

                <div class="w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center transition-all duration-500"
                     :class="config.geo === 'manual' ? 'scale-110 bg-slate-950' : 'bg-white'">
                  <MapPin class="w-7 h-7 transition-colors duration-500" :class="config.geo === 'manual' ? 'text-white' : 'text-slate-950'" />
                </div>
                <div>
                  <div class="font-black text-slate-950 text-base uppercase tracking-widest">Manual Setup</div>
                  <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Precision Targeted</div>
                </div>
              </div>
            </label>
          </div>
          
          <div v-if="config.geo === 'manual'" class="mt-8 transition-all animate-fade-in-up">
            <input type="text" placeholder="e.g., United States, London, Tokyo" class="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500/30 transition-all shadow-sm" />
          </div>
        </div>

        <!-- Configuration Card: Audience -->
        <div class="bg-white border border-stone-200 rounded-[32px] p-8 shadow-2xl premium-shadow relative overflow-hidden group">
          <div class="flex items-start gap-6 border-b border-stone-100 pb-8 mb-8">
            <div class="p-3 bg-stone-50 rounded-2xl text-slate-900 border border-stone-100 shadow-sm shrink-0">
              <Users class="w-6 h-6" />
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-extrabold text-slate-950 mb-1 tracking-tight">Audience Logic</h3>
              <p class="text-sm font-medium text-slate-400">Define who your high-intent customers are.</p>
            </div>
          </div>

          <div class="grid sm:grid-cols-2 gap-4">
             <label class="cursor-pointer group relative">
              <input type="radio" value="ai" v-model="config.audience" class="sr-only" />
              <div class="p-8 rounded-2xl border-4 transition-all duration-300 flex flex-col items-center gap-4 text-center overflow-hidden h-full"
                   :class="config.audience === 'ai' ? 'border-gold-500 bg-white shadow-2xl scale-[1.02]' : 'border-transparent bg-stone-50/50 hover:border-gold-500/30'">
                <div class="absolute top-4 right-4 transition-opacity duration-300"
                     :class="config.audience === 'ai' ? 'opacity-100' : 'opacity-0'">
                    <div class="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center shadow-lg">
                        <Check class="w-4 h-4 text-white" />
                    </div>
                </div>
                <div class="w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center transition-all duration-500"
                     :class="config.audience === 'ai' ? 'scale-110 bg-slate-950' : 'bg-white'">
                  <Sparkles class="w-7 h-7 transition-colors duration-500" :class="config.audience === 'ai' ? 'text-white' : 'text-slate-950'" />
                </div>
                <div>
                  <div class="font-black text-slate-950 text-base uppercase tracking-widest">AI Mapping</div>
                  <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Dynamic interest clustering</div>
                </div>
              </div>
            </label>

             <label class="cursor-pointer group relative">
              <input type="radio" value="manual" v-model="config.audience" class="sr-only" />
              <div class="p-8 rounded-2xl border-4 transition-all duration-300 flex flex-col items-center gap-4 text-center overflow-hidden h-full"
                   :class="config.audience === 'manual' ? 'border-gold-500 bg-white shadow-2xl scale-[1.02]' : 'border-transparent bg-stone-50/50 hover:border-gold-500/30'">
                <div class="absolute top-4 right-4 transition-opacity duration-300"
                     :class="config.audience === 'manual' ? 'opacity-100' : 'opacity-0'">
                    <div class="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center shadow-lg">
                        <Check class="w-4 h-4 text-white" />
                    </div>
                </div>
                <div class="w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center transition-all duration-500"
                     :class="config.audience === 'manual' ? 'scale-110 bg-slate-950' : 'bg-white'">
                  <Users class="w-7 h-7 transition-colors duration-500" :class="config.audience === 'manual' ? 'text-white' : 'text-slate-950'" />
                </div>
                <div>
                  <div class="font-black text-slate-950 text-base uppercase tracking-widest">Custom Segments</div>
                  <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manual demographic filters</div>
                </div>
              </div>
            </label>
          </div>
          
          <div v-if="config.audience === 'manual'" class="mt-8 transition-all animate-fade-in-up">
            <input type="text" placeholder="e.g., Luxury buyers, Tech enthusiasts" class="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500/30 transition-all shadow-sm" />
          </div>
        </div>

        <!-- Configuration Card: Intent -->
        <div class="bg-white border border-stone-200 rounded-[32px] p-8 shadow-2xl premium-shadow relative overflow-hidden group">
          <div class="flex items-start gap-6 border-b border-stone-100 pb-8 mb-8">
            <div class="p-3 bg-stone-50 rounded-2xl text-slate-900 border border-stone-100 shadow-sm shrink-0">
              <Target class="w-6 h-6" />
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-extrabold text-slate-950 mb-1 tracking-tight">Market Intent</h3>
              <p class="text-sm font-medium text-slate-400">Optimize for reach or conversion precision.</p>
            </div>
          </div>

          <div class="grid sm:grid-cols-3 gap-4">
             <label class="cursor-pointer group relative">
              <input type="radio" value="ai" v-model="config.intent" class="sr-only" />
              <div class="p-6 rounded-2xl border-4 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden h-full"
                   :class="config.intent === 'ai' ? 'border-gold-500 bg-white shadow-xl scale-[1.02]' : 'border-transparent bg-stone-50/50 hover:border-gold-500/30'">
                <div class="absolute top-2 right-2 transition-opacity duration-300"
                     :class="config.intent === 'ai' ? 'opacity-100' : 'opacity-0'">
                    <Check class="w-4 h-4 text-gold-500" />
                </div>
                <Sparkles class="w-6 h-6 mb-2 transition-colors duration-300" 
                          :class="config.intent === 'ai' ? 'text-gold-500' : 'text-slate-400'" />
                <span class="font-black text-[10px] uppercase tracking-[0.1em] transition-colors duration-300"
                      :class="config.intent === 'ai' ? 'text-slate-950' : 'text-slate-400'">Dynamic AI</span>
              </div>
            </label>

            <label class="cursor-pointer group relative">
              <input type="radio" value="broad" v-model="config.intent" class="sr-only" />
              <div class="p-6 rounded-2xl border-4 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden h-full"
                   :class="config.intent === 'broad' ? 'border-gold-500 bg-white shadow-xl scale-[1.02]' : 'border-transparent bg-stone-50/50 hover:border-gold-500/30'">
                <div class="absolute top-2 right-2 transition-opacity duration-300"
                     :class="config.intent === 'broad' ? 'opacity-100' : 'opacity-0'">
                    <Check class="w-4 h-4 text-gold-500" />
                </div>
                <Target class="w-6 h-6 mb-2 transition-colors duration-300" 
                        :class="config.intent === 'broad' ? 'text-gold-500' : 'text-slate-400'" />
                <span class="font-black text-[10px] uppercase tracking-[0.1em] transition-colors duration-300"
                      :class="config.intent === 'broad' ? 'text-slate-950' : 'text-slate-400'">Broad Match</span>
              </div>
            </label>

            <label class="cursor-pointer group relative">
              <input type="radio" value="exact" v-model="config.intent" class="sr-only" />
              <div class="p-6 rounded-2xl border-4 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden h-full"
                   :class="config.intent === 'exact' ? 'border-gold-500 bg-white shadow-xl scale-[1.02]' : 'border-transparent bg-stone-50/50 hover:border-gold-500/30'">
                <div class="absolute top-2 right-2 transition-opacity duration-300"
                     :class="config.intent === 'exact' ? 'opacity-100' : 'opacity-0'">
                    <Check class="w-4 h-4 text-gold-500" />
                </div>
                <Rocket class="w-6 h-6 mb-2 transition-colors duration-300" 
                        :class="config.intent === 'exact' ? 'text-gold-500' : 'text-slate-400'" />
                <span class="font-black text-[10px] uppercase tracking-[0.1em] transition-colors duration-300"
                      :class="config.intent === 'exact' ? 'text-slate-950' : 'text-slate-400'">Exact Match</span>
              </div>
            </label>
          </div>
        </div>

      </div>

      <div class="mt-20 flex justify-center pb-20 animate-fade-in-up" style="animation-delay: 0.2s">
        <button 
          @click="handleGenerate" 
          :disabled="isGenerating"
          class="px-12 py-6 bg-slate-950 hover:bg-slate-900 disabled:opacity-50 text-white font-black rounded-[24px] shadow-2xl shadow-slate-900/20 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center gap-4 relative overflow-hidden group/btn"
        >
          <div class="absolute inset-0 bg-gold-500/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
          <Rocket class="w-6 h-6 text-gold-500" />
          <span class="text-lg uppercase tracking-[0.1em] relative z-10">{{ isGenerating ? 'Computing...' : 'Generate Campaign Model' }}</span>
          <ChevronRight class="w-6 h-6 group-hover/btn:translate-x-1 transition-transform relative z-10" />
        </button>
      </div>
    </main>
  </div>
</template>
