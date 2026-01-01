import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth.store'

// Lazy load pages for better performance
const LoginPage = () => import('../../features/auth/LoginPage.vue')
const DashboardPage = () => import('../../features/dashboard/DashboardPage.vue')
const SantriListPage = () => import('../../features/santri/SantriListPage.vue')
const PresensiPage = () => import('../../features/presensi/PresensiPage.vue')

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        meta: { requiresAuth: false },
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardPage,
        meta: { requiresAuth: true },
    },
    {
        path: '/santri',
        name: 'Santri',
        component: SantriListPage,
        meta: { requiresAuth: true },
    },
    {
        path: '/santri/:id',
        name: 'SantriDetail',
        component: () => import('../../features/santri/SantriDetailPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/presensi',
        name: 'Presensi',
        component: PresensiPage,
        meta: { requiresAuth: true },
    },
    {
        path: '/izin-santri',
        name: 'IzinSantri',
        component: () => import('../../features/izin-santri/IzinSantriPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../../features/profile/ProfilePage.vue'),
        meta: { requiresAuth: true },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const requiresAuth = to.meta.requiresAuth !== false

    if (requiresAuth && !authStore.isAuthenticated) {
        // Save the intended destination
        next({
            path: '/login',
            query: { redirect: to.fullPath },
        })
    } else if (to.path === '/login' && authStore.isAuthenticated) {
        // If already logged in and trying to access login, redirect to dashboard
        next('/dashboard')
    } else {
        next()
    }
})

export default router
