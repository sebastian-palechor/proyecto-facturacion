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