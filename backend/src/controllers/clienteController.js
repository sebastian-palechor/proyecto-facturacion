import * as clienteModel from "../models/clienteModel.js";

// Mostrar la lista de clientes
export const listarClientes = async (req, res) => {
    try {
        const clientes = await clienteModel.obtenerTodos();
        res.json(clientes);
    } catch (error) {
        console.error("Error en listarClientes:", error);
        res.status(500).json({ error: "Error al obtener la lista de clientes" });
    }
};

// Registrar un cliente
export const guardarCliente = async (req, res) => {
    const { nombre, telefono } = req.body;
    
    if (!nombre || !telefono) {
        return res.status(400).json({ error: "Nombre y teléfono son obligatorios" });
    }

    try {
        const id = await clienteModel.crear(nombre, telefono);
        res.status(201).json({ mensaje: "Cliente registrado con éxito", id });
    } catch (error) {
        console.error("Error en guardarCliente:", error);
        res.status(500).json({ error: "Error interno al guardar el cliente" });
    }
};

// Editar un cliente
export const actualizarCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono } = req.body;

    try {
        const resultado = await clienteModel.actualizar(id, nombre, telefono);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }
        res.json({ mensaje: "Cliente actualizado correctamente" });
    } catch (error) {
        console.error("Error en actualizarCliente:", error);
        res.status(500).json({ error: "Error al intentar editar el cliente" });
    }
};

// Borrar un cliente
export const eliminarCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const resultado = await clienteModel.eliminar(id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "El cliente ya no existe" });
        }
        res.json({ mensaje: "Cliente eliminado con éxito" });
    } catch (error) {
        console.error("Error en eliminarCliente:", error);
        res.status(500).json({ error: "Error al intentar eliminar el cliente" });
    }
};