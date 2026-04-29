import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as authModel from '../models/authModel.js'; // Importamos el modelo

export const registrar = async (req, res) => {
    const { correo, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await authModel.crearUsuario(correo, hashedPassword);
        res.status(201).json({ mensaje: "Usuario registrado con éxito" });
    } catch (error) {
        console.error("DETALLE DEL ERROR:", error);
        res.status(500).json({ mensaje: "Error al registrar", error: error.message });
    }
};

export const login = async (req, res) => {
    const { correo, password } = req.body;
    try {
        const usuario = await authModel.buscarPorCorreo(correo);
        
        if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

        const validPassword = await bcrypt.compare(password, usuario.password);
        if (!validPassword) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, mensaje: "Bienvenido" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el login", detalle: error.message });
    }
};

export const obtenerTodos = async (req, res) => {
    try {
        const usuarios = await authModel.listarUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error de base de datos" });
    }
};