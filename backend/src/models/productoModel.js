import pool from "../config/db.js";

export const obtenerTodos = async () => {
    const [rows] = await pool.query("SELECT * FROM productos");
    return rows;
};

export const actualizarStock = async (id, cantidad) => {
    return await pool.query(
        "UPDATE productos SET stock = stock - ? WHERE id = ?",
        [cantidad, id]
    );
};