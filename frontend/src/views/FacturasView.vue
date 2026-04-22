<template>
  <main class="main-content">
    <header class="top-bar">
      <h2>Nueva Factura</h2>
    </header>

    <div class="factura-grid">
      <section>
        <div class="search-box">
          <label>Buscar Producto</label>
          <select @change="agregarAlCarrito($event.target.value)" class="custom-select">
            <option value="">Seleccione un producto...</option>
            <option v-for="p in productosDisponibles" :key="p.id" :value="p.id">
              {{ p.nombre }} - ${{ p.precio }} (Stock: {{ p.stock }})
            </option>
          </select>
        </div>

        <div class="items-card">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in carrito" :key="index">
                <td>{{ item.nombre }}</td>
                <td>
                  <input type="number" v-model.number="item.cantidad" min="1" class="cant-input" />
                </td>
                <td>${{ item.precio }}</td>
                <td>${{ (item.cantidad * item.precio).toFixed(2) }}</td>
                <td>
                  <button @click="quitarDelCarrito(index)" class="btn-delete">❌</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <aside class="resumen-card">
        <h3>Resumen</h3>
        
        <div class="form-group" style="margin-bottom: 15px;">
          <label>Cliente</label>
          <select v-model="clienteSeleccionado" class="custom-select">
            <option disabled value="">Seleccione un cliente</option>
            <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
              {{ cliente.nombre }} </option>
          </select>
        </div>

        <p>Cliente: <strong>{{ nombreClienteActivo }}</strong></p>
        <hr />
        
        <div class="resumen-detalle">
          <p>Items: {{ carrito.length }}</p>
          <div class="total-row">
            <span>TOTAL:</span>
            <span>${{ calcularTotal.toFixed(2) }}</span>
          </div>
        </div>
        
        <button @click="generarFactura" class="btn-finalizar" :disabled="carrito.length === 0 || !clienteSeleccionado">
          Finalizar Venta
        </button>
      </aside>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import '@/assets/css/dashboard.css';
import '@/assets/css/facturas.css';

const productosDisponibles = ref([]);
const carrito = ref([]);
const clientes = ref([]);
const clienteSeleccionado = ref(''); 

// Carga inicial de datos
onMounted(async () => {
  cargarProductos();
  cargarClientes();
});

const cargarClientes = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/clientes');
    clientes.value = res.data;
  } catch (error) {
    console.error("Error al cargar clientes:", error);
  }
};

const cargarProductos = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/productos');
    productosDisponibles.value = res.data;
  } catch (error) {
    console.error("Error al cargar productos", error);
  }
};

// Obtener el nombre del cliente seleccionado para mostrarlo en el resumen
const nombreClienteActivo = computed(() => {
  if (!clienteSeleccionado.value) return "No seleccionado";
  const cliente = clientes.value.find(c => c.id == clienteSeleccionado.value);
  return cliente ? cliente.nombre : "No seleccionado";
});

const agregarAlCarrito = (id) => {
  if (!id) return;
  const prod = productosDisponibles.value.find(p => p.id == id);
  const existe = carrito.value.find(item => item.id == id);
  
  if (existe) {
    existe.cantidad++;
  } else {
    carrito.value.push({
      id: prod.id,
      nombre: prod.nombre,
      precio: prod.precio,
      cantidad: 1
    });
  }
};

const quitarDelCarrito = (index) => {
  carrito.value.splice(index, 1);
};

const calcularTotal = computed(() => {
  return carrito.value.reduce((acc, item) => acc + (item.cantidad * item.precio), 0);
});

const generarFactura = () => {
  const cliente = clientes.value.find(c => c.id == clienteSeleccionado.value);
  alert(`Factura generada para ${cliente.nombre} por un total de $${calcularTotal.value.toFixed(2)}`);
};
</script>

<style scoped>
.cant-input { width: 60px; padding: 5px; border-radius: 4px; border: 1px solid #ccc; }
.custom-select { width: 100%; padding: 10px; border-radius: 5px; margin-top: 5px; background-color: white; border: 1px solid #ddd; }
.form-group label { font-weight: bold; font-size: 0.9rem; color: #555; }
</style>