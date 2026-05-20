<template>
  <main class="main-content">
    <header class="top-bar">
      <h2>Historial de Facturas</h2>
    </header>

    <div class="factura-grid">
      <section class="items-card" style="width: 100%; grid-column: span 2;">
        <div class="search-box" style="padding: 20px; border-bottom: 1px solid #eee;">
          <label class="form-label">Filtrar registros</label>
          <input 
            type="text" 
            v-model="filtro" 
            placeholder="Buscar por cliente, producto o # factura..." 
            class="custom-select"
          />
        </div>

        <table class="custom-table">
          <thead>
            <tr>
              <th>Factura #</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Cant.</th>
              <th>Precio Unit.</th>
              <th>IVA (19%)</th>
              <th>Método de pago</th>
              <th>Total Línea</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in facturasFiltradas" :key="item.id_detalle">
              <td><span class="factura-badge"># {{ item.factura_numero }}</span></td>
              <td>{{ formatDate(item.fecha) }}</td>
              <td>{{ item.cliente }}</td>
              <td>{{ item.producto }}</td>
              <td>{{ item.cantidad }}</td>
              <td>${{ item.precio_unitario.toLocaleString() }}</td>
              <td>${{ item.iva.toLocaleString() }}</td>
              <td>{{ item.metodo_pago }}</td>
              <td class="text-total">${{ item.total_linea.toLocaleString() }}</td>
            </tr>
            <tr v-if="facturasFiltradas.length === 0">
              <td colspan="9" style="text-align: center; padding: 30px; color: #95a5a6;">
                No se encontraron registros en el historial.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import '@/assets/css/facturas.css'; 

const listaFacturas = ref([]);
const filtro = ref('');

const cargarHistorial = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/facturas/historial');
    listaFacturas.value = res.data;
  } catch (error) {
    console.error("Error al obtener el historial de la base de datos:", error);
  }
};

const facturasFiltradas = computed(() => {
  const search = filtro.value.toLowerCase();
  // Filtramos primero por los términos de búsqueda
  const filtrado = listaFacturas.value.filter(f => 
    f.cliente.toLowerCase().includes(search) ||
    f.producto.toLowerCase().includes(search) ||
    f.factura_nro.toString().includes(search) ||
    f.metodo_pago.toLowerCase().includes(search)
  );

  const ordenado = [...filtrado].sort((a, b) => a.factura_nro - b.factura_nro);

  const mapa = new Map();
  let seq = 1;
  for (const f of ordenado) {
    if (!mapa.has(f.factura_nro)) {
      mapa.set(f.factura_nro, seq++);
    }
  }

  return filtrado.map(f => ({ ...f, factura_numero: mapa.get(f.factura_nro) }));
});

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  cargarHistorial();
});
</script>

<style scoped>
.factura-badge {
  background-color: #ebf8ff;
  color: #3182ce;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 0.9em;
}

.text-total {
  font-weight: bold;
  color: #2d3748;
}

.items-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  margin-top: 20px;
}

.custom-table th {
  background-color: #f8fafc;
  text-align: left;
  padding: 12px 15px;
  color: #718096;
}

.custom-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #edf2f7;
}

.custom-table tr:hover {
  background-color: #f7fafc;
}
</style>