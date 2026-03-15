<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { metaCampaigns, recommendedGoogleCampaigns, impactForecast, extractedAssets, businessProfile } from '../data/mockData'
import { 
  ArrowRight, 
  TrendingUp, 
  CheckCircle, 
  Search, 
  MoreHorizontal, 
  Heart, 
  MessageCircle, 
  Send, 
  Loader2,
  ChevronDown,
  Layers,
  DollarSign,
  X,
  Plus,
  Info,
  RefreshCw
} from 'lucide-vue-next'
import Logo from '../components/Logo.vue'

const router = useRouter()
const showForecast = ref(false)
const selectedCampaignIds = ref([metaCampaigns[0].id])
const isMorphing = ref(false)
const userBudget = ref(500) // Default budget
const isLaunching = ref(false)
const launchSuccess = ref(false)
const isGoogleAuthenticated = ref(false)
const isSigningIn = ref(false)
const showLaunchModal = ref(false)
const isAiMaxEnabled = ref(false)

const selectedCampaigns = computed(() => 
  metaCampaigns.filter(c => selectedCampaignIds.value.includes(c.id))
)

const toggleCampaign = (id) => {
  if (selectedCampaignIds.value.includes(id)) {
    if (selectedCampaignIds.value.length > 1) {
      selectedCampaignIds.value = selectedCampaignIds.value.filter(cid => cid !== id)
    }
  } else {
    selectedCampaignIds.value.push(id)
  }
}

// Image Extensions Logic
const removedImages = ref(new Set())

const relevantImages = computed(() => {
  const images = []
  metaCampaigns.forEach((campaign, index) => {
     if (selectedCampaignIds.value.includes(campaign.id)) {
         const imgUrl = extractedAssets.images[index % extractedAssets.images.length]
         if (!images.includes(imgUrl)) {
             images.push(imgUrl)
         }
     }
  })
  return images
})

const visibleImages = computed(() => 
  relevantImages.value.filter(img => !removedImages.value.has(img))
)

const removeImage = (img) => {
  removedImages.value.add(img)
}

const resetImages = () => {
    removedImages.value.clear()
}

/* Chart Logic */
const chartWidth = 600
const chartHeight = 200
const maxBudget = 1500

const curvePoints = computed(() => {
  let path = ""
  for (let b = 0; b <= maxBudget; b += 15) {
    const x = (b / maxBudget) * chartWidth
    const revenue = calculateRevenue(b)
    const y = chartHeight - (revenue / 12000) * chartHeight 
    path += (b === 0 ? "M" : "L") + `${x} ${y}`
  }
  return path
})

const calculateRevenue = (budget) => {
  const roas = 10 * Math.exp(-0.0005 * budget) 
  return budget * roas
}

const calculatedForecast = computed(() => {
  const baseRevenue = calculateRevenue(userBudget.value)
  const revenue = isAiMaxEnabled.value ? baseRevenue * 1.15 : baseRevenue
  return {
    revenue: revenue,
    incremental: Math.max(0, revenue - 2000),
    roas: (revenue / (userBudget.value || 1)).toFixed(1)
  }
})

const chartSelectionX = computed(() => {
  return (userBudget.value / maxBudget) * chartWidth
})

const updateBudgetFromChart = (event) => {
   const rect = event.currentTarget.getBoundingClientRect()
   const x = event.clientX - rect.left
   const val = Math.max(0, Math.min(maxBudget, Math.round((x / chartWidth) * maxBudget)))
   userBudget.value = val
}

const accountStructure = computed(() => {
    const baseStructure = [
        {
            name: "Brand Protection",
            adGroups: [
                { name: "Brand - Mobile", device: "Ad Group" },
                { name: "Brand - Desktop", device: "Ad Group" }
            ]
        }
    ]

    const dynamicCampaigns = selectedCampaigns.value.map(c => ({
        name: c.name.replace(' - Instagram Boost', '').replace('Retargeting', 'Search'),
        adGroups: [
            { name: "Generic - Mobile", device: "Ad Group" },
            { name: "Generic - Desktop", device: "Ad Group" }
        ]
    }))

    return [...baseStructure, ...dynamicCampaigns]
})

