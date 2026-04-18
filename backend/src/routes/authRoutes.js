const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validarUsuario } = require('../middleware/validador');

// Rutas protegidas por el validador de Zod
router.post('/registrar', validarUsuario, authController.registrar);
router.post('/login', validarUsuario, authController.login);
router.get('/usuarios', authController.obtenerTodos);

module.exports = router;