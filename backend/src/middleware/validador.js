// src/middleware/validador.js

export const validarUsuario = (req, res, next) => {
    const { correo, password } = req.body;

    // Validación simple
    if (!correo || !password) {
        return res.status(400).json({ 
            mensaje: "Faltan datos obligatorios: correo y password" 
        });
    }

    // Si todo está bien, pasamos al siguiente paso (el controlador)
    next();
};