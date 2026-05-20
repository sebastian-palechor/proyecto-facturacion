import * as productoModel from "../models/productoModel.js";


export const listarProductos = async (req, res) => {
    try {
        const productos = await productoModel.obtenerTodos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
};


export const guardarProducto = async (req, res) => {
    const { nombre, precio, stock } = req.body;
    try {
        const id = await productoModel.crear(nombre, precio, stock);
        res.status(201).json({ mensaje: "Producto guardado", id });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar el producto" });
    }
};

export const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, stock } = req.body;
    try {
        await productoModel.actualizar(id, nombre, precio, stock);
        res.json({ mensaje: "Producto actualizado" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar" });
    }
};
s
export const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        await productoModel.eliminar(id);
        res.json({ mensaje: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar:", error);
        res.status(500).json({ 
            error: "No se pudo eliminar. Verifica si el producto tiene facturas asociadas." 
        });
    }
};