const googleAdPreviews = computed(() => {
  return selectedCampaigns.value.map(campaign => {
    if (campaign.id === 'meta_2') {
      return {
        id: campaign.id,
        headline: "Rare Philodendrons | Exotic Indoor Plants",
        description: "Shop our exclusive collection of rare Philodendrons. Hand-picked, healthy plants delivered to your door. 30-day health guarantee.",
        keywords: ["buy philodendron online", "rare house plants", "exotic indoor plants", "philodendron pink princess"],
        sitelinks: ["New Arrivals", "Care Guides", "Plant Subscription", "Gift Cards"]
      }
    }
    return {
      id: campaign.id,
      headline: campaign.id === 'meta_3' ? "Large Indoor Plants | 15% Off First Order" : "Buy Monstera Deliciosa | 20% Off Indoor Plants",
      description: campaign.id === 'meta_3' ? "Transform your space with big, beautiful statement plants. Delivered safely to your living room." : "Shop premium Monstera plants at Urban Roots. Fast shipping, expert care tips, and a 30-day health guarantee. Bring the jungle home today.",
      keywords: campaign.id === 'meta_3' ? ["large indoor plants", "statement plants", "fiddle leaf fig buy", "bird of paradise"] : ["buy monstera plant", "indoor plants near me", "monstera deliciosa sale", "large house plants", "urban roots nursery"],
      sitelinks: ["Shop All Plants", "Care Guides", "Store Locator", "Sale Items"]
    }
  })
})

const removedKeywords = ref(new Set())
const manuallyAddedKeywords = ref([])
const newKeywordInput = ref('')

const activeKeywords = computed(() => {
  const allKws = googleAdPreviews.value.flatMap(ad => ad.keywords)
  const uniqueKws = [...new Set(allKws)]
  const filtered = uniqueKws.filter(kw => !removedKeywords.value.has(kw))
  return [...new Set([...filtered, ...manuallyAddedKeywords.value])]
})

const removeKeyword = (kw) => {
  if (manuallyAddedKeywords.value.includes(kw)) {
    manuallyAddedKeywords.value = manuallyAddedKeywords.value.filter(k => k !== kw)
  } else {
    removedKeywords.value.add(kw)
  }
}

const addKeyword = () => {
  const val = newKeywordInput.value.trim()
  if (val && !activeKeywords.value.includes(val)) {
    manuallyAddedKeywords.value.push(val)
    if (removedKeywords.value.has(val)) {
      removedKeywords.value.delete(val)
    }
  }
  newKeywordInput.value = ''
}

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)

const handleSignIn = () => {
    isSigningIn.value = true
    setTimeout(() => {
        isGoogleAuthenticated.value = true
        isSigningIn.value = false
    }, 1500)
}

const handleLaunch = () => {
    if (isLaunching.value || launchSuccess.value) return
    isLaunching.value = true
    setTimeout(() => {
        isLaunching.value = false
        launchSuccess.value = true
        showLaunchModal.value = false
    }, 2500)
}
</script>

