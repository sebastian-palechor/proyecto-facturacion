import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/registrar', component: import('../views/RegistroView.vue') },
  { 
    path: '/dashboard', 
    component: DashboardView,
    meta: { requiresAuth: true } // <--- Marcamos que esta ruta necesita candado
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// ESTO ES EL GUARDIÁN (Navigation Guard)
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token'); // ¿Hay token?

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Si la ruta pide auth y NO hay token, mándalo al login
    next('/login');
  } else {
    // Si todo está bien, déjalo pasar
    next();
  }
});

export default router;