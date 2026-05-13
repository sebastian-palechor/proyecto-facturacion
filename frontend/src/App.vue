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
/* Esto asegura que el cuerpo de la página no tenga márgenes blancos por defecto */
:global(body), :global(html) {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden; /* Evita el scroll horizontal molesto */
}

#app {
  width: 100%;
  margin: 0;
  padding: 0;
  max-width: 100vw; /* Ocupa el ancho total de la ventana */
}
</style>