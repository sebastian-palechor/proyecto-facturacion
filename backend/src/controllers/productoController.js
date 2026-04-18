const db = require('../config/db');

// Obtener todos los productos (sin los eliminados)
exports.obtenerProductos = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM productos WHERE deleted_at IS NULL');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener productos" });
    }
};

// Guardar un producto nuevo
exports.crearProducto = async (req, res) => {
    const { nombre, precio, tasa_impuesto, stock } = req.body;
    try {
        await db.query(
            'INSERT INTO productos (nombre, precio, tasa_impuesto, stock) VALUES (?, ?, ?, ?)',
            [nombre, precio, tasa_impuesto, stock]
        );
        res.json({ mensaje: "Producto guardado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al guardar el producto" });
    }
};