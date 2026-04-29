import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import facturaRoutes from './routes/facturaRoutes.js';
import productoRoutes from './routes/productoRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Registro de las 4 Rutas Profesionales
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/productos', productoRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});