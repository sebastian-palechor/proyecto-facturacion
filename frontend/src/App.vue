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

const mostrarNavbar = computed(() => {
  return route.path !== '/login' && route.path !== '/registrar' && route.path !== '/';
});
</script>

<style>

#app {
  font-family: 'Inter', sans-serif;
}
:global(body), :global(html) {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden; 
}

#app {
  width: 100%;
  margin: 0;
  padding: 0;
  max-width: 100vw;
}
</style>