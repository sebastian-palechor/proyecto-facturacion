<template>
  <div class="clientes-page-wrapper">
    <div class="clientes-card-container">
      <header class="clientes-header">
        <h1>Gestión de Clientes</h1>
      </header>

      <section class="search-card">
        <input class="search-input" v-model="filtroCliente" placeholder="Buscar por nombre o teléfono" />
      </section>

      <section class="clientes-form-box">
        <h3>Registrar Nuevo Cliente</h3>
        <form @submit.prevent="handleRegistroCliente" class="form-flex">
          <div class="input-field">
            <label>Nombre Completo</label>
            <input v-model="nombre" type="text" placeholder="Ej. Carlos Pérez" required />
          </div>
          <div class="input-field">
            <label>Teléfono</label>
            <input v-model="telefono" type="text" placeholder="300 123 4567" required />
          </div>
          <button type="submit" class="btn-add-cliente">Guardar Cliente</button>
        </form>
      </section>

      <section class="table-wrapper">
        <table class="clientes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Cliente</th>
              <th>Teléfono de Contacto</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cliente in clientesFiltrados" :key="cliente.id">
              <td data-label="ID"><span class="id-badge">#{{ cliente.numero }}</span></td>
              <td data-label="Nombre" class="font-medium">{{ cliente.nombre }}</td>
              <td data-label="Teléfono">{{ cliente.telefono }}</td>
              <td data-label="Acciones" class="text-center">
                <button @click="prepararEdicion(cliente)" class="btn-action edit">✏️</button>
                <button @click="eliminarCliente(cliente.id)" class="btn-action delete">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <p v-if="mensaje" class="status-msg">{{ mensaje }}</p>
    </div>

    <div v-if="editando" class="modal-overlay">
      <div class="modal-content">
        <h3>Editar Cliente</h3>
        <div class="modal-form">
          <div class="input-field">
            <label>Nombre</label>
            <input v-model="clienteEditado.nombre" type="text" />
          </div>
          <div class="input-field modal-spacing">
            <label>Teléfono</label>
            <input v-model="clienteEditado.telefono" type="text" />
          </div>
        </div>
        <div class="modal-actions">
          <button @click="actualizarCliente" class="btn-add-cliente">Guardar Cambios</button>
          <button @click="editando = false" class="btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import '@/assets/css/clientes.css'; 

const filtroCliente = ref('');
const nombre = ref('');
const telefono = ref('');
const mensaje = ref('');
const listaClientes = ref([]);
const editando = ref(false);
const clienteEditado = ref({ id: null, nombre: '', telefono: '' });

const clientesFiltrados = computed(() => {
  const listado = listaClientes.value.map((c, i) => ({ ...c, numero: i + 1 }));
  const termino = filtroCliente.value.trim().toLowerCase();
  if (!termino) return listado;
  return listado.filter(cliente => {
    const nombreLower = cliente.nombre.toLowerCase();
    const telefonoLower = cliente.telefono.toLowerCase();
    return nombreLower.includes(termino) || telefonoLower.includes(termino);
  });
});

const API_URL = 'http://localhost:3000/api/clientes';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

const cargarClientes = async () => {
  try {
    const res = await axios.get(API_URL, getAuthHeader());
    listaClientes.value = res.data.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error("Error al cargar:", error);
  }
};

const handleRegistroCliente = async () => {
  try {
    await axios.post(API_URL, {
      nombre: nombre.value,
      telefono: telefono.value
    }, getAuthHeader());

    mensaje.value = "¡Cliente registrado!";
    nombre.value = '';
    telefono.value = '';
    cargarClientes(); 
    setTimeout(() => mensaje.value = '', 3000);
  } catch (error) {
    const errorDb = error.response?.data?.detalles || "Error desconocido en el servidor";
    alert("Error de base de datos: " + errorDb);
  }
};

const eliminarCliente = async (id) => {
  if (confirm("¿Estás seguro de eliminar este cliente?")) {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthHeader());
      cargarClientes(); // Recarga la lista para ver el cambio
    } catch (error) {
      alert("No se pudo eliminar el cliente");
    }
  }
};

const prepararEdicion = (cliente) => {
  clienteEditado.value = { ...cliente }; 
  editando.value = true;
};

const actualizarCliente = async () => {
  try {
    await axios.put(`${API_URL}/${clienteEditado.value.id}`, {
      nombre: clienteEditado.value.nombre,
      telefono: clienteEditado.value.telefono
    }, getAuthHeader());
    
    editando.value = false;
    cargarClientes();
    mensaje.value = "Cliente actualizado correctamente";
    setTimeout(() => mensaje.value = '', 3000);
  } catch (error) {
    alert("Error al intentar actualizar");
  }
};
onMounted(cargarClientes);
</script>