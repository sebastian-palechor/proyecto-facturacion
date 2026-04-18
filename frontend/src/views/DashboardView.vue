<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="sidebar-logo">MI PROYECTO</div>
      <nav class="nav-links">
        <a href="#" class="nav-item active">🏠 Dashboard</a>
        <a href="#" class="nav-item">👤 Usuarios</a>
      </nav>
    </aside>

    <main class="main-content">
      <header class="top-bar">
        <h2>Listado de Usuarios</h2>
        <button @click="cerrarSesion" class="btn-danger">Cerrar Sesión</button>
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
    const res = await axios.get('http://localhost:3000/api/auth/usuarios'); // <--- Verifica esta URL
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