<template>
  <div class="min-h-screen bg-stone-50 text-slate-900 font-sans flex flex-col selection:bg-gold-500/20">
    <!-- Navbar -->
    <nav class="bg-white border-b border-stone-200 z-50">
      <div class="w-full px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
           <Logo size="w-7 h-7" />
           <span class="text-xl font-extrabold tracking-tight">Metamorph</span>
        </div>
        <div class="flex items-center gap-4">
          <div class="px-3 py-1.5 bg-stone-100/50 border border-stone-200 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse"></span>
            AI Engine Active
          </div>
          <div class="w-8 h-8 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center text-xs font-bold text-stone-600">
            UR
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-1 flex overflow-hidden">
        
        <!-- Sidebar: Meta Information -->
        <aside class="w-96 bg-white border-r border-stone-200 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
            <div class="p-8 pb-4">
                <div class="flex items-center justify-between mb-8">
                    <div class="flex items-center gap-3">
                        <div class="w-7 h-7 rounded-lg bg-[#0668E1] flex items-center justify-center shadow-lg shadow-blue-500/10">
                            <svg class="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </div>
                        <span class="font-extrabold text-slate-900 tracking-tight">Meta Feed</span>
                    </div>
                    <span class="px-2 py-1 bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-green-100">Live</span>
                </div>

                <div class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Select Campaigns</div>
            </div>

            <div class="px-8 pb-8 space-y-8">
                <div 
                    v-for="(campaign, index) in metaCampaigns" 
                    :key="campaign.id"
                    class="bg-white rounded-[24px] overflow-hidden shadow-xl border-2 transition-all duration-300 cursor-pointer relative group premium-shadow"
                    :class="selectedCampaignIds.includes(campaign.id) ? 'border-gold-500 bg-stone-50/50 scale-[1.02]' : 'border-transparent hover:border-stone-200'"
                    @click="toggleCampaign(campaign.id)"
                >
                    <div v-if="selectedCampaignIds.includes(campaign.id)" class="absolute top-4 right-4 z-20 bg-gold-500 text-white rounded-full p-0.5 shadow-lg animate-fade-in-up">
                        <CheckCircle class="w-5 h-5" />
                    </div>

                    <div class="p-4 flex items-center gap-3">
                         <div class="w-9 h-9 bg-stone-100 rounded-xl flex items-center justify-center text-stone-500 font-bold text-xs border border-stone-200">UR</div>
                         <div class="flex-1">
                             <div class="text-xs font-bold text-slate-900">Urban Roots</div>
                             <div class="text-[10px] text-slate-400 tracking-wide font-medium uppercase">{{ campaign.platform }} • Sponsored</div>
                         </div>
                         <button class="p-1 hover:bg-stone-100 rounded-lg transition-colors">
                           <MoreHorizontal class="w-4 h-4 text-stone-400" />
                         </button>
                    </div>
                    <div class="aspect-square bg-stone-100 relative group-hover:brightness-105 transition-all">
                        <img 
                            :src="extractedAssets.images[index % extractedAssets.images.length]" 
                            class="w-full h-full object-cover" 
                            alt="Campaign Asset" 
                        />
                    </div>
                     <div class="p-4 bg-white border-t border-stone-100 flex justify-between items-center group-hover:bg-stone-50 transition-colors">
                        <span class="text-xs font-extrabold text-slate-900 uppercase tracking-widest">Shop Now</span>
                        <ArrowRight class="w-4 h-4 text-gold-500" />
                    </div>
                    <div class="p-4 pt-0 space-y-3">
                         <div class="flex gap-4">
                            <Heart class="w-5 h-5 text-slate-900 hover:text-red-500 transition-colors cursor-pointer" />
                            <MessageCircle class="w-5 h-5 text-slate-900 hover:text-blue-500 transition-colors cursor-pointer" />
                            <Send class="w-5 h-5 text-slate-900 hover:text-gold-500 transition-colors cursor-pointer" />
                         </div>
                        <div class="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            <span class="font-bold text-slate-950">urbanroots</span> {{ extractedAssets.headlines[index % extractedAssets.headlines.length] }} 🌿 #plants #sustainable
                        </div>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main Content: Google Transformation -->
        <div class="flex-1 overflow-y-auto custom-scrollbar bg-stone-50/50">
          <div class="max-w-4xl mx-auto py-12 px-8">
                
                <div class="flex items-center justify-between mb-8">
                  <div>
                    <h1 class="text-3xl font-black text-slate-950 tracking-tight">Campaign Metamorphosis</h1>
                    <p class="text-slate-500 font-medium mt-1">AI-powered translation to Google Ads infrastructure</p>
                  </div>
                  <div class="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-stone-200">
                    <span class="text-xs font-bold text-slate-400">STATUS:</span>
                    <span class="text-xs font-black text-gold-600 uppercase tracking-widest">Optimizing</span>
                  </div>
                </div>

                <!-- Google Ad Cards -->
                <div class="space-y-10 mb-12">
                   <div class="flex items-center gap-3">
                        <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ad Drafts</h4>
                        <div class="h-px bg-stone-200 flex-1"></div>
                    </div>

                    <div 
                        v-for="ad in googleAdPreviews" 
                        :key="ad.id"
                        class="transform transition-all duration-700 hover:translate-y-[-4px]" 
                        :class="isMorphing ? 'opacity-50 scale-95 blur-sm' : 'opacity-100 scale-100'"
                    >
                        <div class="bg-white rounded-[24px] p-8 shadow-2xl premium-shadow relative border border-white">
                             <div class="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl z-10 border border-stone-100 p-2.5 hover:rotate-6 transition-transform">
                                <svg viewBox="0 0 24 24" class="w-full h-full">
                                    <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.6v3.1h3.9c2.28-2.1 3.6-5.2 3.6-8.3z"/>
                                    <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.96-2.91l-3.91-3.09c-1.08.72-2.44 1.15-4.05 1.15-3.13 0-5.78-2.11-6.73-4.96h-4.04v3.09C3.655 21.03 7.635 24 12.255 24z"/>
                                    <path fill="#FBBC05" d="M5.525 14.2a6.99 6.99(0 0 1 0-4.39v-3.09h-4.04C.695 8.355 0 10.125 0 12s.695 3.645 1.485 5.29l4.04-3.09z"/>
                                    <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.62 0-8.6 2.97-10.77 7.29l4.04 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
                                </svg>
                             </div>

                            <div class="flex items-center gap-3 mb-6">
                                 <div class="w-10 h-10 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                                    <Logo size="w-full h-full" />
                                 </div>
                                 <div class="flex flex-col">
                                    <span class="text-sm font-black text-slate-950">{{ businessProfile.name }}</span>
                                    <span class="text-xs text-slate-500 font-medium">{{ businessProfile.website.replace('https://', '') }}</span>
                                 </div>
                                 <div class="ml-auto flex items-center gap-2">
                                   <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-1 bg-stone-50 rounded-lg">Sponsored</span>
                                 </div>
                            </div>

                            <div class="space-y-3">
                                <h3 class="text-2xl text-[#1a0dab] hover:text-[#1906a3] cursor-pointer font-bold leading-tight underline decoration-transparent hover:decoration-[#1906a3] transition-all">
                                    {{ ad.headline }}
                                </h3>
                                <p class="text-base text-slate-600 leading-relaxed max-w-2xl font-medium">
                                    {{ ad.description }}
                                </p>
                            </div>

                            <div class="mt-8 pt-8 border-t border-stone-100 flex flex-wrap gap-x-8 gap-y-3">
                                 <span v-for="link in ad.sitelinks" :key="link" class="text-sm font-bold text-[#1a0dab] hover:underline cursor-pointer flex items-center gap-1.5">
                                    {{ link }}
                                    <ArrowRight class="w-3 h-3 opacity-40" />
                                 </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Generated Keywords -->
                <div class="mt-16 transition-all duration-500 delay-100" :class="isMorphing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'">
                    <div class="flex items-center gap-3 mb-6">
                        <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Smart Keywords</h4>
                        <div class="h-px bg-stone-200 flex-1"></div>
                    </div>
                    <div class="bg-white rounded-[24px] p-8 border border-stone-200 shadow-xl premium-shadow">
                        <div class="flex flex-wrap gap-3 mb-8">
                             <div v-for="kw in activeKeywords" :key="kw" class="flex items-center gap-2 px-4 py-2.5 bg-stone-50 border border-stone-100 rounded-xl text-sm font-bold text-slate-700 shadow-sm transition-all group hover:bg-white hover:border-gold-500/30 hover:scale-105">
                                <span class="text-slate-400 font-medium">"</span>
                                <span>{{ kw }}</span>
                                <span class="text-slate-400 font-medium">"</span>
                                <button @click="removeKeyword(kw)" class="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                                    <X class="w-4 h-4" />
                                </button>
                             </div>
                             <div class="flex items-center gap-2 px-4 py-2.5 bg-stone-50/50 border border-stone-100 border-dashed rounded-xl text-sm font-bold text-slate-400 italic">
                                + Suggesting more...
                             </div>
                        </div>
                        <div class="flex items-center gap-4 pt-8 border-t border-stone-100">
                            <div class="flex-1 relative">
                              <input 
                                  v-model="newKeywordInput" 
                                  @keyup.enter="addKeyword"
                                  type="text" 
                                  placeholder="Type to add custom keyword..." 
                                  class="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-gold-500/10 focus:border-gold-500/30 transition-all placeholder:text-slate-400"
                              />
                            </div>
                            <button 
                                @click="addKeyword" 
                                :disabled="!newKeywordInput.trim()"
                                class="px-8 py-3 bg-slate-950 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2"
                            >
                                <Plus class="w-4 h-4" /> Add
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Image Extensions -->
                <div class="mt-16 transition-all duration-500 delay-150" :class="isMorphing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'">
                     <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center gap-3">
                            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Visual Extensions</h4>
                            <div class="h-px bg-stone-200 w-48"></div>
                        </div>
                        <button 
                            v-if="removedImages.size > 0"
                            @click="resetImages"
                            class="text-[10px] text-blue-600 hover:text-blue-700 font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                        >
                            <RefreshCw class="w-3 h-3" /> Restore All
                        </button>
                    </div>
                    
                    <div class="bg-white rounded-[24px] p-8 border border-stone-200 shadow-xl premium-shadow">
                        <div v-if="visibleImages.length === 0" class="py-12 border-2 border-stone-100 border-dashed rounded-2xl flex flex-col items-center justify-center text-center">
                            <Layers class="w-12 h-12 text-stone-200 mb-4" />
                            <div class="text-slate-400 text-sm font-bold mb-2 uppercase tracking-widest">No images active</div>
                            <button @click="resetImages" class="text-blue-600 text-xs font-black hover:underline uppercase tracking-widest mt-2">Restore Assets</button>
                        </div>

                        <div v-else class="grid grid-cols-4 gap-6">
                             <div 
                                v-for="(img, index) in visibleImages" 
                                :key="img" 
                                class="relative aspect-square rounded-[20px] overflow-hidden group border border-stone-100 hover:border-gold-500/30 transition-all premium-shadow bg-stone-50"
                             >
                                <img :src="img" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div class="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors pointer-events-none"></div>
                                <button 
                                    @click="removeImage(img)"
                                    class="absolute top-3 right-3 bg-white hover:bg-red-50 text-slate-900 border border-stone-100 hover:text-red-500 rounded-xl p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                                >
                                    <X class="w-4 h-4" />
                                </button>
                             </div>
                        </div>
                    </div>
                </div>

                <!-- AI Max Toggle Section -->
                <div class="mt-16 flex flex-col items-center justify-center transition-all duration-500 delay-175" :class="isMorphing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'">
                    <div class="bg-white px-8 py-5 rounded-[24px] border border-stone-200 shadow-xl premium-shadow flex items-center gap-8 group/aimax self-center">
                        <div class="flex flex-col">
                            <div class="flex items-center gap-2">
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Enable AI Max</span>
                                <div class="group/tooltip relative">
                                    <Info class="w-4 h-4 text-slate-400 cursor-help hover:text-gold-500 transition-colors" />
                                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 p-4 bg-slate-950 text-white text-[11px] font-medium leading-relaxed rounded-2xl shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-[100] border border-white/10">
