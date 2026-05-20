import express from 'express';
import * as authController from '../controllers/authController.js'; 
import { validarUsuario } from '../middleware/validador.js';

const router = express.Router();

router.post('/registrar', validarUsuario, authController.registrar);
router.post('/login', validarUsuario, authController.login);
router.get('/usuarios', authController.obtenerTodos);

export default router;