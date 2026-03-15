<script setup>
import { ref, onMounted } from 'vue'
import { extractedAssets } from '../data/mockData'
import { ShoppingBag, Star, Menu, Instagram, Facebook, Sparkles, Layers, Layout, Rocket } from 'lucide-vue-next'

const isLoading = ref(true)

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 10000)
})
</script>

<template>
  <div class="min-h-screen bg-stone-50 font-serif text-stone-800">
    <!-- Loading Overlay (Metamorph Style) -->
    <transition name="fade">
      <div v-if="isLoading" class="fixed inset-0 z-[100] bg-stone-50 text-slate-900 font-sans flex flex-col items-center justify-center p-4 text-center overflow-hidden">
        <!-- Background Ambient Effects -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div class="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-slate-900/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        </div>
        
        <div class="relative z-10 flex flex-col items-center max-w-lg w-full">
            <!-- Central Animation Hub -->
            <div class="relative w-64 h-64 mb-12 flex items-center justify-center">
              <!-- Geometric Rings -->
              <div class="absolute inset-0 border border-gold-500/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
              <div class="absolute inset-8 border border-slate-950/5 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              <div class="absolute inset-16 border-2 border-dashed border-gold-500/10 rounded-full animate-[spin_30s_linear_infinite]"></div>
              
              <!-- Core -->
              <div class="w-32 h-32 bg-white rounded-[40px] shadow-2xl premium-shadow border border-stone-100 flex items-center justify-center relative z-10 group overflow-hidden">
                  <div class="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Sparkles class="w-12 h-12 text-slate-950 animate-pulse" />
              </div>

              <!-- Orbiting Particles -->
              <div class="absolute inset-0 animate-[spin_8s_linear_infinite]">
                  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-gold-500 rounded-full shadow-[0_0_15px_rgba(202,138,4,0.5)]"></div>
              </div>
            </div>

            <div class="space-y-6 text-center">
              <h2 class="text-3xl font-black text-slate-950 tracking-tighter uppercase italic">
                Generating Landing Page
              </h2>
              <div class="flex flex-col items-center gap-3">
                  <p class="text-lg text-slate-500 font-medium leading-relaxed">
                    Adapting assets with Gemini • Optimizing layout
                  </p>
                  <div class="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-stone-200">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-1 bg-stone-50 rounded-lg">AI Engine Active</span>
                  </div>
              </div>
            </div>

            <!-- Simple Progress Readout -->
            <div class="mt-12 w-full max-w-sm">
                <div class="bg-white border border-stone-200 rounded-2xl p-6 shadow-xl premium-shadow flex items-center justify-between">
                    <div class="flex items-center gap-4 text-left">
                        <div class="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center border border-stone-100">
                            <Layout class="w-5 h-5 text-gold-600" />
                        </div>
                        <div>
                            <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</div>
                            <div class="text-xs font-black text-slate-900 uppercase">Personalizing Experience</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </transition>

    <!-- Announcement Bar -->
    <div class="bg-green-900 text-white text-center py-2 text-sm tracking-wide">
      FREE SHIPPING ON ORDERS OVER $50 • USE CODE: JUNGLE20
    </div>

    <!-- Nav -->
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Menu class="w-6 h-6 cursor-pointer" />
        <div class="text-2xl font-bold tracking-tighter text-green-900">URBAN JUNGLE</div>
        <div class="flex gap-4 items-center">
           <ShoppingBag class="w-5 h-5" />
           <span class="bg-green-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <div class="relative h-[80vh] flex items-center justify-center overflow-hidden">
      <img :src="extractedAssets.images[0]" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black/30"></div>
      <div class="relative z-10 text-center text-white space-y-6 px-4">
        <h1 class="text-5xl md:text-7xl font-bold tracking-tight">{{ extractedAssets.headlines[0] }}</h1>
        <p class="text-xl md:text-2xl font-light tracking-wide">Premium indoor plants delivered to your door.</p>
        <button class="px-8 py-4 bg-white text-green-900 font-bold tracking-wider hover:bg-stone-100 transition-colors uppercase">
          Shop Collection
        </button>
      </div>
    </div>

    <!-- Featured Products -->
    <section class="py-20 px-6 max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <span class="text-green-800 tracking-widest text-sm font-bold uppercase">Curated Selection</span>
        <h2 class="text-4xl font-bold mt-2 text-stone-900">Best Sellers</h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="(img, i) in extractedAssets.images.slice(1, 4)" :key="i" class="group cursor-pointer">
          <div class="relative overflow-hidden aspect-[4/5] mb-4 bg-stone-200">
             <img :src="img" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
             <div class="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <ShoppingBag class="w-5 h-5 text-green-900" />
             </div>
          </div>
          <h3 class="text-xl font-medium">Monstera Deliciosa</h3>
          <p class="text-stone-500 font-sans">$45.00</p>
        </div>
      </div>
    </section>

    <!-- Social Proof -->
    <section class="bg-stone-900 text-stone-100 py-20 px-6">
      <div class="max-w-4xl mx-auto text-center space-y-8">
        <div class="flex justify-center gap-1 text-yellow-500">
           <Star v-for="n in 5" :key="n" class="w-6 h-6 fill-current" />
        </div>
        <p class="text-3xl md:text-4xl font-light italic leading-relaxed">
          "Absolutely impressed with the packaging and health of my plants. Urban Jungle has transformed my apartment into a green oasis."
        </p>
        <div class="font-bold tracking-widest uppercase text-sm text-stone-400">- Sarah M., Verified Buyer</div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white text-stone-900 py-12 border-t border-stone-200">
       <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
         <div class="space-y-4">
           <div class="font-bold text-xl text-green-900">URBAN JUNGLE</div>
           <p class="text-stone-500 text-sm">Validating the "Unwebbed" hypothesis, one landing page at a time.</p>
         </div>
         <div>
           <h4 class="font-bold mb-4 uppercase text-xs tracking-widest">Shop</h4>
           <ul class="space-y-2 text-sm text-stone-600">
             <li>All Plants</li>
             <li>New Arrivals</li>
             <li>Care Accessories</li>
           </ul>
         </div>
         <div>
           <h4 class="font-bold mb-4 uppercase text-xs tracking-widest">Support</h4>
           <ul class="space-y-2 text-sm text-stone-600">
             <li>Shipping & Returns</li>
             <li>Plant Care Guide</li>
             <li>FAQ</li>
           </ul>
         </div>
         <div>
           <h4 class="font-bold mb-4 uppercase text-xs tracking-widest">Follow Us</h4>
           <div class="flex gap-4 text-stone-400">
             <Instagram class="w-5 h-5 hover:text-green-900 transition-colors cursor-pointer" />
             <Facebook class="w-5 h-5 hover:text-green-900 transition-colors cursor-pointer" />
           </div>
         </div>
       </div>
    </footer>
  </div>
</template>
