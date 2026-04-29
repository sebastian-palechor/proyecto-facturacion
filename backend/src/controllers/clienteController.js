import * as clienteModel from "../models/clienteModel.js";

export const listarClientes = async (req, res) => {
    try {
        const clientes = await clienteModel.obtenerTodos();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener clientes" });
    }
};

export const guardarCliente = async (req, res) => {
    const { nombre, email, telefono } = req.body;
    try {
        const id = await clienteModel.crear(nombre, email, telefono);
        res.json({ mensaje: "Cliente creado", id });
    } catch (error) {
        res.status(500).json({ error: "Error al crear cliente" });
    }
};