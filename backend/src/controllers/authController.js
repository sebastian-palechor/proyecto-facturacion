const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.registrar = async (req, res) => {
    // Solo extraemos lo que la tabla acepta ahora
    const { correo, password } = req.body;

    try {
        // Cifrar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar solo correo y password
        // Los campos created_at, updated_at, etc., se manejan solos o quedan en NULL
        const query = 'INSERT INTO usuarios (correo, password) VALUES (?, ?)';
        
        await db.query(query, [correo, hashedPassword]);

        res.status(201).json({ mensaje: "Usuario registrado con éxito" });
    } catch (error) {
        // Esto imprimirá el error real en la terminal negra de VS Code
        console.error("DETALLE DEL ERROR EN BACKEND:", error);
        res.status(500).json({ 
            mensaje: "Error interno del servidor", 
            error: error.message 
        });
    }
};
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { correo, password } = req.body;

    try {
        // 1. Buscar al usuario
        const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        
        if (rows.length === 0) return res.status(404).json({ mensaje: "Usuario no encontrado" });

        const usuario = rows[0];

        // 2. Comparar contraseña cifrada
        const validPassword = await bcrypt.compare(password, usuario.password);
        if (!validPassword) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

        // 3. Generar el Token JWT
        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, mensaje: "Bienvenido" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el login", detalle: error.message });
    }
};
exports.obtenerTodos = async (req, res) => {
    try {
        // Quitamos 'datos_de_inscripcion', 'facultad' y 'rol' si no están en tu DB
        const [rows] = await db.query(`
            SELECT 
                id, 
                correo, 
                created_at 
            FROM usuarios 
            WHERE deleted_at IS NULL
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error en el Backend:", error);
        res.status(500).json({ mensaje: "Error de base de datos" });
    }
};