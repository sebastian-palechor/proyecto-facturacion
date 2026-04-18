const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. PRIMERO creas la app
const app = express(); 

// 2. DESPUÉS usas los middleware
app.use(cors());
app.use(express.json());

// 3. LUEGO las rutas
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const productoRoutes = require('./routes/productoRoutes');
app.use('/api/productos', productoRoutes);

// 4. AL FINAL el listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});