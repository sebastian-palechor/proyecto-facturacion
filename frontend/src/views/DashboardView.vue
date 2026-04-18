<template>
  <div class="dashboard-layout">
    <nav class="navbar-top">
      <div class="sidebar-logo">MI PROYECTO</div>
      <div class="nav-links-horizontal">
        <router-link to="/dashboard" class="nav-item active">🏠 Usuarios</router-link>
        <router-link to="/productos" class="nav-item">📦 Productos</router-link>
        <router-link to="/facturas" class="nav-item">📑 Facturas</router-link>
      </div>
      <button @click="cerrarSesion" class="btn-danger">Cerrar Sesión</button>
    </nav>

    <main class="main-content">
      <header class="top-bar">
        <h2>Listado de Usuarios</h2>
      </header>

      <div class="table-card">
        <table class="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Correo</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in usuarios" :key="u.id">
              <td>{{ u.id }}</td>
              <td>{{ u.correo }}</td>
              <td>{{ new Date(u.created_at).toLocaleDateString() }}</td>
              <td>...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import '@/assets/css/dashboard.css';

const usuarios = ref([]);
const router = useRouter();

const obtenerUsuarios = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/auth/usuarios');
    usuarios.value = res.data;
  } catch (error) {
    console.error("Error al cargar la tabla", error);
  }
};

const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString();

const cerrarSesion = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

onMounted(obtenerUsuarios);
</script>