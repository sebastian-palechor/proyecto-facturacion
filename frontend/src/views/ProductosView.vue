<template>
  <div class="dashboard-layout">
    <nav class="navbar-top">
      <div class="sidebar-logo">MI PROYECTO</div>
      <div class="nav-links-horizontal">
        <router-link to="/dashboard" class="nav-item">🏠 Usuarios</router-link>
        <router-link to="/productos" class="nav-item active">📦 Productos</router-link>
        <router-link to="/facturas" class="nav-item">📑 Facturas</router-link>
      </div>
      <button @click="cerrarSesion" class="btn-danger">Cerrar Sesión</button>
    </nav>

    <main class="main-content">
      <header class="top-bar">
        <h2>Gestión de Inventario</h2>
      </header>

      <div class="form-card">
        <input v-model="nuevoProducto.nombre" placeholder="Nombre del producto" />
        <input v-model.number="nuevoProducto.precio" type="number" placeholder="Precio" />
        <input v-model.number="nuevoProducto.stock" type="number" placeholder="Stock inicial" />
        <button @click="guardarProducto" class="btn-success">Guardar Producto</button>
      </div>

      <div class="table-card">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in productos" :key="p.id">
              <td>{{ p.nombre }}</td>
              <td>${{ p.precio }}</td>
              <td>{{ p.stock }}</td>
              <td>
                <button @click="eliminar(p.id)" class="btn-delete">🗑️</button>
              </td>
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

const router = useRouter();
const productos = ref([]);
const nuevoProducto = ref({ nombre: '', precio: 0, stock: 0 });

const cargarProductos = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/productos');
    productos.value = res.data;
  } catch (error) {
    console.error("Error al cargar productos", error);
  }
};

const guardarProducto = async () => {
  try {
    await axios.post('http://localhost:3000/api/productos', nuevoProducto.value);
    nuevoProducto.value = { nombre: '', precio: 0, stock: 0 }; // Limpiar formulario
    cargarProductos(); // Recargar tabla
  } catch (error) {
    alert("Error al guardar");
  }
};

const cerrarSesion = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

onMounted(cargarProductos);
</script>

<style scoped>
.form-card { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; display: flex; gap: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.form-card input { padding: 8px; border: 1px solid #ddd; border-radius: 4px; flex: 1; }
.btn-success { background: #27ae60; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
.btn-delete { background: none; border: none; cursor: pointer; font-size: 1.2rem; }
</style>