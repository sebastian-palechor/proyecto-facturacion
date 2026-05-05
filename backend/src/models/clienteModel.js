import pool from "../config/db.js"; // Traemos la conexión ya configurada

export const obtenerTodos = async () => {
    const [rows] = await pool.query("SELECT * FROM clientes");
    return rows;
};