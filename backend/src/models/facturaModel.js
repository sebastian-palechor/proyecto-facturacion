import pool from "../config/db.js";

export const insertarFactura = async (cliente_id, total) => {
    // Solo estas columnas, para que MySQL no se queje del número de factura
const [result] = await pool.query(
    "INSERT INTO facturas (cliente_id, total, fecha) VALUES (?, ?, NOW())",
    [cliente_id, total]
);
    return result.insertId;
};

export const insertarDetalle = async (facturaId, prod) => {
    return await pool.query(
        "INSERT INTO factura_detalle (factura_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)",
        [facturaId, prod.id, prod.cantidad, prod.precio]
    );
};