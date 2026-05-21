import pool from "../config/db.js";

export const obtenerTodos = async () => {
    const [rows] = await pool.query("SELECT * FROM productos ORDER BY id DESC");
    return rows;
};

export const crear = async (nombre, precio, stock) => {
    const [result] = await pool.query(
        "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)",
        [nombre, precio, stock]
    );
    return result.insertId;
};

export const actualizar = async (id, nombre, precio, stock) => {
    const [result] = await pool.query(
        "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?",
        [nombre, precio, stock, id]
    );
    return result;
};

export const eliminar = async (id) => {
   
    const [result] = await pool.query("DELETE FROM productos WHERE id = ?", [id]);
    return result;
};