<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Layers, Sparkles, TrendingUp, CheckCircle, PackageSearch } from 'lucide-vue-next'
import { useMotion } from '@vueuse/motion'

const router = useRouter()
const progress = ref(0)
const currentStepIndex = ref(0) 

const steps = [
  { icon: PackageSearch, text: "Re-optimizing Assets for Google Search", subtext: "Adapting Meta creative for high search intent..." },
  { icon: Sparkles, text: "Generating Google Keywords", subtext: "Expanding seed words via AI..." },
  { icon: TrendingUp, text: "Forecasting Revenue Lift", subtext: "Calculating ROAS projections..." },
  { icon: CheckCircle, text: "Finalizing Draft", subtext: "Preparing dashboard view..." }
]

const currentStep = computed(() => steps[currentStepIndex.value])

onMounted(() => {
  const interval = setInterval(() => {
    progress.value += 0.25 // Progress (takes ~16s total)
    
    // Step logic
    if (progress.value < 25) currentStepIndex.value = 0
    else if (progress.value < 50) currentStepIndex.value = 1
    else if (progress.value < 75) currentStepIndex.value = 2
    else currentStepIndex.value = 3

    if (progress.value >= 100) {
      clearInterval(interval)
      setTimeout(() => router.push('/dashboard'), 500)
    }
  }, 40) 
})
</script>

<template>
  <div class="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center relative overflow-hidden">
    
    <!-- Background Ambient Effects -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div class="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
    </div>

    <div class="z-10 w-full max-w-md flex flex-col items-center">
      
      <!-- Central Animation -->
      <div class="relative w-48 h-48 mb-12 flex items-center justify-center">
         <!-- Outer Rings -->
         <div class="absolute inset-0 border border-green-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
         <div class="absolute inset-4 border border-blue-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
         
         <!-- Glowing Morphing Core -->
         <div 
            class="w-24 h-24 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded-full blur-md animate-pulse-fast shadow-[0_0_50px_rgba(59,130,246,0.5)]"
            v-motion
            :initial="{ scale: 0.8, opacity: 0.5 }"
            :enter="{ scale: 1, opacity: 1, transition: { repeat: Infinity, repeatType: 'reverse', duration: 2000 } }"
         ></div>

         <!-- Icon Overlay -->
         <div class="absolute inset-0 flex items-center justify-center">
            <component 
                :is="currentStep.icon" 
                class="w-10 h-10 text-white drop-shadow-lg"
                v-motion
                :key="currentStepIndex"
                :initial="{ opacity: 0, scale: 0.5 }"
                :enter="{ opacity: 1, scale: 1 }"
            />
         </div>
      </div>

      <!-- Text Content -->
      <div class="text-center space-y-2 mb-12 h-20">
        <h2 
            class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-200 via-white to-blue-200"
            v-motion
            :key="currentStep.text"
            :initial="{ opacity: 0, y: 10 }"
            :enter="{ opacity: 1, y: 0 }"
        >
          {{ currentStep.text }}
        </h2>
        <p 
            class="text-sm text-blue-300/80 font-mono"
            v-motion
            :key="currentStep.subtext"
            :initial="{ opacity: 0 }"
            :enter="{ opacity: 1, transition: { delay: 200 } }"
        >
          > {{ currentStep.subtext }}<span class="animate-pulse">_</span>
        </p>
      </div>

      <!-- Progress Indicators -->
      <div class="w-full space-y-6">
        <!-- Step Dots -->
        <div class="flex justify-between px-8">
            <div 
                v-for="(step, index) in steps" 
                :key="index"
                class="flex flex-col items-center gap-2"
            >
                <div 
                    class="w-3 h-3 rounded-full transition-all duration-500 border border-white/10"
                    :class="[
                        index === currentStepIndex ? 'bg-green-500 scale-125 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 
                        index < currentStepIndex ? 'bg-blue-500' : 'bg-gray-800'
                    ]"
                ></div>
            </div>
        </div>

        <!-- Progress Bar -->
        <div class="relative w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
                class="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transition-all duration-300 ease-out shadow-[0_0_20px_rgba(59,130,246,0.8)]"
                :style="{ width: `${progress}%` }"
            ></div>
            <!-- Glint effect -->
            <div 
                class="absolute top-0 h-full w-20 bg-white/50 blur-sm transform skew-x-12 translate-x-[-100%]"
                :style="{ left: `${progress}%` }"
            ></div>
        </div>
        
        <div class="flex justify-between text-[10px] text-gray-500 font-mono uppercase tracking-widest px-1">
            <span>Progress</span>
            <span>{{ Math.round(progress) }}%</span>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-pulse-slow {
    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.animate-pulse-fast {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
