import pool from "../config/db.js";

export const obtenerTodos = async () => {
    const [rows] = await pool.query("SELECT * FROM clientes ORDER BY id DESC");
    return rows;
};


export const crear = async (nombre, telefono) => {
    const [result] = await pool.query(
        "INSERT INTO clientes (nombre, telefono) VALUES (?, ?)", 
        [nombre, telefono]
    );
    return result.insertId;
};

export const actualizar = async (id, nombre, telefono) => {
    const [result] = await pool.query(
        "UPDATE clientes SET nombre = ?, telefono = ? WHERE id = ?", 
        [nombre, telefono, id]
    );
    return result;
};

export const eliminar = async (id) => {
    const [result] = await pool.query("DELETE FROM clientes WHERE id = ?", [id]);
    return result;
};