<template>
  <nav class="navbar">
    <div class="nav-brand">Facturacion</div>
    <ul class="nav-links">
      <li><router-link to="/dashboard" class="nav-item">Usuarios</router-link></li>
      <li><router-link to="/productos" class="nav-item">Productos</router-link></li>
       <li><router-link to="/clientes" class="nav-item">Clientes</router-link></li>
      <li><router-link to="/facturas" class="nav-item">Facturas</router-link></li>
      <li><router-link to="/historial" class="nav-item">Historial</router-link></li>
      
            
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
  /* Aseguramos que ocupe todo el ancho */
  width: 100%;
  box-sizing: border-box; 
  position: relative;
  z-index: 1000;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3498db;
  white-space: nowrap;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 20px;
  margin: 0;
  padding: 0;
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
  white-space: nowrap;
}

/* --- AJUSTES PARA MÓVIL --- */
@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap; 
    padding: 1rem;
  }

  .nav-links {
    
    width: 100%;
    order: 3; 
    justify-content: space-around;
    gap: 10px;
    margin-top: 15px;
    overflow-x: auto; 
    padding-bottom: 5px;
  }

  .nav-item {
    font-size: 0.9rem;
  }

  .nav-brand {
    font-size: 1.2rem;
  }

  .btn-logout {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
}
</style>