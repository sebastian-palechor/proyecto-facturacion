import db from '../config/db.js';

export const crearUsuario = async (correo, hashedPassword) => {
    const query = 'INSERT INTO usuarios (correo, password) VALUES (?, ?)';
    return await db.query(query, [correo, hashedPassword]);
};

export const buscarPorCorreo = async (correo) => {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return rows[0]; 
};

export const listarUsuarios = async () => {
    const [rows] = await db.query(`
        SELECT id, correo, created_at 
        FROM usuarios 
        WHERE deleted_at IS NULL
    `);
    return rows;
};