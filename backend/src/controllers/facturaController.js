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

export const listarDetalles = (req, res) => {
    facturaModel.getDetalleCompleto((err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error al obtener historial" });
        }
        res.json(results);
    });
};