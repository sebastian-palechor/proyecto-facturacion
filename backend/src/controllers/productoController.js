const db = require('../config/db');

// Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM productos WHERE deleted_at IS NULL');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener productos", error: error.message });
    }
};

// Crear un producto nuevo
exports.crearProducto = async (req, res) => {
    const { nombre, precio, tasa_impuesto, stock } = req.body;
    try {
        const query = 'INSERT INTO productos (nombre, precio, tasa_impuesto, stock) VALUES (?, ?, ?, ?)';
        await db.query(query, [nombre, precio, tasa_impuesto, stock]);
        res.status(201).json({ mensaje: "Producto creado con éxito" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear producto", error: error.message });
    }
};