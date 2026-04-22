const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Tu conexión que usa promesas

// OBTENER TODOS LOS CLIENTES
router.get('/', async (req, res) => {
    try {
        // Al usar promesas, usamos await y desestructuramos [results]
        const [results] = await db.query('SELECT * FROM clientes ORDER BY id DESC');
        res.json(results);
    } catch (err) {
        console.error("Error al obtener clientes:", err);
        res.status(500).json({ error: "No se pudieron cargar los clientes" });
    }
});

// REGISTRAR UN NUEVO CLIENTE
router.post('/registrar', async (req, res) => {
    const { nombre, telefono } = req.body;
    try {
        const query = 'INSERT INTO clientes (nombre, telefono) VALUES (?, ?)';
        const [result] = await db.query(query, [nombre, telefono]);
        
        res.json({ mensaje: "Cliente guardado con éxito", id: result.insertId });
    } catch (err) {
        console.error("Error al registrar cliente:", err);
        res.status(500).json({ error: "No se pudo guardar el cliente" });
    }
});

// ELIMINAR CLIENTE
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM clientes WHERE id = ?', [req.params.id]);
        res.json({ mensaje: "Cliente eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// EDITAR CLIENTE
router.put('/:id', async (req, res) => {
    const { nombre, telefono } = req.body;
    try {
        await db.query('UPDATE clientes SET nombre = ?, telefono = ? WHERE id = ?', 
        [nombre, telefono, req.params.id]);
        res.json({ mensaje: "Cliente actualizado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;