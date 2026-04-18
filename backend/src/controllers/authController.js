const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registrar = async (req, res) => {
  const { correo, password } = req.body;
  try {
    // Cifrar contraseña (Requisito: Bcrypt)
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    await db.query(
      'INSERT INTO usuarios (correo, password, created_by) VALUES (?, ?, ?)',
      [correo, passwordHashed, null] // created_by es null al ser el primer registro
    );

    res.status(201).json({ mensaje: "Usuario registrado con éxito" });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { correo, password } = req.body;
  try {
    const [usuarios] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    const usuario = usuarios[0];

    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    // Generar JWT (Requisito: JWT)
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, usuario: { id: usuario.id, correo: usuario.correo, rol: usuario.rol } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};