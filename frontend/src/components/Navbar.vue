<template>
  <nav class="navbar">
    <div class="nav-brand">FacturaPro</div>
    <ul class="nav-links">
      <li><router-link to="/dashboard" class="nav-item">Usuarios</router-link></li>
      <li><router-link to="/productos" class="nav-item">Productos</router-link></li>
      <li><router-link to="/facturas" class="nav-item">Facturas</router-link></li>
    </ul>
    <div class="nav-actions">
      <button @click="cerrarSesion" class="btn-logout">Cerrar Sesión</button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const cerrarSesion = () => {
  localStorage.removeItem('token');
  router.push('/login');
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50;
  padding: 1rem 2rem;
  color: white;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3498db;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 20px;
}

.nav-item {
  color: #bdc3c7;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-item:hover, .router-link-active {
  color: white;
}

.btn-logout {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-logout:hover {
  background-color: #c0392b;
}
</style>