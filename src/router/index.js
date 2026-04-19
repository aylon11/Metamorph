import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ConnectView from '../views/ConnectView.vue'
import ProcessingView from '../views/ProcessingView.vue'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/connect',
      name: 'connect',
      component: ConnectView
    },
    {
      path: '/processing',
      name: 'processing',
      component: ProcessingView
    },
    {
      path: '/assets',
      name: 'assets',
      component: () => import('../views/AssetSummaryView.vue')
    },
    {
      path: '/generated-site',
      name: 'generated-site',
      component: () => import('../views/MockLandingPage.vue')
    },
    {
      path: '/config',
      name: 'config',
      component: () => import('../views/ConfigView.vue')
    },
    {
      path: '/draft-processing',
      name: 'draft-processing',
      component: () => import('../views/DraftProcessingView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('../views/SignInView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/performance-dashboard',
      name: 'performance-dashboard',
      component: () => import('../views/PerformanceDashboardView.vue')
    }
  ]
})

export default router
