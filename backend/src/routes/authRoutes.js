import express from 'express';
// Importamos todo el controlador como un objeto
import * as authController from '../controllers/authController.js'; 
// Importamos el middleware (asegúrate de poner el .js)
import { validarUsuario } from '../middleware/validador.js';

const router = express.Router();

// Las rutas ahora usan las funciones que exportamos en el controlador
router.post('/registrar', validarUsuario, authController.registrar);
router.post('/login', validarUsuario, authController.login);
router.get('/usuarios', authController.obtenerTodos);

export default router;