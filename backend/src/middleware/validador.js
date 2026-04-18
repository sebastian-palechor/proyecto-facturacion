const { z } = require('zod');

// Esquema para validar Registro y Login
const esquemaUsuario = z.object({
  correo: z.string().email({ message: "Correo electrónico inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
});

const validarUsuario = (req, res, next) => {
  try {
    esquemaUsuario.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ 
      errores: error.errors.map(err => ({ campo: err.path[0], mensaje: err.message })) 
    });
  }
};

module.exports = { validarUsuario };