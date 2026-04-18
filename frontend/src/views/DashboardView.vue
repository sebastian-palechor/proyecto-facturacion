<template>
  <div class="dashboard">
    <h1>🚀 Panel de Facturación</h1>
    <p>Bienvenido al sistema. Aquí podrás gestionar tus productos y facturas.</p>
    
    <div class="stats">
      <button @click="irAProductos">Gestionar Productos</button>
      <button @click="irAFacturas">Crear Factura</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const irAProductos = () => router.push('/productos');
const irAFacturas = () => router.push('/nueva-factura');
</script>

<style scoped>
.dashboard { padding: 40px; text-align: center; }
.stats { margin-top: 20px; display: flex; justify-content: center; gap: 10px; }
button { padding: 15px 25px; font-size: 16px; background-color: #42b983; color: white; border: none; border-radius: 5px; cursor: pointer; }
</style>