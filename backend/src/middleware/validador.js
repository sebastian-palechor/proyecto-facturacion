import jwt from 'jsonwebtoken';

export const validarUsuario = (req, res, next) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ 
            mensaje: "Faltan datos obligatorios: correo y password" 
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ 
            mensaje: "El formato del correo electrónico no es válido" 
        });
    }

    next();
};


export const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ mensaje: "No se proporcionó un token de acceso" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensaje: "Token inválido o expirado" });
        }
        req.usuario = decoded; 
        next();
    });
};

export const esAdmin = (req, res, next) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ 
            mensaje: "Acceso denegado: Se requieren permisos de administrador" 
        });
    }
    next();
};