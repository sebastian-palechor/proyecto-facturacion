import * as productoModel from "../models/productoModel.js";

export const listarProductos = async (req, res) => {
    try {
        const productos = await productoModel.obtenerTodos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
};