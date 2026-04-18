// ... (código anterior)
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/auth', authRoutes); // <--- Añade esto

// ... (resto del código)
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta inicial de prueba
app.get('/', (req, res) => {
    res.send('Servidor de Facturación funcionando 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});