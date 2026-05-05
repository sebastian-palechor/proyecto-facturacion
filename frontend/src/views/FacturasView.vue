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
          <div class="total-row small">
            <span>Subtotal:</span>
            <span>${{ calcularSubtotal.toFixed(2) }}</span>
          </div>
          <div class="total-row small">
            <span>IVA (19%):</span>
            <span>${{ calcularIVA.toFixed(2) }}</span>
          </div>
          <hr />
          <div class="total-row grand-total">
            <span>TOTAL:</span>
            <span>${{ calcularTotal.toFixed(2) }}</span>
          </div>
        </div>
        
        <button @click="generarFactura" class="btn-finalizar" :disabled="carrito.length === 0 || !clienteSeleccionado">
          Finalizar Venta
        </button>
      </aside>
    </div>

    <div v-if="mostrarModal" class="modal-overlay">
      <div class="modal-content" id="factura-a-imprimir">
        <div class="modal-header">
          <h1 style="margin:0">RESTAURANTE TEST</h1>
          <p>NIT: 900.123.456-1</p>
          <p>Bogotá, Colombia</p>
          <hr>
          <h3>COMPROBANTE DE VENTA</h3>
        </div>
        
        <div class="modal-body">
          <p><strong>Cliente:</strong> {{ clienteFactura }}</p>
          <p><strong>Fecha:</strong> {{ fechaFactura }}</p>
          
          <table class="tabla-modal">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Cant.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in facturaReciente" :key="item.id">
                <td>{{ item.nombre }}</td>
                <td>{{ item.cantidad }}</td>
                <td>${{ (item.cantidad * item.precio).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
          
          <hr>
          <div class="resumen-final">
            <div class="total-row"><span>Subtotal:</span> <span>${{ subtotalFinal.toFixed(2) }}</span></div>
            <div class="total-row"><span>IVA (19%):</span> <span>${{ ivaFinal.toFixed(2) }}</span></div>
            <div class="total-row" style="font-weight:bold; font-size:1.2em;">
              <span>TOTAL PAGADO:</span> <span>${{ totalFinal.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="imprimir" class="btn-print">🖨️ Imprimir</button>
          <button @click="cerrarModal" class="btn-close">Cerrar y Nueva Venta</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import '@/assets/css/facturas.css';

// Referencias de datos
const productosDisponibles = ref([]);
const carrito = ref([]);
const clientes = ref([]);
const clienteSeleccionado = ref(''); 

// Referencias para el Modal
const mostrarModal = ref(false);
const facturaReciente = ref([]);
const clienteFactura = ref('');
const fechaFactura = ref('');
const subtotalFinal = ref(0);
const ivaFinal = ref(0);
const totalFinal = ref(0);

onMounted(async () => {
  cargarProductos();
  cargarClientes();
});

const cargarClientes = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/clientes');
    clientes.value = res.data;
  } catch (error) { console.error("Error clientes:", error); }
};

const cargarProductos = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/productos');
    productosDisponibles.value = res.data;
  } catch (error) { console.error("Error productos:", error); }
};

// Cálculos de IVA y Totales
const calcularSubtotal = computed(() => {
  return carrito.value.reduce((acc, item) => acc + (item.cantidad * item.precio), 0);
});
const calcularIVA = computed(() => calcularSubtotal.value * 0.19);
const calcularTotal = computed(() => calcularSubtotal.value + calcularIVA.value);

const nombreClienteActivo = computed(() => {
  if (!clienteSeleccionado.value) return "No seleccionado";
  const cliente = clientes.value.find(c => c.id == clienteSeleccionado.value);
  return cliente ? cliente.nombre : "No seleccionado";
});

// Funciones del Carrito
const agregarAlCarrito = (id) => {
  if (!id) return;
  const prod = productosDisponibles.value.find(p => p.id == id);
  const existe = carrito.value.find(item => item.id == id);
  if (existe) {
    existe.cantidad++;
  } else {
    carrito.value.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, cantidad: 1 });
  }
};

const quitarDelCarrito = (index) => { carrito.value.splice(index, 1); };

// Lógica de Finalización
const generarFactura = async () => {
  if (!clienteSeleccionado.value || carrito.value.length === 0) return;

  const datosVenta = {
    cliente_id: clienteSeleccionado.value,
    subtotal: calcularSubtotal.value,
    iva: calcularIVA.value,
    total: calcularTotal.value,
    productos: carrito.value 
  };

  try {
    const res = await axios.post('http://localhost:3000/api/facturas/finalizar', datosVenta);
    
    // Preparar datos para el Modal
    facturaReciente.value = [...carrito.value];
    clienteFactura.value = nombreClienteActivo.value;
    fechaFactura.value = new Date().toLocaleString();
    subtotalFinal.value = calcularSubtotal.value;
    ivaFinal.value = calcularIVA.value;
    totalFinal.value = calcularTotal.value;
    
    // Mostrar Modal
    mostrarModal.value = true;

  } catch (error) {
    alert("❌ Error: " + (error.response?.data?.error || "Error al procesar la venta"));
  }
};

const imprimir = () => { window.print(); };

const cerrarModal = () => {
  mostrarModal.value = false;
  // Limpiar vista principal para la siguiente factura
  carrito.value = [];
  clienteSeleccionado.value = '';
  cargarProductos(); // Refrescar stock
};
</script>
