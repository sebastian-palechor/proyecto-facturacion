<template>
  <div id="app">
    <Navbar v-if="mostrarNavbar" />
    
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';

const route = useRoute();

// No mostramos el navbar en Login o Registro
const mostrarNavbar = computed(() => {
  return route.path !== '/login' && route.path !== '/registrar' && route.path !== '/';
});
</script>

<style>
/* Estilos globales para que el contenido no quede pegado al navbar */
#app {
  font-family: 'Inter', sans-serif;
}
</style>