import pool from "../config/db.js";

export const insertarFactura = async (cliente_id, total) => {
    // Calculamos el total con IVA si el 'total' recibido es el neto
    // Si el 'total' ya trae el IVA desde el frontend, quita este cálculo
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
            ((fd.cantidad * fd.precio) * 1.19) AS total_linea
        FROM factura_detalle fd
        INNER JOIN facturas f ON fd.factura_id = f.id
        INNER JOIN clientes c ON f.cliente_id = c.id
        INNER JOIN productos p ON fd.producto_id = p.id
        ORDER BY f.id DESC
    `;
    
    // Usamos await porque el pool es de tipo promesa
    const [results] = await pool.query(query);
    return results;
};