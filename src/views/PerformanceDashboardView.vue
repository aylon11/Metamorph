<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { performanceData } from '../data/dashboardData'
import { 
  ArrowLeft, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  Target,
  Award,
  ExternalLink
} from 'lucide-vue-next'
import Logo from '../components/Logo.vue'

const router = useRouter()
const data = ref(performanceData)

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
const formatNumber = (val) => new Intl.NumberFormat('en-US').format(val)

// Calculate some derived metrics
const googleCPA = computed(() => data.value.googleAds.totals.spend / data.value.googleAds.totals.conversions)
const metaCPA = computed(() => data.value.metaAds.totals.spend / data.value.metaAds.totals.conversions)
const cpaImprovement = computed(() => ((metaCPA.value - googleCPA.value) / metaCPA.value * 100).toFixed(1))

// SVG Chart Setup
const chartWidth = 600
const chartHeight = 200

const curvePointsGoogle = computed(() => {
  let path = ""
  const points = data.value.timeSeriesData
  
  points.forEach((p, i) => {
    const x = (i / (points.length - 1)) * chartWidth
    // Map revenue (0-1500) to Y (200-70)
    const y = 200 - (p.googleRevenue / 1500) * 130
    path += (i === 0 ? "M" : "L") + `${x} ${y}`
  })
  return path
})

const curvePointsMeta = computed(() => {
  let path = ""
  const points = data.value.timeSeriesData
  
  points.forEach((p, i) => {
    const x = (i / (points.length - 1)) * chartWidth
    // Map revenue (0-1500) to Y (200-70)
    const y = 200 - (p.metaRevenue / 1500) * 130
    path += (i === 0 ? "M" : "L") + `${x} ${y}`
  })
  return path
})

const curvePointsOverallRoi = computed(() => {
  let path = ""
  const points = data.value.timeSeriesData
  
  points.forEach((p, i) => {
    const roi = (p.googleRevenue + p.metaRevenue) / (p.googleSpend + p.metaSpend)
    const x = (i / (points.length - 1)) * chartWidth
    // Map ROI (2.25 - 4.625) to Y (50 - 10)
    const y = 50 - ((roi - 2.25) / (4.625 - 2.25)) * 40
    path += (i === 0 ? "M" : "L") + `${x} ${y}`
  })
  return path
})
</script>

