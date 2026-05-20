<template>
  <main class="main-content">
    <header class="top-bar">
      <h2>Nueva Factura</h2>
    </header>

    <div v-if="mensajeVenta" :class="['mensaje-venta', ventaExitosa ? 'exito' : 'error']">
      {{ mensajeVenta }}
    </div>

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
                <td data-label="PRODUCTO">{{ item.nombre }}</td>
                <td data-label="CANT.">
                  <input type="number" v-model.number="item.cantidad" min="1" class="cant-input" />
                </td>
                <td data-label="PRECIO">${{ item.precio }}</td>
                <td data-label="SUBTOTAL">${{ (item.cantidad * item.precio).toFixed(2) }}</td>
                <td data-label="ACCIONES">
                  <button @click="quitarDelCarrito(index)" class="btn-delete">❌</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <aside class="resumen-card">
        <h3>Resumen</h3>
        
        <div class="search-box">
          <label class="form-label">Seleccionar Cliente</label>
          <div class="select-wrapper">
            <select v-model="clienteSeleccionado" class="custom-select select-primary">
              <option value="" disabled selected>Seleccione un cliente...</option>
              <option v-for="c in clientes" :key="c.id" :value="c.id">
                {{ c.nombre }}
              </option>
            </select>
          </div>
        </div>

        <div class="search-box" style="margin-top: 12px;">
          <label class="form-label">Método de pago</label>
          <div class="select-wrapper">
            <select v-model="metodoPago" class="custom-select select-primary">
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>
        </div>

        <p style="margin-top: 15px;">Cliente: <strong>{{ nombreClienteActivo }}</strong></p>
        <p>Método de pago: <strong>{{ metodoPago }}</strong></p>
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
          <p><strong>Método de pago:</strong> {{ metodoPago }}</p>
          
          <table class="tabla-modal">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Cant.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in facturaReciente" :key="index">
                <td data-label="PRODUCTO">{{ item.nombre }}</td>
                <td data-label="CANT.">{{ item.cantidad }}</td>
                <td data-label="SUBTOTAL">${{ (item.cantidad * item.precio).toFixed(2) }}</td>
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
const metodoPago = ref('Efectivo');
const mensajeVenta = ref('');
const ventaExitosa = ref(false);
let mensajeTimeout = null;

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
    metodo_pago: metodoPago.value,
    productos: carrito.value 
  };

  try {
    const res = await axios.post('http://localhost:3000/api/facturas/finalizar', datosVenta);
    await cargarProductos(); // Refrescar stock inmediatamente después de la venta

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
    if (mensajeTimeout) {
      clearTimeout(mensajeTimeout);
    }
    mensajeVenta.value = 'Facturación no guardada';
    ventaExitosa.value = false;
    mensajeTimeout = setTimeout(() => {
      mensajeVenta.value = '';
      mensajeTimeout = null;
    }, 4000);
    alert("❌ Error: " + (error.response?.data?.error || "Error al procesar la venta"));
  }
};

const imprimir = () => { window.print(); };

const cerrarModal = () => {
  mostrarModal.value = false;
  // Mostrar mensaje de éxito al cerrar el modal
  if (mensajeTimeout) {
    clearTimeout(mensajeTimeout);
  }
  mensajeVenta.value = 'Facturación guardada con éxito';
  ventaExitosa.value = true;
  mensajeTimeout = setTimeout(() => {
    mensajeVenta.value = '';
    ventaExitosa.value = false;
    mensajeTimeout = null;
  }, 4000);

  
  carrito.value = [];
  clienteSeleccionado.value = '';
  metodoPago.value = 'Efectivo';
  cargarProductos(); 
};
</script>