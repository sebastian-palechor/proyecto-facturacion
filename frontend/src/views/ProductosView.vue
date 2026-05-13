<template>
  <div class="dashboard-layout">
    <main class="main-content">
      <header class="top-bar">
        <h2>Gestión de Inventario</h2>
      </header>

      <div class="form-card">
        <input v-model="nuevoProducto.nombre" placeholder="Nombre del producto" />
        <input v-model.number="nuevoProducto.precio" type="number" placeholder="Precio" />
        <input v-model.number="nuevoProducto.stock" type="number" placeholder="Stock inicial" />
        <button @click="handleGuardar" class="btn-success">Guardar Producto</button>
      </div>

     <div class="table-card">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in productos" :key="p.id">
              <td data-label="Nombre">{{ p.nombre }}</td>
              <td data-label="Precio">${{ p.precio }}</td>
              <td data-label="Stock">{{ p.stock }}</td>
              <td data-label="Acciones" class="text-center">
                <button @click="prepararEdicion(p)" class="btn-edit" style="margin-right: 10px;">✏️</button>
                <button @click="handleEliminar(p.id)" class="btn-delete">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <div v-if="editando" class="modal-overlay">
      <div class="modal-content">
        <h3>Editar Producto</h3>
        <div class="modal-form">
          <div class="input-field">
            <label>Nombre</label>
            <input v-model="productoEditado.nombre" type="text" />
          </div>
          <div class="input-field">
            <label>Precio</label>
            <input v-model.number="productoEditado.precio" type="number" />
          </div>
          <div class="input-field">
            <label>Stock</label>
            <input v-model.number="productoEditado.stock" type="number" />
          </div>
        </div>
        <div class="modal-actions">
          <button @click="handleActualizar" class="btn-success">Guardar Cambios</button>
          <button @click="editando = false" class="btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; 
import '@/assets/css/productos.css';

const router = useRouter();
const API_URL = 'http://localhost:3000/api/productos';
const productos = ref([]);
const nuevoProducto = ref({ nombre: '', precio: null, stock: null });

// Estado para la edición
const editando = ref(false);
const productoEditado = ref({ id: null, nombre: '', precio: null, stock: null });

// Función para enviar el token en las peticiones
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

const cargarProductos = async () => {
  try {
    const res = await axios.get(API_URL, getAuthHeader());
    productos.value = res.data;
  } catch (error) {
    console.error("Error al cargar productos", error);
  }
};

const handleGuardar = async () => {
  try {
    await axios.post(API_URL, nuevoProducto.value, getAuthHeader());
    nuevoProducto.value = { nombre: '', precio: null, stock: null };
    cargarProductos(); 
  } catch (error) {
    alert("Error al guardar producto");
  }
};

const handleEliminar = async (id) => {
  if (confirm("¿Estás seguro de eliminar este producto?")) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      cargarProductos(); // Recarga la tabla
    } catch (error) {
      // Esto mostrará el mensaje específico del servidor
      alert(error.response?.data?.error || "Error al eliminar");
    }
  }
};
const prepararEdicion = (producto) => {
  productoEditado.value = { ...producto };
  editando.value = true;
};

const handleActualizar = async () => {
  try {
    await axios.put(`${API_URL}/${productoEditado.value.id}`, productoEditado.value, getAuthHeader());
    editando.value = false;
    cargarProductos();
  } catch (error) {
    alert("Error al actualizar producto");
  }
};

onMounted(cargarProductos);
</script>