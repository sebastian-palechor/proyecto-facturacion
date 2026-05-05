import jwt from 'jsonwebtoken';

export const validarUsuario = (req, res, next) => {
    const { correo, password } = req.body;

    // 1. Verificación de existencia (lo que ya tienes)
    if (!correo || !password) {
        return res.status(400).json({ 
            mensaje: "Faltan datos obligatorios: correo y password" 
        });
    }

    // 2. Validación de formato de correo (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ 
            mensaje: "El formato del correo electrónico no es válido" 
        });
    }

    next();
};

// --- NUEVAS FUNCIONES PARA ROLES ---

export const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ mensaje: "No se proporcionó un token de acceso" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensaje: "Token inválido o expirado" });
        }
        // Guardamos los datos decodificados (id y rol) en el objeto request
        req.usuario = decoded; 
        next();
    });
};

export const esAdmin = (req, res, next) => {
    // Verificamos que el rol guardado en el token sea 'admin'
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ 
            mensaje: "Acceso denegado: Se requieren permisos de administrador" 
        });
    }
    next();
};