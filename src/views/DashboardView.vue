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
  X
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

const selectedCampaigns = computed(() => 
  metaCampaigns.filter(c => selectedCampaignIds.value.includes(c.id))
)

const toggleCampaign = (id) => {
  if (selectedCampaignIds.value.includes(id)) {
    // Don't allow deselecting the last one for now to avoid empty state
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
         // Ensure uniqueness if desired, or allow duplicates if they represent different assets
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

// Generate points for the curve
const curvePoints = computed(() => {
  let path = ""
  for (let b = 0; b <= maxBudget; b += 15) {
    const x = (b / maxBudget) * chartWidth
    const revenue = calculateRevenue(b)
    // Normalize revenue to height (max revenue approx 12000 at 1.5k budget)
    const y = chartHeight - (revenue / 12000) * chartHeight 
    path += (b === 0 ? "M" : "L") + `${x} ${y}`
  }
  return path
})

// Calculate Revenue based on Budget (Diminishing returns logic)
const calculateRevenue = (budget) => {
  // Base ROAS starts high (e.g., 10x) and decays slowly as budget scales
  const roas = 10 * Math.exp(-0.0005 * budget) 
  return budget * roas
}

// Current Forecast values
const calculatedForecast = computed(() => {
  const revenue = calculateRevenue(userBudget.value)
  // Simplified for demo:
  return {
    revenue: revenue,
    incremental: Math.max(0, revenue - 2000), // Mock baseline adjusted for lower range
    roas: (revenue / (userBudget.value || 1)).toFixed(1)
  }
})

// Interaction
const handleChartInput = (e) => {
  // Simple approximation for demo interactions
  // In a real chart, we'd use element refs and exact coordinates
  // Start interaction
}

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
                { name: "Brand - Mobile", device: "Mobile" },
                { name: "Brand - Desktop", device: "Desktop" }
            ]
        }
    ]

    const dynamicCampaigns = selectedCampaigns.value.map(c => ({
        name: c.name.replace(' - Instagram Boost', '').replace('Retargeting', 'Search'), // Clean up names
        adGroups: [
            { name: "Generic - Mobile", device: "Mobile" },
            { name: "Generic - Desktop", device: "Desktop" }
        ]
    }))

    return [...baseStructure, ...dynamicCampaigns]
})

