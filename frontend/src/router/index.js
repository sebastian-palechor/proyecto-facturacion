import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/registrar', component: () => import('../views/RegistroView.vue') },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  }, 
  {
    path: '/productos',
    name: 'Productos',
    component: () => import('../views/ProductosView.vue'),
    meta: { requiresAuth: true }
  },

  {
  path: '/facturas',
  name: 'facturas',
  component: () => import('../views/FacturasView.vue'), 
  meta: { requiresAuth: true }
},

 {
  path: '/clientes',
  name: 'Clientes',
  component: () => import('../views/ClientesView.vue'), 
  meta: { requiresAuth: true }
},

{
  path: '/historial',
  name: 'Historial',
  component: () => import('../views/ListaFacturas.vue'), 
  meta: { requiresAuth: true }
}

  
]; 

const router = createRouter({
  history: createWebHistory(),
  routes
});


router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token'); // 

  if (to.meta.requiresAuth && !isAuthenticated) {
    
    next('/login');
  } else {
    
    next();
  }
});

export default router;