AI Max for Search campaigns is a Google Ads feature set that uses artificial intelligence to enhance existing search campaigns, aiming to improve performance by increasing conversions                                        <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-8 border-transparent border-t-slate-950"></div>
                                    </div>
                                </div>
                            </div>
                            <span class="text-[9px] font-bold text-gold-600/60 uppercase tracking-widest mt-1">Real-time Performance Optimization</span>
                        </div>
                        
                        <button 
                            @click="isAiMaxEnabled = !isAiMaxEnabled"
                            class="relative w-14 h-7 rounded-full transition-all duration-500 focus:outline-none shrink-0 shadow-inner"
                            :class="isAiMaxEnabled ? 'bg-blue-600 shadow-blue-600/30' : 'bg-stone-200'"
                        >
                            <div 
                                class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-500 shadow-md flex items-center justify-center"
                                :class="isAiMaxEnabled ? 'translate-x-7' : 'translate-x-0'"
                            >
                                <div v-if="isAiMaxEnabled" class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Account Structure -->
                <div class="mt-20 transition-all duration-500 delay-200" :class="isMorphing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'">
                    <div class="flex items-center gap-3 mb-10 text-center justify-center">
                        <div class="h-px bg-stone-200 w-24"></div>
                        <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Suggested Infrastructure</h4>
                        <div class="h-px bg-stone-200 w-24"></div>
                    </div>

                    <div class="flex flex-col items-center">
                        <!-- Account Node -->
                        <div class="z-10 bg-slate-950 text-white px-8 py-4 rounded-[20px] text-sm font-black flex items-center gap-3 shadow-2xl shadow-slate-950/20 group hover:scale-105 transition-transform uppercase tracking-widest">
                            <Layers class="w-5 h-5 text-gold-500" />
                            {{ businessProfile.name }}
                            <span class="text-slate-500 ml-2 font-medium">(Account)</span>
                        </div>

                        <div class="w-px h-10 bg-stone-200"></div>
                        <div class="w-[84%] h-px bg-stone-200 relative"></div>

                        <div class="grid grid-cols-3 gap-8 mt-0 w-full">
                            <div v-for="(camp, i) in accountStructure" :key="i" class="flex flex-col items-center relative pt-10">
                                <div class="absolute top-0 w-px h-10 bg-stone-200"></div>

                                <!-- Campaign Node -->
                                <div class="bg-white border border-stone-200 text-slate-900 p-5 rounded-[20px] text-center w-full mb-6 relative group hover:border-gold-500/30 transition-all hover:translate-y-[-4px] shadow-xl premium-shadow">
                                    <div class="text-[9px] font-black uppercase text-gold-600 mb-2 tracking-[0.2em] opacity-80">Campaign</div>
                                    <div class="text-sm font-black tracking-tight truncate px-1" :title="camp.name">{{ camp.name }}</div>
                                </div>
                                
                                <div class="w-full grid grid-cols-2 gap-4 relative px-1">
                                    <div class="absolute -top-6 left-1/2 -ml-px w-px h-6 bg-stone-200"></div>
                                    <div class="absolute -top-1 left-1/4 right-1/4 h-px bg-stone-200"></div>
                                    
                                    <div v-for="ag in camp.adGroups" :key="ag.name" class="relative">
                                        <div class="absolute -top-1 left-1/2 -ml-px w-px h-2 bg-stone-200"></div>
                                        <div class="bg-white border border-stone-100 p-3 rounded-2xl text-center hover:bg-stone-50 transition-colors h-full flex flex-col justify-center shadow-sm">
                                            <div class="text-[8px] text-slate-400 font-black uppercase mb-1 tracking-widest opacity-60">{{ ag.device }}</div>
                                            <div class="text-[10px] font-bold text-slate-700 leading-tight">{{ ag.name }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ROI Forecast Section -->
                <div class="mt-24 pb-32">
                    <div class="flex items-center gap-3 mb-8">
                        <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ROI Projection</h4>
                        <div class="h-px bg-stone-200 flex-1"></div>
                    </div>
                    
                    <div class="bg-white rounded-[32px] border border-stone-200 overflow-hidden shadow-2xl premium-shadow">
                        <div class="p-10">
                             <div class="grid grid-cols-3 gap-12 mb-12 pb-12 border-b border-stone-100">
                                <div class="space-y-1">
                                    <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Projected Sales</div>
                                    <div class="text-4xl font-black text-slate-950 tracking-tighter">{{ formatCurrency(calculatedForecast.revenue) }}</div>
                                    <div class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg inline-block mt-2">Total Conversion Est.</div>
                                </div>
                                <div class="space-y-1">
                                    <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency</div>
                                    <div class="text-4xl font-black text-slate-950 tracking-tighter">{{ calculatedForecast.roas }}x</div>
                                    <div class="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg inline-block mt-2 flex items-center gap-1"><TrendingUp class="w-3 h-3"/> High Performing</div>
                                </div>
                                <div class="space-y-1">
                                    <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Incremental Growth</div>
                                    <div class="text-4xl font-black text-slate-950 tracking-tighter">{{ formatCurrency(calculatedForecast.incremental) }}</div>
                                    <div class="text-xs font-bold text-gold-600 bg-gold-50 px-2 py-0.5 rounded-lg inline-block mt-2">Direct Expansion Value</div>
                                </div>
                             </div>

                             <!-- ROI Chart -->
                             <div 
                                class="relative h-[240px] w-full mb-12 cursor-crosshair group select-none bg-stone-50/30 rounded-2xl p-6" 
                                @click="updateBudgetFromChart"
                                @mousemove.buttons="updateBudgetFromChart"
                             >
                                <div class="absolute left-6 top-6 bottom-6 flex flex-col justify-between text-[10px] font-black text-slate-300 pointer-events-none uppercase tracking-widest py-1">
                                    <span>$12.0k</span>
                                    <span>$6.0k</span>
                                    <span>0</span>
                                </div>

                                <div class="ml-12 h-full relative">
                                    <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 200">
                                        <line x1="0" y1="0" x2="600" y2="0" stroke="#f1f5f9" stroke-dasharray="8 8" stroke-width="2" />
                                        <line x1="0" y1="100" x2="600" y2="100" stroke="#f1f5f9" stroke-dasharray="8 8" stroke-width="2" />
                                        <line x1="0" y1="200" x2="600" y2="200" stroke="#e2e8f0" stroke-width="2" />

                                        <path 
                                            :d="`${curvePoints} L 600 200 L 0 200 Z`" 
                                            fill="url(#gradientPremium)" 
                                            opacity="0.15"
                                        />
                                        <path 
                                            :d="curvePoints" 
                                            fill="none" 
                                            stroke="#CA8A04" 
                                            stroke-width="4"
                                            stroke-linecap="round"
                                            class="drop-shadow-lg"
                                        />

                                        <line 
                                            :x1="chartSelectionX" y1="0" 
                                            :x2="chartSelectionX" y2="200" 
                                            stroke="#0f172a" 
                                            stroke-width="1.5" 
                                            stroke-dasharray="6 4"
                                            opacity="0.2"
                                        />
                                        <circle 
                                            :cx="chartSelectionX" 
                                            :cy="200 - (calculateRevenue(userBudget)/12000)*200" 
                                            r="8" 
                                            fill="#fff" 
                                            stroke="#0f172a" 
                                            stroke-width="3"
                                            class="cursor-grab active:cursor-grabbing shadow-xl"
                                        />

                                        <defs>
                                            <linearGradient id="gradientPremium" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stop-color="#CA8A04" />
                                                <stop offset="100%" stop-color="#CA8A04" stop-opacity="0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                             </div>

                             <!-- Budget Input -->
                             <div class="bg-slate-950 p-6 rounded-[24px] shadow-2xl shadow-slate-900/10 flex items-center justify-between group overflow-hidden relative">
                                 <div class="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-transparent pointer-events-none"></div>
                                 <div class="flex items-center gap-5 relative z-10">
                                     <div class="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-500 backdrop-blur-sm border border-green-500/20 shadow-inner">
                                         <DollarSign class="w-8 h-8" />
                                     </div>
                                     <div>
                                         <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Set Monthly Budget</label>
                                         <div class="flex items-baseline gap-2">
                                            <span class="text-2xl font-black text-white">$</span>
                                            <input 
                                              type="number" 
                                              v-model="userBudget"
                                              min="0"
                                              max="1500"
                                              step="50"
                                              class="bg-transparent text-4xl font-black text-white w-32 focus:outline-none tracking-tight"
                                            />
                                         </div>
                                     </div>
                                 </div>

                                 <div class="flex flex-col items-end relative z-10">
                                    <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Scale Logic</div>
                                    <div class="px-4 py-2 bg-white/10 rounded-xl border border-white/10 text-xs font-bold text-white uppercase tracking-widest backdrop-blur-md">
                                       Google Ads API Bid Simulator
                                    </div>
                                 </div>
                             </div>
                        </div>

                        <div class="bg-stone-50 p-5 flex justify-center items-center border-t border-stone-100">
                            <span class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                                <CheckCircle class="w-3.5 h-3.5 text-green-500" />
                                Synced with Real-time Auction Data
                            </span>
                        </div>
                    </div>

                    <!-- Final Deployment Actions -->
                    <div class="mt-16 flex flex-col items-center justify-center gap-8">
                        
                        <!-- Step 1: Sign In -->
                        <div v-if="!isGoogleAuthenticated" class="flex flex-col items-center gap-6 animate-fade-in-up">
                            <h2 class="text-2xl font-black text-slate-950 tracking-tight">Ready for Deployment</h2>
                            <button 
                                @click="handleSignIn"
                                :disabled="isSigningIn"
                                class="bg-white hover:bg-stone-50 text-slate-900 font-bold py-4 px-10 rounded-2xl shadow-2xl premium-shadow transition-all flex items-center gap-4 border border-stone-200 relative overflow-hidden group active:scale-95"
                            >
                                <div class="flex items-center gap-4 transition-opacity duration-200" :class="isSigningIn ? 'opacity-0' : 'opacity-100'">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="w-6 h-6">
                                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                    </svg>
                                    <span class="text-lg">Connect Google Account</span>
                                </div>
                                <div v-if="isSigningIn" class="absolute inset-0 flex items-center justify-center bg-white/90">
                                    <Loader2 class="w-6 h-6 animate-spin text-slate-900" />
                                </div>
                            </button>
                        </div>

                        <!-- Step 2: Deploy Button -->
                        <div v-else-if="!launchSuccess" class="flex flex-col items-center gap-6 animate-fade-in-up w-full max-w-sm">
                             <div class="px-5 py-2 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-green-100 shadow-sm flex items-center gap-2">
                                <CheckCircle class="w-4 h-4" /> Ready to Launch
                             </div>

                             <button 
                                @click="showLaunchModal = true"
                                class="w-full relative bg-slate-950 hover:bg-slate-900 text-white font-black py-6 rounded-[24px] shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 group overflow-hidden"
                             >
                                <div class="absolute inset-0 bg-gradient-to-tr from-gold-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div class="bg-white p-2.5 rounded-2xl w-12 h-12 flex items-center justify-center shadow-lg relative z-10">
                                     <img 
                                        src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Ads_logo.svg" 
                                        alt="Google Ads Logo"
                                        class="w-full h-full object-contain"
                                     />
                                </div>
                                <span class="text-xl uppercase tracking-widest relative z-10">Deploy Now</span>
                                <ArrowRight class="w-6 h-6 text-gold-500 group-hover:translate-x-2 transition-transform relative z-10" />
                             </button>
                        </div>

                        <!-- Success Message -->
                        <div v-if="launchSuccess" class="mx-auto w-full animate-fade-in-up">
                             <div class="bg-white border-2 border-green-500 rounded-[32px] p-12 flex flex-col items-center text-center shadow-2xl premium-shadow relative overflow-hidden">
                                <div class="absolute inset-0 bg-green-50/30"></div>
                                
                                <div class="w-20 h-20 bg-green-500 rounded-[24px] flex items-center justify-center mb-6 shadow-2xl shadow-green-500/30 z-10 rotate-3">
                                    <CheckCircle class="w-12 h-12 text-white" />
                                </div>
                                
                                <h3 class="text-3xl font-black text-slate-950 mb-3 z-10 tracking-tight">Transformation Complete</h3>
                                <p class="text-slate-500 font-bold z-10 uppercase tracking-widest text-xs mb-8">
                                    Reference ID: <span class="text-slate-950">#GOOG-{{ Math.floor(Math.random() * 100000) }}</span>
                                </p>
                                
                                <p class="text-base text-slate-600 z-10 max-w-md mx-auto leading-relaxed font-medium">
                                    Your campaigns have been safely deployed to Google Ads. Optimization and quality score tracking are now active.
                                </p>

                                <button @click="window.open('https://ads.google.com', '_blank')" class="mt-10 px-8 py-4 bg-[#4285F4] hover:bg-[#3b78db] text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] transition-all z-10 flex items-center gap-3 shadow-xl">
                                    <div class="bg-white p-1 rounded-lg w-6 h-6 flex items-center justify-center shadow-sm">
                                         <img 
                                            src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Ads_logo.svg" 
                                            alt="Google Ads Logo"
                                            class="w-full h-full object-contain"
                                         />
                                    </div>
                                    Open in Google Ads <ArrowRight class="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

          </div>
        </div>

    </main>

    <!-- Confirmation Modal -->
    <div v-if="showLaunchModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-slate-950/40 backdrop-blur-md" @click="!isLaunching ? showLaunchModal = false : null"></div>
        
        <div class="bg-white w-full max-w-md rounded-[32px] border border-white shadow-2xl relative z-10 overflow-hidden animate-fade-in-up premium-shadow">
            <div class="p-10">
                <div class="flex items-center justify-between mb-8">
                    <h3 class="text-2xl font-black text-slate-950 tracking-tight uppercase">Confirm Launch</h3>
                    <button v-if="!isLaunching" @click="showLaunchModal = false" class="text-slate-300 hover:text-slate-900 transition-colors p-2 hover:bg-stone-50 rounded-xl">
                        <X class="w-6 h-6" />
                    </button>
                </div>

                <div class="space-y-4 mb-10">
                    <div class="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget Set</span>
                        <span class="text-lg font-black text-slate-950">{{ formatCurrency(userBudget) }}/mo</span>
                    </div>
                    <div class="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaigns</span>
                        <span class="text-lg font-black text-slate-950">{{ selectedCampaigns.length }} Active</span>
                    </div>
                     <div class="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Account</span>
                        <span class="text-sm font-black text-gold-600 truncate max-w-[160px]">{{ businessProfile.name }}</span>
                    </div>
                </div>

                <div class="flex gap-4">
                    <button 
                        @click="showLaunchModal = false" 
                        class="flex-1 px-4 py-4 bg-stone-100 hover:bg-stone-200 text-slate-900 rounded-[20px] font-black uppercase tracking-widest text-xs transition-colors"
                        :disabled="isLaunching"
                    >
                        Back
                    </button>
                    <button 
                        @click="handleLaunch" 
                        class="flex-[2] px-4 py-4 bg-slate-950 hover:bg-slate-900 text-white rounded-[20px] font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 relative overflow-hidden group shadow-xl"
                        :disabled="isLaunching"
                    >
                        <span v-if="!isLaunching">Confirm & Deploy</span>
                        <span v-else>Deploying...</span>
                        <Loader2 v-if="isLaunching" class="w-4 h-4 animate-spin" />
                        
                        <div 
                            v-if="isLaunching" 
                            class="absolute bottom-0 left-0 h-1 bg-gold-500 w-full"
                            style="animation: slideRight 2.5s linear forwards"
                        ></div>
                    </button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
