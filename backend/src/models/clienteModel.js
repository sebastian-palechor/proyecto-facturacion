// src/models/clienteModel.js
import pool from "../config/db.js"; // Traemos la conexión ya configurada

export const obtenerTodos = async () => {
    // Usamos el pool que importamos arriba
    const [rows] = await pool.query("SELECT * FROM clientes");
    return rows;
};