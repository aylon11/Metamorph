<script setup>
import { useRouter } from 'vue-router'
import { ArrowRight, Zap, RefreshCw, Layers, TrendingUp, CheckCircle, Smartphone } from 'lucide-vue-next'
import Logo from '../components/Logo.vue'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-[#0f172a] text-white font-sans overflow-x-hidden selection:bg-purple-500/30">
    <!-- Navbar -->
    <nav class="fixed top-0 w-full z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-gray-800">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
           <Logo />
           <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Metamorph</span>
        </div>
        <div class="flex items-center gap-4">
          <button @click="router.push('/connect')" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Sign In
          </button>
          <button 
            @click="router.push('/connect')"
            class="text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-500/20"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <main class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <!-- Background Glows -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div class="absolute top-1/3 left-1/4 w-[600px] h-[400px] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 animate-fade-in-up" style="animation-delay: 0.1s">
          <Zap class="w-4 h-4" /> Seamless AI-Powered Migration
        </div>

        <h1 class="text-7xl md:text-9xl font-black tracking-tighter mb-4 animate-fade-in-up" style="animation-delay: 0.2s">
          <span class="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">Metamorph</span>
        </h1>

        <h2 class="text-3xl md:text-5xl font-bold tracking-tight mb-6 animate-fade-in-up leading-tight text-gray-100" style="animation-delay: 0.3s">
          Expand to Google Ads in One Click
        </h2>

        <p class="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 animate-fade-in-up leading-relaxed" style="animation-delay: 0.4s">
          Instantly deploy highly optimized Google Ads campaigns based on your existing, top-performing Meta campaigns. Quickly expand your business and generate new growth automatically.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style="animation-delay: 0.5s">
          <button 
            @click="router.push('/connect')"
            class="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl overflow-hidden transition-all duration-300 hover:bg-blue-500 hover:scale-[1.02] shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] w-full sm:w-auto"
          >
            <span class="relative z-10 flex items-center gap-2">
              Connect Meta Account
              <ArrowRight class="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
          <div class="text-sm text-gray-500 flex items-center gap-2">
            <CheckCircle class="w-4 h-4 text-green-500" /> No credit card required
          </div>
        </div>

        <!-- Dashboard mockup preview -->
        <div class="mt-20 relative mx-auto max-w-5xl animate-fade-in-up hidden md:block" style="animation-delay: 0.7s">
          <div class="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent z-10"></div>
          <div class="rounded-t-2xl border border-gray-800 bg-[#1e293b] p-2 shadow-2xl relative overflow-hidden">
             <!-- Mock UI Header -->
             <div class="flex items-center gap-2 mb-4 px-4 pt-2">
               <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
               <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
               <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
             </div>
             <!-- Mock UI Content -->
             <div class="grid grid-cols-3 gap-4 px-4 pb-4">
                <div class="col-span-1 border border-gray-700 rounded-xl p-4 bg-slate-900/50">
                  <div class="h-4 w-1/3 bg-gray-700 rounded mb-4"></div>
                  <div class="space-y-3">
                    <div class="flex gap-2"><div class="w-8 h-8 rounded bg-blue-500/20 shrink-0"></div><div class="flex-1 space-y-2"><div class="h-3 bg-gray-700/50 rounded w-full"></div><div class="h-3 bg-gray-700/50 rounded w-2/3"></div></div></div>
                    <div class="flex gap-2"><div class="w-8 h-8 rounded bg-purple-500/20 shrink-0"></div><div class="flex-1 space-y-2"><div class="h-3 bg-gray-700/50 rounded w-full"></div><div class="h-3 bg-gray-700/50 rounded w-1/2"></div></div></div>
                  </div>
                </div>
                <div class="col-span-2 border border-gray-700 rounded-xl p-4 bg-slate-900/50 flex flex-col justify-center items-center relative overflow-hidden">
                   <div class="absolute right-0 top-0 w-32 h-32 bg-pink-500/10 blur-3xl"></div>
                   <div class="w-full max-w-md bg-white rounded-lg p-4 shadow-xl mb-4 relative z-10 opacity-90 transform scale-95 border-l-4 border-blue-500">
                      <div class="flex items-center gap-2 mb-2">
                        <div class="font-bold text-xs text-blue-800 uppercase">Google Ad Preview</div>
                      </div>
                      <div class="text-[#1a0dab] font-medium text-lg mb-1 line-clamp-1">Urban Roots | Buy Rare Indoor Plants Online</div>
                      <div class="text-gray-600 text-sm line-clamp-2">Shop our exclusive collection of rare Philodendrons. Hand-picked, healthy plants delivered to your door.</div>
                   </div>
                   <div class="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm font-bold shadow-lg z-10 flex items-center gap-2">
                      <Zap class="w-4 h-4" /> Deploy to Google Ads
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Features Section -->
    <section class="py-24 bg-[#111827] relative border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-5xl font-bold mb-4">From Meta to Google in Seconds</h2>
          <p class="text-gray-400 text-lg max-w-2xl mx-auto">Our AI analyzes your Facebook and Instagram success and instantly translates it into a high-converting Google Ads strategy.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-[#1e293b] border border-gray-800 p-8 rounded-2xl hover:border-blue-500/50 transition-colors group">
            <div class="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <RefreshCw class="w-7 h-7 text-blue-400" />
            </div>
            <h3 class="text-xl font-bold mb-3">AI Asset Extraction</h3>
            <p class="text-gray-400 leading-relaxed">
              Connect your Meta account. We automatically find your best-performing images, copy, and audience data to fuel your new campaigns.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-[#1e293b] border border-gray-800 p-8 rounded-2xl hover:border-purple-500/50 transition-colors group">
            <div class="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Smartphone class="w-7 h-7 text-purple-400" />
            </div>
            <h3 class="text-xl font-bold mb-3">Instant Landing Pages</h3>
            <p class="text-gray-400 leading-relaxed">
              We generate lightning-fast, conversion-optimized target pages tailored exactly to your extracted assets, maximizing your Google Quality Score.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-[#1e293b] border border-gray-800 p-8 rounded-2xl hover:border-pink-500/50 transition-colors group">
            <div class="w-14 h-14 bg-pink-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp class="w-7 h-7 text-pink-400" />
            </div>
            <h3 class="text-xl font-bold mb-3">One-Click Deployment</h3>
            <p class="text-gray-400 leading-relaxed">
              Review your structurally mapped Google Ads campaigns, adjust your budget with built-in ROI forecasting, and launch with a single click.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-[#0f172a] border-t border-gray-800 py-12">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center gap-2 grayscale opacity-50">
           <Logo />
           <span class="text-xl font-bold">Metamorph</span>
        </div>
        <div class="text-gray-500 text-sm">
          &copy; {{ new Date().getFullYear() }} Metamorph. All rights reserved.
        </div>
        <div class="flex gap-6 text-sm text-gray-500">
          <a href="#" class="hover:text-white transition-colors">Privacy</a>
          <a href="#" class="hover:text-white transition-colors">Terms</a>
          <a href="#" class="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
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
