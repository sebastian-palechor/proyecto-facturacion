export const validarUsuario = (req, res, next) => {
    const { correo, password } = req.body;

   
    if (!correo || !password) {
        return res.status(400).json({ 
            mensaje: "Faltan datos obligatorios: correo y password" 
        });
    }

    next();
};