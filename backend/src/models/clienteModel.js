import pool from "../config/db.js";

// Obtener todos los clientes
export const obtenerTodos = async () => {
    const [rows] = await pool.query("SELECT * FROM clientes ORDER BY id DESC");
    return rows;
};

// Crear un nuevo cliente
export const crear = async (nombre, telefono) => {
    const [result] = await pool.query(
        "INSERT INTO clientes (nombre, telefono) VALUES (?, ?)", 
        [nombre, telefono]
    );
    return result.insertId;
};

// Actualizar un cliente existente
export const actualizar = async (id, nombre, telefono) => {
    const [result] = await pool.query(
        "UPDATE clientes SET nombre = ?, telefono = ? WHERE id = ?", 
        [nombre, telefono, id]
    );
    return result;
};

// Eliminar un cliente
export const eliminar = async (id) => {
    const [result] = await pool.query("DELETE FROM clientes WHERE id = ?", [id]);
    return result;
};