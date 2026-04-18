<template>
  <div class="dashboard-container">
    <header class="header">
      <h1>Panel de Inscripciones</h1>
      <button @click="cerrarSesion" class="btn-logout">Cerrar Sesión</button>
    </header>

    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>Datos de Inscripción</th>
            <th>Correo</th>
            <th>Facultad</th>
            <th>Rol</th>
            <th>Fecha Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.id">
            <td>{{ usuario.datos_de_inscripcion }}</td>
            <td>{{ usuario.correo }}</td>
            <td>{{ usuario.facultad }}</td>
            <td><span class="badge">{{ usuario.rol }}</span></td>
            <td>{{ formatearFecha(usuario.created_at) }}</td>
            <td>
              <button @click="editar(usuario.id)" class="btn-edit">✏️</button>
              <button @click="eliminar(usuario.id)" class="btn-delete">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

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

<style scoped>
.dashboard-container { padding: 20px; font-family: sans-serif; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.table-wrapper { overflow-x: auto; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
.data-table { width: 100%; border-collapse: collapse; text-align: left; }
.data-table th, .data-table td { padding: 12px 15px; border-bottom: 1px solid #eee; }
.data-table th { background-color: #f8f9fa; color: #333; }
.badge { background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
.btn-logout { background: #ff5252; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; }
.btn-edit { margin-right: 5px; background: none; border: none; cursor: pointer; }
.btn-delete { background: none; border: none; cursor: pointer; }
</style>