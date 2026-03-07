<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Settings, MapPin, Users, Target, Rocket, Sparkles, ChevronRight } from 'lucide-vue-next'
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
  }, 300)
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
        <div class="px-3 py-1 bg-purple-900/30 border border-purple-500/30 rounded-full text-xs font-medium text-purple-300">
          Campaign Configuration
        </div>
      </div>
    </nav>

    <main class="flex-1 max-w-4xl mx-auto w-full p-8 py-12">
      <div class="mb-10 text-center space-y-4">
        <div class="inline-flex p-3 bg-blue-500/10 rounded-2xl text-blue-400 mb-2">
          <Settings class="w-8 h-8" />
        </div>
        <h1 class="text-4xl font-bold text-white">Configure Your Campaign</h1>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          Fine-tune the settings for your new Google Ads campaign. You can override choices manually or let Metamorph's AI analyze your assets and historical data to pick the best configurations.
        </p>
      </div>

      <div class="space-y-6">
        <!-- Configuration Card: Geo -->
        <div class="bg-[#1e293b] border border-gray-700 rounded-2xl p-6 transition-all focus-within:ring-2 focus-within:ring-blue-500/50">
          <div class="flex items-start gap-4 mb-4">
            <div class="p-2 bg-blue-500/10 rounded-lg text-blue-400 shrink-0">
              <MapPin class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-white mb-1">Geographic Targeting</h3>
              <p class="text-sm text-gray-400 mb-4">Specify where your ads should appear. Leave to AI to target top-performing regions from Meta.</p>
              
              <div class="flex flex-col sm:flex-row gap-4">
                <label class="flex-1 cursor-pointer">
                  <input type="radio" value="ai" v-model="config.geo" class="peer sr-only" />
                  <div class="p-4 rounded-xl border border-gray-700 bg-slate-900/50 peer-checked:border-blue-500 peer-checked:bg-blue-900/20 hover:border-blue-500/50 transition-all flex items-center justify-center gap-2">
                    <Sparkles class="w-4 h-4 text-blue-400" />
                    <span class="font-medium">Leave it to AI</span>
                  </div>
                </label>
                <label class="flex-1 cursor-pointer">
                  <input type="radio" value="manual" v-model="config.geo" class="peer sr-only" />
                  <div class="p-4 rounded-xl border border-gray-700 bg-slate-900/50 peer-checked:border-blue-500 peer-checked:bg-blue-900/20 hover:border-blue-500/50 transition-all flex items-center justify-center">
                    <span class="font-medium">Set Manually</span>
                  </div>
                </label>
              </div>
              
              <div v-if="config.geo === 'manual'" class="mt-4 animate-fade-in-down">
                <input type="text" placeholder="e.g., United States, Canada, London" class="w-full bg-slate-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <!-- Configuration Card: Audience -->
        <div class="bg-[#1e293b] border border-gray-700 rounded-2xl p-6 transition-all focus-within:ring-2 focus-within:ring-purple-500/50">
          <div class="flex items-start gap-4 mb-4">
            <div class="p-2 bg-purple-500/10 rounded-lg text-purple-400 shrink-0">
              <Users class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-white mb-1">Target Audiences</h3>
              <p class="text-sm text-gray-400 mb-4">Define who should see your ads. AI will map your Meta audiences to the best Google equivalents.</p>
              
              <div class="flex flex-col sm:flex-row gap-4">
                <label class="flex-1 cursor-pointer">
                  <input type="radio" value="ai" v-model="config.audience" class="peer sr-only" />
                  <div class="p-4 rounded-xl border border-gray-700 bg-slate-900/50 peer-checked:border-purple-500 peer-checked:bg-purple-900/20 hover:border-purple-500/50 transition-all flex items-center justify-center gap-2">
                    <Sparkles class="w-4 h-4 text-purple-400" />
                    <span class="font-medium">Leave it to AI</span>
                  </div>
                </label>
                <label class="flex-1 cursor-pointer">
                  <input type="radio" value="manual" v-model="config.audience" class="peer sr-only" />
                  <div class="p-4 rounded-xl border border-gray-700 bg-slate-900/50 peer-checked:border-purple-500 peer-checked:bg-purple-900/20 hover:border-purple-500/50 transition-all flex items-center justify-center">
                    <span class="font-medium">Set Manually</span>
                  </div>
                </label>
              </div>
              
              <div v-if="config.audience === 'manual'" class="mt-4 animate-fade-in-down">
                <input type="text" placeholder="e.g., Plant Lovers, Home Decor, Ages 25-45" class="w-full bg-slate-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <!-- Configuration Card: Intent -->
        <div class="bg-[#1e293b] border border-gray-700 rounded-2xl p-6 transition-all focus-within:ring-2 focus-within:ring-pink-500/50">
          <div class="flex items-start gap-4 mb-4">
            <div class="p-2 bg-pink-500/10 rounded-lg text-pink-400 shrink-0">
              <Target class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-white mb-1">Intent Type</h3>
              <p class="text-sm text-gray-400 mb-4">How should we target keywords? Broad match for reach, or exact match for precision.</p>
              
              <div class="flex flex-col sm:flex-row gap-4">
                <label class="flex-1 cursor-pointer">
                  <input type="radio" value="ai" v-model="config.intent" class="peer sr-only" />
                  <div class="p-4 rounded-xl border border-gray-700 bg-slate-900/50 peer-checked:border-pink-500 peer-checked:bg-pink-900/20 hover:border-pink-500/50 transition-all flex items-center justify-center gap-2">
                    <Sparkles class="w-4 h-4 text-pink-400" />
                    <span class="font-medium">Leave it to AI</span>
                  </div>
                </label>
                <label class="flex-1 cursor-pointer">
                  <input type="radio" value="broad" v-model="config.intent" class="peer sr-only" />
                  <div class="p-4 rounded-xl border border-gray-700 bg-slate-900/50 peer-checked:border-pink-500 peer-checked:bg-pink-900/20 hover:border-pink-500/50 transition-all flex items-center justify-center">
                    <span class="font-medium">Broad (Reach)</span>
                  </div>
                </label>
                <label class="flex-1 cursor-pointer">
                  <input type="radio" value="exact" v-model="config.intent" class="peer sr-only" />
                  <div class="p-4 rounded-xl border border-gray-700 bg-slate-900/50 peer-checked:border-pink-500 peer-checked:bg-pink-900/20 hover:border-pink-500/50 transition-all flex items-center justify-center">
                    <span class="font-medium">Exact (Precision)</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="mt-12 flex justify-center">
        <button 
          @click="handleGenerate"
          :disabled="isGenerating"
          class="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white text-xl font-bold rounded-2xl shadow-xl shadow-blue-900/20 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-4 relative overflow-hidden group"
        >
          <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <Rocket class="w-6 h-6" />
          <span>{{ isGenerating ? 'Preparing...' : 'Generate Draft' }}</span>
          <ChevronRight class="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.animate-fade-in-down {
  animation: fade-in-down 0.3s ease-out;
}
@keyframes fade-in-down {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>
