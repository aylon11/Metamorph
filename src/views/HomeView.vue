<script setup>
import { useRouter } from 'vue-router'
import { ArrowRight, Zap, RefreshCw, TrendingUp, CheckCircle, Smartphone } from 'lucide-vue-next'
import Logo from '../components/Logo.vue'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-stone-50 text-slate-900 font-sans overflow-x-hidden selection:bg-emerald-500/20">
    <!-- Navbar -->
    <nav class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3 cursor-pointer" @click="router.push('/')">
           <Logo size="w-8 h-8" />
           <span class="text-xl font-extrabold tracking-tight text-slate-900">Metamorph</span>
        </div>
        <div class="flex items-center gap-6">
          <button @click="router.push('/sign-in')" class="text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors">
            Sign In
          </button>
          <button 
            @click="router.push('/connect')"
            class="text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-slate-900/10"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <main class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <!-- Background Decorative Elements -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40">
        <div class="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-100 blur-[120px] rounded-full"></div>
        <div class="absolute top-[200px] right-[-100px] w-[400px] h-[400px] bg-emerald-100 blur-[100px] rounded-full"></div>
      </div>

      <div class="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 text-slate-600 text-sm font-medium mb-8 animate-fade-in-up shadow-sm">
          <span class="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
          Powered by Gemini
        </div>

        <h1 class="text-6xl md:text-8xl font-black tracking-tighter mb-6 animate-fade-in-up">
          <span class="text-slate-950">Metamorph</span>
        </h1>

        <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-8 animate-fade-in-up leading-tight text-slate-900">
          Expand to Google Ads <span class="text-emerald-500">in One Click</span>
        </h2>

        <p class="text-xl text-slate-600 max-w-2xl mx-auto mb-12 animate-fade-in-up leading-relaxed">
          Instantly deploy highly optimized Google Ads campaigns based on your existing, top-performing Meta campaigns. Scale your business automatically.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up mb-20">
          <button 
            @click="router.push('/connect')"
            class="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-slate-900 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-slate-800 hover:scale-[1.02] shadow-xl shadow-slate-900/10 w-full sm:w-auto"
          >
            <span class="relative z-10 flex items-center gap-2">
              Connect Meta Account
              <ArrowRight class="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
          <div class="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
            <CheckCircle class="w-4 h-4 text-green-500" /> Professional Grade AI
          </div>
        </div>

        <!-- Dashboard mockup preview -->
        <div class="relative mx-auto max-w-5xl animate-fade-in-up hidden md:block group">
          <div class="absolute -inset-4 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 rounded-[32px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div class="rounded-2xl border border-stone-200 bg-white p-3 shadow-2xl relative overflow-hidden glass-card">
             <!-- Mock UI Header -->
             <div class="flex items-center justify-between mb-4 px-4 pt-2 border-b border-stone-100 pb-3">
               <div class="flex gap-2">
                <div class="w-3 h-3 rounded-full bg-stone-200"></div>
                <div class="w-3 h-3 rounded-full bg-stone-200"></div>
                <div class="w-3 h-3 rounded-full bg-stone-200"></div>
               </div>
               <div class="h-2 w-32 bg-stone-100 rounded-full"></div>
             </div>
             <!-- Mock UI Content -->
             <div class="grid grid-cols-3 gap-6 px-4 pb-4">
                <div class="col-span-1 border border-stone-100 rounded-2xl p-4 bg-stone-50/50">
                  <div class="h-3 w-1/2 bg-stone-200 rounded mb-6"></div>
                  <div class="space-y-4">
                    <div class="flex gap-3"><div class="w-10 h-10 rounded-xl bg-blue-500/10 shrink-0"></div><div class="flex-1 space-y-2 py-1"><div class="h-2 bg-stone-200 rounded w-full"></div><div class="h-2 bg-stone-200 rounded w-2/3"></div></div></div>
                    <div class="flex gap-3"><div class="w-10 h-10 rounded-xl bg-emerald-500/10 shrink-0"></div><div class="flex-1 space-y-2 py-1"><div class="h-2 bg-stone-200 rounded w-full"></div><div class="h-2 bg-stone-200 rounded w-1/2"></div></div></div>
                  </div>
                </div>
                <div class="col-span-2 border border-stone-100 rounded-2xl p-6 bg-stone-50/50 flex flex-col justify-center items-center relative overflow-hidden">
                   <div class="absolute right-[-20px] top-[-20px] w-40 h-40 bg-emerald-200/20 blur-3xl"></div>
                   <div class="w-full max-w-sm bg-white rounded-xl p-5 shadow-xl mb-6 relative z-10 border border-stone-100 group-hover:translate-y-[-4px] transition-transform duration-500">
                      <div class="flex items-center gap-2 mb-3">
                        <div class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-500 uppercase tracking-wider">Preview</div>
                      </div>
                      <div class="text-[#1a0dab] font-bold text-lg mb-2 line-clamp-1">Urban Roots | Shop Rare Indoor Plants</div>
                      <div class="text-slate-600 text-sm line-clamp-2 leading-relaxed">Shop our exclusive collection of rare Philodendrons. Healthy plants delivered to your door.</div>
                   </div>
                   <div class="px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-xl z-10 flex items-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer">
                      <Zap class="w-4 h-4 text-emerald-500" /> Deploy to Google Ads
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Features Section -->
    <section class="py-24 bg-white relative border-t border-stone-200">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-950">From Meta to Google in Seconds</h2>
          <p class="text-slate-500 text-lg max-w-2xl mx-auto">Our AI analyzes your Facebook and Instagram success and instantly translates it into a high-converting Google Ads strategy.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-10">
          <!-- Feature 1 -->
          <div class="bg-stone-50/50 border border-stone-100 p-10 rounded-3xl hover:border-emerald-500/30 transition-all group hover:bg-white hover:shadow-2xl hover:shadow-stone-200/50">
            <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-stone-100 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <RefreshCw class="w-8 h-8 text-blue-500" />
            </div>
            <h3 class="text-2xl font-bold mb-4 text-slate-900">AI Asset Extraction</h3>
            <p class="text-slate-500 leading-relaxed text-lg">
              Connect your Meta account. We automatically find your best-performing images, copy, and audience data to fuel your new campaigns.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-stone-50/50 border border-stone-100 p-10 rounded-3xl hover:border-emerald-500/30 transition-all group hover:bg-white hover:shadow-2xl hover:shadow-stone-200/50">
            <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-stone-100 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
              <Smartphone class="w-8 h-8 text-emerald-500" />
            </div>
            <h3 class="text-2xl font-bold mb-4 text-slate-900">Instant Landing Pages</h3>
            <p class="text-slate-500 leading-relaxed text-lg">
              We generate lightning-fast, conversion-optimized target pages tailored exactly to your extracted assets, maximizing your Quality Score.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-stone-50/50 border border-stone-100 p-10 rounded-3xl hover:border-emerald-500/30 transition-all group hover:bg-white hover:shadow-2xl hover:shadow-stone-200/50">
            <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-stone-100 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <TrendingUp class="w-8 h-8 text-slate-900" />
            </div>
            <h3 class="text-2xl font-bold mb-4 text-slate-900">One-Click Deployment</h3>
            <p class="text-slate-500 leading-relaxed text-lg">
              Review your structurally mapped Google Ads campaigns, adjust your budget with built-in ROI forecasting, and launch with a single click.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white border-t border-stone-200 py-16">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-10">
          <div class="flex items-center gap-3">
             <Logo size="w-8 h-8" />
             <span class="text-xl font-black tracking-tight text-slate-900">Metamorph</span>
          </div>
          <div class="flex gap-10 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" class="hover:text-emerald-500 transition-colors">Privacy</a>
            <a href="#" class="hover:text-emerald-500 transition-colors">Terms</a>
            <a href="#" class="hover:text-emerald-500 transition-colors">Contact</a>
          </div>
          <div class="text-slate-400 text-sm font-medium">
            &copy; {{ new Date().getFullYear() }} Metamorph. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
