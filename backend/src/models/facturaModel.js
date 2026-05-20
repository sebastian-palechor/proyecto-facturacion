import pool from "../config/db.js";

export const insertarFactura = async (cliente_id, total, metodoPago, conn = pool) => {
    const [columns] = await conn.query("SHOW COLUMNS FROM facturas LIKE 'metodo_pago'");
    if (columns.length === 0) {
        await conn.query(
            "ALTER TABLE facturas ADD COLUMN metodo_pago VARCHAR(50) DEFAULT 'Efectivo'"
        );
    }

    const [result] = await conn.query(
        "INSERT INTO facturas (cliente_id, total, fecha, metodo_pago) VALUES (?, ?, NOW(), ?)",
        [cliente_id, total, metodoPago]
    );
    return result.insertId;
};

export const insertarDetalle = async (facturaId, prod, conn = pool) => {
    return await conn.query(
        "INSERT INTO factura_detalle (factura_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)",
        [facturaId, prod.id, prod.cantidad, prod.precio]
    );
};

export const descontarStock = async (productoId, cantidad, conn = pool) => {
    const [result] = await conn.query(
        "UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?",
        [cantidad, productoId, cantidad]
    );
    return result;
};

export const getDetalleCompleto = async () => {
    const query = `
        SELECT 
            fd.id AS id_detalle,
            f.id AS factura_nro,
            f.fecha,
            c.nombre AS cliente,
            p.nombre AS producto,
            fd.cantidad,
            fd.precio AS precio_unitario,
            (fd.cantidad * fd.precio) AS subtotal,
            ((fd.cantidad * fd.precio) * 0.19) AS iva,
            ((fd.cantidad * fd.precio) * 1.19) AS total_linea,
        IFNULL(f.metodo_pago, 'Efectivo') AS metodo_pago
        FROM factura_detalle fd
        INNER JOIN facturas f ON fd.factura_id = f.id
        INNER JOIN clientes c ON f.cliente_id = c.id
        INNER JOIN productos p ON fd.producto_id = p.id
        ORDER BY f.id DESC
    `;
    
    const [results] = await pool.query(query);
    return results;
};