// Mock mapping of Meta campaigns to Google Ad Previews
const googleAdPreviews = computed(() => {
  return selectedCampaigns.value.map(campaign => {
    // Simple logic to show different content based on selection
    if (campaign.id === 'meta_2') {
      return {
        id: campaign.id,
        headline: "Rare Philodendrons | Exotic Indoor Plants",
        description: "Shop our exclusive collection of rare Philodendrons. Hand-picked, healthy plants delivered to your door. 30-day health guarantee.",
        keywords: ["buy philodendron online", "rare house plants", "exotic indoor plants", "philodendron pink princess"],
        sitelinks: ["New Arrivals", "Care Guides", "Plant Subscription", "Gift Cards"]
      }
    }
    // Default / Mock for others (vary slightly based on ID for demo)
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

const handleAnalyze = () => {
    isMorphing.value = true
    setTimeout(() => {
        isMorphing.value = false
    }, 1500)
}

const toggleForecast = () => {
  showForecast.value = !showForecast.value
}

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)

const handleSignIn = () => {
    isSigningIn.value = true
    // Mock Sign In
    setTimeout(() => {
        isGoogleAuthenticated.value = true
        isSigningIn.value = false
    }, 1500) // Increased delay to show spinner
}

const handleLaunch = () => {
    if (isLaunching.value || launchSuccess.value) return
    isLaunching.value = true
    
    // Mock API call
    setTimeout(() => {
        isLaunching.value = false
        launchSuccess.value = true
        showLaunchModal.value = false // Close modal on success
        
        // Reset after a delay or navigate (optional)
        // setTimeout(() => { launchSuccess.value = false }, 5000)
    }, 2500)
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
          Powered by Gemini
        </div>
      </div>
    </nav>

    <main class="flex-1 flex items-start">
        
        <!-- Sidebar: Meta Information -->
        <aside class="w-[400px] bg-[#1e293b] border-r border-gray-700 flex flex-col z-10 shrink-0 sticky top-0 h-screen">
            <div class="p-6 pb-2 shrink-0">
                <!-- Connection Status -->
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-2">
                         <!-- Meta Logo -->
                        <div class="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                            <svg class="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </div>
                        <span class="font-bold text-gray-200">Meta Ad Account</span>
                    </div>
                    <span class="px-2 py-0.5 bg-green-900/40 text-green-400 text-[10px] font-bold uppercase tracking-wider rounded border border-green-700/50">Connected</span>
                </div>

                <div class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Active Campaigns</div>
            </div>

            <!-- Scrollable Ads List -->
            <div class="overflow-y-auto flex-1 p-6 pt-4 space-y-6 custom-scrollbar">
                <!-- Loop through campaigns -->
                <div 
                    v-for="(campaign, index) in metaCampaigns" 
                    :key="campaign.id"
                    class="bg-white rounded-lg overflow-hidden shadow-lg border transition-all duration-200 cursor-pointer relative group"
                    :class="selectedCampaignIds.includes(campaign.id) ? 'ring-4 ring-blue-500 border-blue-500 transform scale-[1.02] z-10' : 'border-gray-200 hover:border-blue-300 opacity-90 hover:opacity-100'"
                    @click="toggleCampaign(campaign.id)"
                >
                    <!-- Selection Indicator -->
                    <div v-if="selectedCampaignIds.includes(campaign.id)" class="absolute top-2 right-2 z-20 bg-blue-600 text-white rounded-full p-1 shadow-md">
                        <CheckCircle class="w-4 h-4" />
                    </div>

                    <div class="p-3 flex items-center gap-2 border-b border-gray-100">
                         <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs">UR</div>
                         <div class="flex-1">
                             <div class="text-xs font-bold text-gray-900">Urban Roots Plants</div>
                             <div class="text-[10px] text-gray-500">Sponsored • {{ campaign.platform }}</div>
                         </div>
                         <MoreHorizontal class="w-4 h-4 text-gray-400" />
                    </div>
                    <div class="aspect-square bg-gray-100 relative group-hover:brightness-105 transition-all">
                        <img 
                            :src="extractedAssets.images[index % extractedAssets.images.length]" 
                            class="w-full h-full object-cover" 
                            alt="Campaign Asset" 
                        />
                    </div>
                     <div class="p-3 bg-blue-50 border-t border-blue-100 flex justify-between items-center">
                        <span class="text-xs font-bold text-blue-700">Shop Now</span>
                        <ArrowRight class="w-3 h-3 text-blue-700" />
                    </div>
                    <div class="p-3 space-y-2">
                         <div class="flex gap-4 mb-2">
                            <Heart class="w-5 h-5 text-gray-700" />
                            <MessageCircle class="w-5 h-5 text-gray-700" />
                            <Send class="w-5 h-5 text-gray-700" />
                         </div>
                        <div class="text-xs text-gray-900 line-clamp-2">
                            <span class="font-bold">urbanroots</span> {{ extractedAssets.headlines[index % extractedAssets.headlines.length] }} 🌿 #plants #sale
                        </div>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main Content: Google Transformation -->
        <div class="flex-1 flex flex-col relative bg-[#111827]">
        <div class="flex-1 flex flex-col items-center justify-center p-8">
                
                <!-- Example Ads Header -->
                <div class="w-full max-w-3xl mb-4">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Example Ads Preview</h4>
                    </div>
                </div>

                <!-- Google Ad Cards Carousel/stack -->
                <div class="w-full max-w-5xl flex flex-col gap-6 items-center">
                    <div 
                        v-for="ad in googleAdPreviews" 
                        :key="ad.id"
                        class="w-full max-w-2xl transform transition-all duration-700" 
                        :class="isMorphing ? 'opacity-50 scale-95 blur-sm' : 'opacity-100 scale-100'"
                    >
                        <div class="bg-white rounded-xl p-6 shadow-2xl relative">
                            <!-- Google Badge -->
                             <div class="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md z-10 p-1.5">
                                <svg viewBox="0 0 24 24" class="w-full h-full">
                                    <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.6v3.1h3.9c2.28-2.1 3.6-5.2 3.6-8.3z"/>
                                    <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.96-2.91l-3.91-3.09c-1.08.72-2.44 1.15-4.05 1.15-3.13 0-5.78-2.11-6.73-4.96h-4.04v3.09C3.655 21.03 7.635 24 12.255 24z"/>
                                    <path fill="#FBBC05" d="M5.525 14.2a6.99 6.99 0 0 1 0-4.39v-3.09h-4.04C.695 8.355 0 10.125 0 12s.695 3.645 1.485 5.29l4.04-3.09z"/>
                                    <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.62 0-8.6 2.97-10.77 7.29l4.04 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
                                </svg>
                             </div>

                            <!-- Ad Content -->
                            <div class="flex items-center gap-2 mb-1">
                                 <div class="w-5 h-5 rounded-full overflow-hidden bg-gray-100">
                                    <img src="https://ui-avatars.com/api/?name=U+J&background=0D8ABC&color=fff" class="w-full h-full object-cover">
                                 </div>
                                 <div class="flex flex-col leading-tight">
                                    <span class="text-xs font-bold text-gray-900">{{ businessProfile.name }}</span>
                                    <span class="text-[10px] text-gray-500">{{ businessProfile.website.replace('https://', '') }}</span>
                                 </div>
                                 <span class="text-[10px] font-bold text-gray-900 ml-auto">Sponsored</span>
                            </div>

                            <div class="space-y-1">
                                <h3 class="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug">
                                    {{ ad.headline }}
                                </h3>
                                <div class="text-sm text-gray-600 leading-relaxed">
                                    {{ ad.description }}
                                </div>
                            </div>

                            <!-- Sitelinks -->
                            <div class="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-2">
                                 <span v-for="link in ad.sitelinks" :key="link" class="text-sm text-[#1a0dab] hover:underline cursor-pointer">
                                    {{ link }}
                                 </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Generated Keywords -->
                <div class="w-full max-w-3xl mt-8 transition-all duration-500 delay-100" :class="isMorphing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'">
                    <div class="flex items-center gap-2 mb-3">
                        <div class="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Generated Keywords (Broad & Phrase)</h4>
                    </div>
                    <div class="bg-[#1e293b] rounded-xl p-4 border border-gray-700/50 flex flex-col gap-4">
                        <div class="flex flex-wrap gap-2">
                             <div v-for="kw in activeKeywords" :key="kw" class="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f172a] border border-gray-700 rounded-lg text-sm text-gray-300 shadow-sm transition-colors group">
                                <span>"{{ kw }}"</span>
                                <button @click="removeKeyword(kw)" class="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                                    <X class="w-3.5 h-3.5" />
                                </button>
                             </div>
                        </div>
                        <div class="flex items-center gap-2 mt-2 pt-4 border-t border-gray-700/50">
                            <input 
                                v-model="newKeywordInput" 
                                @keyup.enter="addKeyword"
                                type="text" 
                                placeholder="Add custom keyword..." 
                                class="flex-1 bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                            />
                            <button 
                                @click="addKeyword" 
                                :disabled="!newKeywordInput.trim()"
                                class="px-5 py-2 bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-500/30 rounded-lg text-sm font-bold transition-colors"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Image Extensions -->
                <div class="w-full max-w-3xl mt-8 transition-all duration-500 delay-150" :class="isMorphing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>
                            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Image Assets (Extensions)</h4>
                        </div>
                        <button 
                            v-if="removedImages.size > 0"
                            @click="resetImages"
                            class="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider transition-colors"
                        >
                            Reset Images
                        </button>
                    </div>
                    
                    <div v-if="visibleImages.length === 0" class="bg-[#1e293b] rounded-xl p-8 border border-gray-700/50 border-dashed flex flex-col items-center justify-center text-center">
                        <div class="text-gray-500 text-sm mb-2">No images selected</div>
                        <button @click="resetImages" class="text-blue-400 text-xs font-bold hover:underline">Restore All Images</button>
                    </div>

                    <div v-else class="bg-[#1e293b] rounded-xl p-4 border border-gray-700/50 grid grid-cols-4 gap-4">
                         <div 
                            v-for="(img, index) in visibleImages" 
                            :key="img" 
                            class="relative aspect-square rounded-lg overflow-hidden group border border-gray-700/50 hover:border-pink-500/50 transition-all"
                         >
                            <img :src="img" class="w-full h-full object-cover" />
                            <button 
                                @click="removeImage(img)"
                                class="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <X class="w-3 h-3" />
                            </button>
                         </div>
                    </div>
                </div>

                <!-- Account Structure Tree -->
                <div class="w-full max-w-3xl mt-10 transition-all duration-500 delay-200" :class="isMorphing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'">
                    <div class="flex items-center gap-2 mb-6">
                        <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Suggested Account Structure</h4>
                    </div>

                    <div class="flex flex-col items-center">
                        <!-- Root Node -->
                        <div class="z-10 bg-gradient-to-r from-blue-900 to-slate-900 border border-blue-700/50 text-blue-100 px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20">
                            <Layers class="w-4 h-4 text-blue-400" />
                            {{ businessProfile.name }} (Account)
                        </div>

                        <!-- Vertical Connector -->
                        <div class="w-px h-6 bg-gray-700"></div>
                        
                        <!-- Horizontal Bar -->
                        <div class="w-[84%] h-px bg-gray-700 relative"></div>

                        <!-- Campaigns Container -->
                        <div class="grid grid-cols-3 gap-4 mt-0 w-full">
                            <div v-for="(camp, i) in accountStructure" :key="i" class="flex flex-col items-center relative pt-6">
                                <!-- Vertical Link from Horizontal Bar -->
                                <div class="absolute top-0 w-px h-6 bg-gray-700"></div>

                                <!-- Campaign Node -->
                                <div class="bg-[#1e293b] border border-gray-700 text-gray-200 p-3 rounded-lg text-center w-full mb-4 relative group hover:border-blue-500/50 transition-all hover:-translate-y-1 shadow-md">
                                    <div class="text-[10px] font-bold uppercase text-blue-400 mb-1 tracking-wider">Campaign</div>
                                    <div class="text-sm font-bold truncate px-1" :title="camp.name">{{ camp.name }}</div>
                                </div>
                                
                                <!-- Ad Group Links -->
                                <div class="w-full grid grid-cols-2 gap-3 relative px-1">
                                    <!-- Center connector for ad groups -->
                                    <div class="absolute -top-4 left-1/2 -ml-px w-px h-4 bg-gray-700"></div>
                                    <div class="absolute -top-1 left-1/4 right-1/4 h-px bg-gray-700"></div> <!-- Horizontal split for AGs -->
                                    
                                    <div v-for="ag in camp.adGroups" :key="ag.name" class="relative">
                                         <!-- Tiny vertical connector -->
                                        <div class="absolute -top-1 left-1/2 -ml-px w-px h-1 bg-gray-700"></div>
                                        <div class="bg-[#0f172a] border border-gray-800 p-2 rounded text-center hover:border-gray-600 transition-colors h-full flex flex-col justify-center">
                                            <div class="text-[9px] text-gray-500 uppercase mb-0.5">{{ ag.device }}</div>
                                            <div class="text-[10px] font-medium text-gray-300 truncate leading-tight">{{ ag.name }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Set Budget and Forecast ROI -->
                <div class="mt-12 w-full max-w-3xl pb-20">
                    <div class="flex items-center gap-2 mb-6">
                        <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Set Budget and Forecast ROI</h4>
                    </div>
                    
                    <!-- Forecast Card -->
                    <div 
                        class="bg-[#1e293b] rounded-2xl border border-gray-700 overflow-hidden shadow-2xl"
                    >
                        <div class="p-8">
                             <!-- Header Stats -->
                             <div class="grid grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-700/50">
                                <div>
                                    <div class="text-sm text-gray-400 mb-1">Projected Revenue</div>
                                    <div class="text-3xl font-bold text-white">{{ formatCurrency(calculatedForecast.revenue) }}</div>
                                    <div class="text-xs text-blue-400 mt-1">Total Conversion Value</div>
                                </div>
                                <div>
                                    <div class="text-sm text-gray-400 mb-1">Est. ROAS</div>
                                    <div class="text-3xl font-bold text-white">{{ calculatedForecast.roas }}x</div>
                                    <div class="text-xs text-green-400 mt-1 flex items-center gap-1"><TrendingUp class="w-3 h-3"/> Efficient</div>
                                </div>
                                <div>
                                    <div class="text-sm text-gray-400 mb-1">Incremental Lift</div>
                                    <div class="text-3xl font-bold text-white">{{ formatCurrency(calculatedForecast.incremental) }}</div>
                                    <div class="text-xs text-purple-400 mt-1">Added Value</div>
                                </div>
                             </div>

                             <!-- Interactive Chart -->
                             <div 
                                class="relative h-[200px] w-full mb-8 cursor-crosshair group select-none" 
                                @click="updateBudgetFromChart"
                                @mousemove.buttons="updateBudgetFromChart"
                             >
                                <!-- Y Axis Labels -->
                                <div class="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-gray-500 pointer-events-none">
                                    <span>$12k</span>
                                    <span>$6k</span>
                                    <span>$0</span>
                                </div>

                                <!-- Chart Area -->
                                <div class="ml-8 h-full relative">
                                    <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 200">
                                        <!-- Grid Lines -->
                                        <line x1="0" y1="0" x2="600" y2="0" stroke="#334155" stroke-dasharray="4 4" stroke-width="0.5" />
                                        <line x1="0" y1="100" x2="600" y2="100" stroke="#334155" stroke-dasharray="4 4" stroke-width="0.5" />
                                        <line x1="0" y1="200" x2="600" y2="200" stroke="#334155" stroke-width="1" />

                                        <!-- Revenue Curve -->
                                        <path 
                                            :d="`${curvePoints} L 600 200 L 0 200 Z`" 
                                            fill="url(#gradientRevenue)" 
                                            opacity="0.2"
                                        />
                                        <path 
                                            :d="curvePoints" 
                                            fill="none" 
                                            stroke="#3b82f6" 
                                            stroke-width="3"
                                            stroke-linecap="round"
                                        />

                                        <!-- Selection Marker -->
                                        <line 
                                            :x1="chartSelectionX" y1="0" 
                                            :x2="chartSelectionX" y2="200" 
                                            stroke="#fff" 
                                            stroke-width="1" 
                                            stroke-dasharray="4 2"
                                        />
                                        <circle 
                                            :cx="chartSelectionX" 
                                            :cy="200 - (calculateRevenue(userBudget)/12000)*200" 
                                            r="6" 
                                            fill="#fff" 
                                            stroke="#3b82f6" 
                                            stroke-width="2"
                                            class="cursor-grab active:cursor-grabbing"
                                        />

                                        <defs>
                                            <linearGradient id="gradientRevenue" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stop-color="#3b82f6" />
                                                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                             </div>

                             <!-- Budget Input Control -->
                             <div class="bg-[#0f172a] p-4 rounded-xl border border-gray-700 flex items-center justify-between">
                                 <div class="flex items-center gap-3">
                                     <div class="p-2 bg-blue-900/30 rounded-lg text-blue-400">
                                         <DollarSign class="w-6 h-6" />
                                     </div>
                                     <div>
                                         <label class="block text-sm text-gray-200 mb-0.5 font-bold uppercase tracking-wider">Set Monthly Budget</label>
                                     </div>
                                 </div>
                                 <div class="flex items-center gap-2">
                                     <span class="text-gray-400 font-medium">$</span>
                                     <input 
                                        type="number" 
                                        v-model="userBudget"
                                        min="0"
                                        max="1500"
                                        step="50"
                                        class="bg-transparent text-xl font-bold text-white w-24 focus:outline-none border-b border-gray-600 focus:border-blue-500 text-right"
                                     />
                                 </div>
                             </div>

                        </div>

                        <div class="bg-[#0f172a] p-4 flex justify-between items-center border-t border-gray-800">
                            <span class="text-xs text-gray-500 flex items-center gap-2">
                                <CheckCircle class="w-3 h-3 text-green-500" />
                                Validated by Google Ads Bid Simulations API
                            </span>
                        </div>
                    </div>

                    <!-- Bottom Actions (Auth & Deploy) -->
                    <div class="mt-8 flex flex-col items-center justify-center gap-4">
                        
                        <!-- Step 1: Sign In -->
                        <div v-if="!isGoogleAuthenticated" class="flex flex-col items-center gap-3 animate-fade-in-up">
                            <span class="text-xl text-gray-300 font-bold mb-3 tracking-wide">To deploy to Google Ads, sign in with Google</span>
                            <button 
                                @click="handleSignIn"
                                :disabled="isSigningIn"
                                class="bg-white hover:bg-gray-100 text-gray-700 font-roboto font-medium py-2.5 px-6 rounded-md shadow-md transition-all flex items-center gap-3 border border-gray-300 relative overflow-hidden"
                            >
                                <div class="flex items-center gap-3 transition-opacity duration-200" :class="isSigningIn ? 'opacity-0' : 'opacity-100'">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="w-5 h-5">
                                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                    </svg>
                                    <span>Sign in with Google</span>
                                </div>
                                
                                <div v-if="isSigningIn" class="absolute inset-0 flex items-center justify-center bg-white/80">
                                    <Loader2 class="w-5 h-5 animate-spin text-gray-600" />
                                </div>
                            </button>
                        </div>

                        <!-- Step 2: Deploy Button -->
                        <div v-else-if="!launchSuccess" class="flex flex-col items-center gap-3 animate-fade-in-up">
                             <div class="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wider bg-green-900/20 px-3 py-1 rounded-full border border-green-500/20">
                                <CheckCircle class="w-3 h-3" /> Authenticated as {{ businessProfile.name }}
                             </div>

                             <button 
                                @click="showLaunchModal = true"
                                class="group relative bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold py-4 px-8 rounded-xl shadow-xl shadow-blue-900/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 border border-blue-400/20 w-full max-w-sm flex items-center justify-center gap-3"
                             >
                                <!-- Google Ads Logo (Official via CDN) -->
                                <div class="bg-white p-2 rounded-full w-12 h-12 flex items-center justify-center shadow-md shrink-0 border border-gray-100">
                                     <img 
                                        src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Ads_logo.svg" 
                                        alt="Google Ads Logo"
                                        class="w-full h-full object-contain"
                                     />
                                </div>
                                <span class="text-lg">Deploy to Google Ads</span>
                                <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                             </button>
                             <div class="text-[10px] text-gray-500">
                                By deploying, you agree to Google Ads terms and conditions.
                             </div>
                        </div>

                    </div>

                     <!-- Success Message Float -->
                    <div v-if="launchSuccess" class="mt-8 mx-auto w-full max-w-2xl animate-fade-in-up">
                         <div class="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/50 rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
                            <div class="absolute inset-0 bg-green-500/5 animate-pulse"></div>
                            
                            <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/30 z-10">
                                <CheckCircle class="w-10 h-10 text-white" />
                            </div>
                            
                            <h3 class="text-2xl font-bold text-white mb-2 z-10">Campaigns Deployed Successfully!</h3>
                            <p class="text-green-200 z-10 max-w-lg mx-auto">
                                Reference ID: <span class="font-mono text-white bg-green-900/50 px-2 py-0.5 rounded">#GOOG-{{ Math.floor(Math.random() * 100000) }}</span>
                            </p>
                            <p class="text-sm text-gray-300 mt-4 z-10">
                                Your campaigns are now in review. You can track their performance directly in your Google Ads dashboard.
                            </p>

                            <button class="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-colors border border-white/20 z-10 flex items-center gap-2">
                                Open Google Ads <ArrowRight class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>

        </div>

        <!-- Confirmation Modal -->
        <div v-if="showLaunchModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="!isLaunching ? showLaunchModal = false : null"></div>
            
            <!-- Modal Content -->
            <div class="bg-[#1e293b] w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl relative z-10 overflow-hidden animate-fade-in-up">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-bold text-white">Confirm Deployment</h3>
                        <button v-if="!isLaunching" @click="showLaunchModal = false" class="text-gray-400 hover:text-white">
                            <X class="w-5 h-5" />
                        </button>
                    </div>

                    <div class="space-y-4 mb-8">
                        <div class="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg border border-gray-700">
                            <span class="text-sm text-gray-400">Total Budget</span>
                            <span class="text-lg font-bold text-white">{{ formatCurrency(userBudget) }}/mo</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg border border-gray-700">
                            <span class="text-sm text-gray-400">Campaigns</span>
                            <span class="text-lg font-bold text-white">{{ selectedCampaigns.length }} Campaigns</span>
                        </div>
                         <div class="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg border border-gray-700">
                            <span class="text-sm text-gray-400">Target Account</span>
                            <span class="text-sm font-bold text-blue-400 flex items-center gap-1">
                                <span class="w-2 h-2 rounded-full bg-green-500"></span>
                                {{ businessProfile.name }} (555-123-4567)
                            </span>
                        </div>
                    </div>

                    <div class="flex gap-3">
                        <button 
                            @click="showLaunchModal = false" 
                            class="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition-colors"
                            :disabled="isLaunching"
                        >
                            Cancel
                        </button>
                        <button 
                            @click="handleLaunch" 
                            class="flex-[2] px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 relative overflow-hidden"
                            :disabled="isLaunching"
                        >
                            <span v-if="!isLaunching">Confirm & Launch</span>
                            <span v-else>Deploying...</span>
                            <Loader2 v-if="isLaunching" class="w-4 h-4 animate-spin" />
                            
                            <!-- Progress Bar -->
                            <div 
                                v-if="isLaunching" 
                                class="absolute bottom-0 left-0 h-1 bg-white/50 transition-all duration-[2500ms] ease-out w-full"
                                :style="{ transform: 'translateX(-100%)', animation: 'slideRight 2.5s linear forwards' }"
                            ></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </main>
  </div>
</template>

<style scoped>
/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155; /* slate-700 */
  border-radius: 9999px; /* full rounded */
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569; /* slate-600 */
}
</style>

