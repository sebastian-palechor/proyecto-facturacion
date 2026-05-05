<template>
  <div class="clientes-page-wrapper">
    <div class="clientes-card-container">
      
      <header class="clientes-header">
        <h1>Gestión de Clientes</h1>
      </header>

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
            <tr v-for="cliente in listaClientes" :key="cliente.id">
              <td><span class="id-badge">#{{ cliente.id }}</span></td>
              <td class="font-medium">{{ cliente.nombre }}</td>
              <td>{{ cliente.telefono }}</td>
              <td class="text-center">
                <button @click="prepararEdicion(cliente)" class="btn-action edit" title="Editar">✏️</button>
                <button @click="eliminarCliente(cliente.id)" class="btn-action delete" title="Eliminar">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <p v-if="mensaje" class="status-msg">
        {{ mensaje }}
      </p>

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
import { ref, onMounted } from 'vue';
import axios from 'axios';
import '@/assets/css/clientes.css'; 

// --- ESTADO ---
const nombre = ref('');
const telefono = ref('');
const mensaje = ref('');
const listaClientes = ref([]);
const editando = ref(false);
const clienteEditado = ref({ id: null, nombre: '', telefono: '' });

const cargarClientes = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/clientes');
    listaClientes.value = res.data;
  } catch (error) {
    console.error("Error al cargar clientes:", error);
  }
};

// Crear
const handleRegistroCliente = async () => {
  try {
    await axios.post('http://localhost:3000/api/clientes/registrar', {
      nombre: nombre.value,
      telefono: telefono.value
    });
    mensaje.value = "¡Cliente registrado!";
    nombre.value = '';
    telefono.value = '';
    cargarClientes();
    setTimeout(() => mensaje.value = '', 3000);
  } catch (error) {
    alert("Error al guardar");
  }
};

// Eliminar
const eliminarCliente = async (id) => {
  if (confirm("¿Estás seguro de eliminar este cliente?")) {
    try {
      await axios.delete(`http://localhost:3000/api/clientes/${id}`);
      cargarClientes();
    } catch (error) {
      alert("Error al eliminar");
    }
  }
};

// Preparar Edición
const prepararEdicion = (cliente) => {
  clienteEditado.value = { ...cliente }; 
  editando.value = true;
};

// Actualizar (PUT)
const actualizarCliente = async () => {
  try {
    await axios.put(`http://localhost:3000/api/clientes/${clienteEditado.value.id}`, {
      nombre: clienteEditado.value.nombre,
      telefono: clienteEditado.value.telefono
    });
    editando.value = false;
    cargarClientes();
    mensaje.value = "Cliente actualizado";
    setTimeout(() => mensaje.value = '', 3000);
  } catch (error) {
    alert("Error al actualizar");
  }
};

onMounted(cargarClientes);
</script>