<template>
  <div class="min-h-screen bg-stone-50 text-slate-900 font-sans flex flex-col selection:bg-emerald-500/20">
    <!-- Navbar -->
    <nav class="bg-white border-b border-stone-200 z-50 sticky top-0">
      <div class="w-full px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
           <Logo size="w-8 h-8" />
           <span class="text-xl font-extrabold tracking-tight">Metamorph</span>
           <span class="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Live Dashboard</span>
        </div>
        <div class="flex items-center gap-4">
          <button 
            @click="router.push('/')" 
            class="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2"
          >
            <ArrowLeft class="w-4 h-4" /> Back to Home
          </button>
          <div class="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center overflow-hidden shadow-sm">
            <img src="../assets/user_avatar.png" alt="User Profile" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-1 overflow-y-auto custom-scrollbar bg-stone-50/50">
      <div class="max-w-7xl mx-auto py-12 px-8">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 class="text-4xl font-black text-slate-950 tracking-tight mb-2">Campaign Performance</h1>
            <p class="text-slate-500 font-medium">Real-time comparison of your cross-channel deployment</p>
          </div>
          
          <div class="bg-white px-6 py-4 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-6">
            <div>
              <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Funds Diverted</div>
              <div class="text-2xl font-black text-slate-950">{{ formatCurrency(data.summary.fundsDiverted) }}</div>
            </div>
            <div class="h-10 w-px bg-stone-200"></div>
            <div>
              <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ROI Lift</div>
              <div class="text-2xl font-black text-emerald-600 flex items-center gap-1">
                <TrendingUp class="w-5 h-5" /> {{ data.summary.roiLift }}
              </div>
            </div>
          </div>
        </div>

        <!-- High Level Metrics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <!-- Card 1: Spend -->
          <div class="bg-white rounded-[24px] p-6 border border-stone-200 shadow-xl premium-shadow hover:translate-y-[-4px] transition-all">
            <div class="flex justify-between items-start mb-4">
              <div class="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-slate-600">
                <DollarSign class="w-5 h-5" />
              </div>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Spend</span>
            </div>
            <div class="text-3xl font-black text-slate-950 mb-1">{{ formatCurrency(data.summary.totalSpend) }}</div>
            <div class="text-xs font-medium text-slate-500">Across Google & Meta</div>
          </div>

          <!-- Card 2: Revenue -->
          <div class="bg-white rounded-[24px] p-6 border border-stone-200 shadow-xl premium-shadow hover:translate-y-[-4px] transition-all">
            <div class="flex justify-between items-start mb-4">
              <div class="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                <Target class="w-5 h-5" />
              </div>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Revenue</span>
            </div>
            <div class="text-3xl font-black text-slate-950 mb-1">{{ formatCurrency(data.summary.totalRevenue) }}</div>
            <div class="text-xs font-medium text-emerald-600 flex items-center gap-1">
              <ArrowUpRight class="w-3 h-3" /> High Performance
            </div>
          </div>

          <!-- Card 3: Blended ROAS -->
          <div class="bg-white rounded-[24px] p-6 border border-stone-200 shadow-xl premium-shadow hover:translate-y-[-4px] transition-all">
            <div class="flex justify-between items-start mb-4">
              <div class="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                <Award class="w-5 h-5" />
              </div>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blended ROAS</span>
            </div>
            <div class="text-3xl font-black text-slate-950 mb-1">{{ data.summary.blendedRoas }}x</div>
            <div class="text-xs font-medium text-slate-500">Target: 3.0x</div>
          </div>

          <!-- Card 4: Efficiency -->
          <div class="bg-slate-950 text-white rounded-[24px] p-6 shadow-xl premium-shadow hover:translate-y-[-4px] transition-all relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl"></div>
            <div class="flex justify-between items-start mb-4 relative z-10">
              <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400 border border-white/10">
                <Zap class="w-5 h-5" />
              </div>
              <span class="text-[10px] font-black text-white/60 uppercase tracking-widest">CPA Reduction</span>
            </div>
            <div class="text-3xl font-black text-white mb-1">{{ cpaImprovement }}%</div>
            <div class="text-xs font-medium text-emerald-400 flex items-center gap-1 relative z-10">
              On Google vs Meta
            </div>
          </div>
        </div>

        <!-- Comparison Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          
          <!-- Google Ads Block -->
          <div class="bg-white rounded-[32px] border border-stone-200 overflow-hidden shadow-xl premium-shadow group">
            <div class="p-8 border-b border-stone-100 bg-gradient-to-tr from-blue-50/50 to-transparent">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md border border-stone-100 p-2">
                    <svg viewBox="0 0 24 24" class="w-full h-full">
                        <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.6v3.1h3.9c2.28-2.1 3.6-5.2 3.6-8.3z"/>
                        <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.96-2.91l-3.91-3.09c-1.08.72-2.44 1.15-4.05 1.15-3.13 0-5.78-2.11-6.73-4.96h-4.04v3.09C3.655 21.03 7.635 24 12.255 24z"/>
                        <path fill="#FBBC05" d="M5.525 14.2a6.99 6.99(0 0 1 0-4.39v-3.09h-4.04C.695 8.355 0 10.125 0 12s.695 3.645 1.485 5.29l4.04-3.09z"/>
                        <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.62 0-8.6 2.97-10.77 7.29l4.04 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-black text-slate-950">Google Ads</h2>
                    <p class="text-xs text-slate-400 font-bold uppercase tracking-widest">Primary Growth Engine</p>
                  </div>
                </div>
                <span class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 flex items-center gap-1">
                  <Shield class="w-3 h-3" /> Verified
                </span>
              </div>

              <div class="grid grid-cols-3 gap-6 mb-4">
                <div>
                  <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Spend</div>
                  <div class="text-2xl font-black text-slate-950">{{ formatCurrency(data.googleAds.totals.spend) }}</div>
                </div>
                <div>
                  <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conversions</div>
                  <div class="text-2xl font-black text-slate-950">{{ data.googleAds.totals.conversions }}</div>
                </div>
                <div>
                  <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ROAS</div>
                  <div class="text-2xl font-black text-emerald-600">{{ data.googleAds.totals.roas }}x</div>
                </div>
              </div>
            </div>

            <div class="p-8 space-y-4">
              <div v-for="camp in data.googleAds.campaigns" :key="camp.id" class="p-4 bg-stone-50 rounded-2xl border border-stone-100 hover:border-emerald-500/30 transition-colors group/item cursor-pointer overflow-hidden relative">
                <div class="absolute inset-0 bg-white/50 opacity-0 group-hover/item:opacity-100 transition-opacity -z-10"></div>
                <div class="flex justify-between items-center">
                  <div>
                    <div class="text-sm font-bold text-slate-800 flex items-center gap-2">
                      {{ camp.name }}
                      <span class="px-1.5 py-0.5 bg-stone-100 text-stone-500 text-[9px] font-bold uppercase tracking-widest rounded">{{ camp.status }}</span>
                    </div>
                    <div class="text-xs text-slate-400 mt-1">
                      {{ formatNumber(camp.impressions) }} Impr. • {{ formatNumber(camp.clicks) }} Clicks
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-black text-slate-950">{{ formatCurrency(camp.revenue) }}</div>
                    <div class="text-xs font-bold text-emerald-600">{{ camp.roas }}x ROAS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Meta Ads Block -->
          <div class="bg-white rounded-[32px] border border-stone-200 overflow-hidden shadow-xl premium-shadow group">
            <div class="p-8 border-b border-stone-100 bg-gradient-to-tr from-blue-50/50 to-transparent">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-[#0668E1] rounded-xl flex items-center justify-center shadow-md text-white p-2">
                    <svg class="w-full h-full fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-xl font-black text-slate-950">Meta Ads</h2>
                    <p class="text-xs text-slate-400 font-bold uppercase tracking-widest">Top Funnel Feeder</p>
                  </div>
                </div>
                <span class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 flex items-center gap-1">
                  <Shield class="w-3 h-3" /> Verified
                </span>
              </div>

              <div class="grid grid-cols-3 gap-6 mb-4">
                <div>
                  <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Spend</div>
                  <div class="text-2xl font-black text-slate-950">{{ formatCurrency(data.metaAds.totals.spend) }}</div>
                </div>
                <div>
                  <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conversions</div>
                  <div class="text-2xl font-black text-slate-950">{{ data.metaAds.totals.conversions }}</div>
                </div>
                <div>
                  <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ROAS</div>
                  <div class="text-2xl font-black text-slate-900">{{ data.metaAds.totals.roas }}x</div>
                </div>
              </div>
            </div>

            <div class="p-8 space-y-4">
              <div v-for="camp in data.metaAds.campaigns" :key="camp.id" class="p-4 bg-stone-50 rounded-2xl border border-stone-100 hover:border-emerald-500/30 transition-colors group/item cursor-pointer overflow-hidden relative">
                <div class="absolute inset-0 bg-white/50 opacity-0 group-hover/item:opacity-100 transition-opacity -z-10"></div>
                <div class="flex justify-between items-center">
                  <div>
                    <div class="text-sm font-bold text-slate-800 flex items-center gap-2">
                      {{ camp.name }}
                      <span class="px-1.5 py-0.5 bg-stone-100 text-stone-500 text-[9px] font-bold uppercase tracking-widest rounded">{{ camp.status }}</span>
                    </div>
                    <div class="text-xs text-slate-400 mt-1">
                      {{ formatNumber(camp.impressions) }} Impr. • {{ formatNumber(camp.clicks) }} Clicks
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-black text-slate-950">{{ formatCurrency(camp.revenue) }}</div>
                    <div class="text-xs font-bold text-slate-600">{{ camp.roas }}x ROAS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Performance Chart (Time Series) -->
        <div class="bg-white rounded-[32px] border border-stone-200 overflow-hidden shadow-xl premium-shadow mb-16">
          <div class="p-8 border-b border-stone-100 flex justify-between items-center">
            <div>
              <h3 class="text-xl font-black text-slate-950">Revenue Trajectory</h3>
              <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Tracing the impact of fund diversion</p>
            </div>
            <div class="flex gap-4 text-xs font-bold">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span class="text-slate-700">Google Ads</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 bg-stone-400 rounded-full"></span>
                <span class="text-slate-700">Meta Ads</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 bg-emerald-500 rounded-full"></span>
                <span class="text-emerald-700">Overall ROI</span>
              </div>
            </div>
          </div>

          <div class="p-8">
             <div class="relative h-[240px] w-full mb-6 bg-stone-50/30 rounded-2xl p-6">
                <!-- Y-Axis Labels -->
                <div class="absolute left-6 top-6 bottom-6 flex flex-col justify-between text-[10px] font-black text-slate-300 pointer-events-none uppercase tracking-widest py-1">
                    <span>MAX</span>
                    <span>MID</span>
                    <span>0</span>
                </div>

                <div class="ml-12 h-full relative">
                    <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 200">
                        <!-- Grid Lines -->
                        <line x1="0" y1="0" x2="600" y2="0" stroke="#f1f5f9" stroke-dasharray="8 8" stroke-width="2" />
                        <line x1="0" y1="100" x2="600" y2="100" stroke="#f1f5f9" stroke-dasharray="8 8" stroke-width="2" />
                        <line x1="0" y1="200" x2="600" y2="200" stroke="#e2e8f0" stroke-width="2" />

                        <!-- Google Path -->
                        <path 
                            :d="curvePointsGoogle" 
                            fill="none" 
                            stroke="#3B82F6" 
                            stroke-width="4"
                            stroke-linecap="round"
                            class="drop-shadow-lg"
                        />
                        
                        <!-- Meta Path -->
                        <path 
                            :d="curvePointsMeta" 
                            fill="none" 
                            stroke="#94A3B8" 
                            stroke-width="3"
                            stroke-linecap="round"
                            stroke-dasharray="5 5"
                            class="opacity-80"
                        />
                        
                        <!-- Overall ROI Path -->
                        <path 
                            :d="curvePointsOverallRoi" 
                            fill="none" 
                            stroke="#10B981" 
                            stroke-width="5"
                            stroke-linecap="round"
                            class="drop-shadow-lg"
                        />
                    </svg>
                </div>
             </div>

             <div class="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-12 px-6">
               <span v-for="p in data.timeSeriesData" :key="p.date">{{ p.date.split('-')[2] }} APR</span>
             </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex justify-center gap-6">
          <button 
            @click="router.push('/')"
            class="px-8 py-4 bg-white border border-stone-200 hover:bg-stone-50 text-slate-900 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-stone-200/50 flex items-center gap-2"
          >
            Return to Home
          </button>
          <button 
            @click="router.push('/connect')"
            class="px-8 py-4 bg-slate-950 hover:bg-slate-800 text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-950/10 flex items-center gap-2 group"
          >
            Deploy More Campaigns
            <ArrowUpRight class="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
.premium-shadow {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
}
</style>
