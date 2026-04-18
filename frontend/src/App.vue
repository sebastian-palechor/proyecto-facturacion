<template>
  <nav v-if="authStore.token">
    <router-link to="/dashboard">Dashboard</router-link> |
    <button @click="handleLogout">Cerrar Sesión</button>
  </nav>
  <nav v-else>
    <router-link to="/login">Login</router-link> |
    <router-link to="/registrar">Registro</router-link>
  </nav>

  <router-view />
</template>

<script setup>
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style>
/* Un estilo básico para que no se vea desordenado */
nav { padding: 20px; background: #f4f4f4; margin-bottom: 20px; }
input { display: block; margin: 10px 0; padding: 8px; }
button { cursor: pointer; background: #42b983; color: white; border: none; padding: 10px; }
</style>