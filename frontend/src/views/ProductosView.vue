<template>
  <div class="dashboard-layout">
    <main class="main-content">
      <header class="top-bar">
        <h2>Gestión de Inventario</h2>
      </header>

      <div class="form-card">
        <!-- Los placeholders ahora serán visibles porque el valor inicial no es 0 -->
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
import '@/assets/css/productos.css';

const router = useRouter();
const productos = ref([]);

// Modificado: Se inicializa con null para que los inputs numéricos aparezcan vacíos
const nuevoProducto = ref({ nombre: '', precio: null, stock: null });

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
    
    // Modificado: Al limpiar el formulario usamos null para que vuelvan a aparecer los placeholders
    nuevoProducto.value = { nombre: '', precio: null, stock: null };
    
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