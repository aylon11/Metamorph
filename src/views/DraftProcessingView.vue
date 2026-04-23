<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Layers, Sparkles, TrendingUp, CheckCircle, PackageSearch } from 'lucide-vue-next'
import { optimizedAdPreviews, optimizedKeywords, isDataLoaded } from '../data/sharedState'
import { metaCampaigns, extractedAssets } from '../data/metaIngestion'

const router = useRouter()
const progress = ref(0)
const currentStepIndex = ref(0) 

const steps = [
  { icon: PackageSearch, text: "Optimizing Assets", subtext: "Adapting creative for high search intent..." },
  { icon: Sparkles, text: "Generating Keywords", subtext: "Expanding seed words via dynamic AI..." },
  { icon: TrendingUp, text: "Forecasting Revenue", subtext: "Calculating ROAS projections..." },
  { icon: CheckCircle, text: "Finalizing Draft", subtext: "Preparing premium dashboard view..." }
]

const currentStep = computed(() => steps[currentStepIndex.value])

onMounted(async () => {
  // Start progress simulation
  const interval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += 0.5
      
      if (progress.value < 35) currentStepIndex.value = 0
      else if (progress.value < 60) currentStepIndex.value = 1
      else if (progress.value < 85) currentStepIndex.value = 2
      else currentStepIndex.value = 3
    }
  }, 100)
  
  try {
    const campaignsData = metaCampaigns.map(c => ({
      id: c.id,
      name: c.name,
      assets: {
        headlines: [...extractedAssets.headlines, c.name]
      }
    }))
    
    const response = await fetch('http://localhost:3000/api/reoptimize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ campaigns: campaignsData })
    })
    
    const data = await response.json()
    
    const adPreviews = {}
    const keywords = {}
    
    for (const campaignId in data) {
      const campaignData = data[campaignId]
      adPreviews[campaignId] = {
        headlines: campaignData.headlines || [],
        descriptions: campaignData.descriptions || []
      }
      keywords[campaignId] = campaignData.keywords || []
    }
    
    optimizedAdPreviews.value = adPreviews
    optimizedKeywords.value = keywords
    isDataLoaded.value = true
    
    // Complete progress
    clearInterval(interval)
    progress.value = 100
    currentStepIndex.value = 3
    
    setTimeout(() => router.push('/dashboard'), 500)
    
  } catch (error) {
    console.error('Failed to optimize assets:', error);
    clearInterval(interval)
    setTimeout(() => router.push('/dashboard'), 500)
  }
})
</script>

<template>
  <div class="min-h-screen bg-stone-50 text-slate-900 flex flex-col items-center justify-center relative overflow-hidden selection:bg-emerald-500/20">
    
    <!-- Background Ambient Effects -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div class="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-slate-900/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
    </div>

    <div class="z-10 w-full max-w-lg flex flex-col items-center p-8">
      
      <!-- Central Animation Hub -->
      <div class="relative w-64 h-64 mb-16 flex items-center justify-center">
         <!-- Geometric Rings -->
         <div class="absolute inset-0 border border-emerald-500/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
         <div class="absolute inset-8 border border-slate-950/5 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
         <div class="absolute inset-16 border-2 border-dashed border-emerald-500/10 rounded-full animate-[spin_30s_linear_infinite]"></div>
         
         <!-- Core -->
         <div class="w-32 h-32 bg-white rounded-[40px] shadow-2xl premium-shadow border border-stone-100 flex items-center justify-center relative z-10 group overflow-hidden">
            <div class="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <component 
                :is="currentStep.icon" 
                class="w-12 h-12 text-slate-950 transition-all duration-700"
                :class="{'scale-110 rotate-3': progress > 1}"
            />
         </div>

         <!-- Orbiting Particles -->
         <div class="absolute inset-0 animate-[spin_8s_linear_infinite]">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
         </div>
         <div class="absolute inset-0 animate-[spin_12s_linear_infinite_reverse]">
            <div class="absolute bottom-4 left-1/4 w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
         </div>
      </div>

      <!-- Text Content -->
      <div class="text-center space-y-4 mb-16 h-28 max-w-sm">
        <h2 class="text-3xl font-black text-slate-950 tracking-tighter uppercase italic">
          {{ currentStep.text }}
        </h2>
        <div class="flex flex-col items-center gap-2">
            <p class="text-lg text-slate-500 font-medium leading-relaxed">
              {{ currentStep.subtext }}
            </p>
        </div>
      </div>

      <!-- Progress Matrix -->
      <div class="w-full space-y-8">
        <!-- Step Visualization -->
        <div class="flex justify-between relative px-2">
            <!-- Connector Line -->
            <div class="absolute top-1.5 left-6 right-6 h-0.5 bg-stone-200">
                <div 
                    class="h-full bg-slate-950 transition-all duration-500 ease-in-out"
                    :style="{ width: `${progress}%` }"
                ></div>
            </div>

            <div 
                v-for="(step, index) in steps"
                :key="index"
                class="relative z-10"
            >
                <div 
                    class="w-3.5 h-3.5 rounded-full border-2 transition-all duration-500"
                    :class="[
                        index === currentStepIndex ? 'bg-white border-emerald-500 scale-125 shadow-lg' : 
                        index < currentStepIndex ? 'bg-slate-950 border-slate-950' : 'bg-white border-stone-200'
                    ]"
                ></div>
            </div>
        </div>

        <!-- Metric Readout -->
        <div class="bg-white border border-stone-200 rounded-2xl p-6 shadow-xl premium-shadow flex items-center justify-between">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center border border-stone-100">
                    <span class="text-xs font-black text-slate-400">P-{{ Math.round(progress) }}</span>
                </div>
                <div>
                    <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Efficiency</div>
                    <div class="text-sm font-black text-slate-900 uppercase">Optimizing ROAS</div>
                </div>
            </div>
            <div class="text-right">
                <div class="text-2xl font-black text-slate-950 tracking-tighter">{{ Math.round(progress) }}%</div>
            </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
@keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>
