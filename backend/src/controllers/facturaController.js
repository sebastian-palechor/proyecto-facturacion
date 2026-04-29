import * as facturaModel from "../models/facturaModel.js";

export const crearFactura = async (req, res) => {
    const { cliente_id, total, productos } = req.body;
    try {
        const facturaId = await facturaModel.insertarFactura(cliente_id, total);
        
        for (const prod of productos) {
            await facturaModel.insertarDetalle(facturaId, prod);
            // Aquí llamarías también al modelo de productos para descontar stock
        }

        res.json({ message: "Venta exitosa", facturaId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};