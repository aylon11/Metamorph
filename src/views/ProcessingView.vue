<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Zap, Brain, Sparkles, Database } from 'lucide-vue-next'

const router = useRouter()
const progress = ref(0)
const currentStepIndex = ref(0) 

const steps = [
  { icon: Zap, text: "Ingesting Meta Data", subtext: "Establishing secure link to Graph API..." },
  { icon: Brain, text: "Analyzing Creatives", subtext: "Processing vision models for aesthetic scoring..." },
  { icon: Sparkles, text: "Extracting Assets", subtext: "Identifying highest-performing media and text..." }
]

const currentStep = computed(() => steps[currentStepIndex.value])

onMounted(() => {
  const interval = setInterval(() => {
    progress.value += 0.5
    
    if (progress.value < 33) currentStepIndex.value = 0
    else if (progress.value < 66) currentStepIndex.value = 1
    else currentStepIndex.value = 2

    if (progress.value >= 100) {
      clearInterval(interval)
      setTimeout(() => router.push('/assets'), 500)
    }
  }, 34) 
})
</script>

<template>
  <div class="min-h-screen bg-stone-50 text-slate-900 flex flex-col items-center justify-center relative overflow-hidden selection:bg-emerald-500/20">
    
    <!-- Background Ambient Effects -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
    </div>

    <div class="z-10 w-full max-w-lg flex flex-col items-center p-8">
      
      <!-- Central Animation Hub -->
      <div class="relative w-64 h-64 mb-16 flex items-center justify-center">
         <!-- Data Pulse Rings -->
         <div class="absolute inset-0 border border-slate-900/5 rounded-full animate-[spin_25s_linear_infinite]"></div>
         <div class="absolute inset-8 border border-emerald-500/10 rounded-full animate-[spin_10s_linear_infinite_reverse]"></div>
         
         <!-- Core Scanner -->
         <div class="w-32 h-32 bg-white rounded-[40px] shadow-2xl premium-shadow border border-stone-100 flex items-center justify-center relative z-10 overflow-hidden">
            <div class="absolute inset-0 bg-linear-to-tr from-blue-500/5 to-transparent"></div>
            <!-- Scanning Line -->
            <div class="absolute top-0 left-0 w-full h-1 bg-emerald-500/30 blur-sm animate-[bounce_3s_infinite] opacity-50"></div>
            
            <component 
                :is="currentStep.icon" 
                class="w-10 h-10 text-slate-950 transition-all duration-1000"
                :class="{'scale-125': progress % 10 > 5}"
            />
         </div>

         <!-- Orbiting Nodes -->
         <div class="absolute inset-0 animate-[spin_6s_linear_infinite]">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-500 border border-emerald-500 rounded-lg shadow-xl shadow-emerald-500/40 rotate-45"></div>
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
            <!-- Connector -->
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
                        index < currentStepIndex ? 'bg-slate-900 border-slate-900' : 'bg-white border-stone-200'
                    ]"
                ></div>
            </div>
        </div>

        <!-- Metric Readout -->
        <div class="bg-white border border-stone-200 rounded-2xl p-6 shadow-xl premium-shadow flex items-center justify-between">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center border border-stone-100">
                    <Database class="w-4 h-4 text-slate-400" />
                </div>
                <div>
                    <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Network</div>
                    <div class="text-sm font-black text-slate-950 uppercase tracking-tight">Syncing Meta Assets</div>
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
