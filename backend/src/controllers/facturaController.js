import * as facturaModel from "../models/facturaModel.js";

export const crearFactura = async (req, res) => {
    const { cliente_id, total, productos } = req.body;
    try {
        const facturaId = await facturaModel.insertarFactura(cliente_id, total);
        
        for (const prod of productos) {
            await facturaModel.insertarDetalle(facturaId, prod);
        }

        res.json({ message: "Venta exitosa", facturaId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const listarDetalles = async (req, res) => {
    try {
        const results = await facturaModel.getDetalleCompleto();
        res.json(results);
    } catch (error) {
        console.error("Error en listarDetalles:", error);
        res.status(500).json({ error: "Error al obtener historial" });
    }
};