const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const corsOptions = {
  origin: ['http://localhost:8100', 'http://localhost:4200'],
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

console.log(`DB target -> ${process.env.PGUSER}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`);

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT) || 5432,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('DB OK: conexión verificada');
  } catch (e) {
    console.error('DB ERROR:', e.message);
  }
})();


app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});
// Registro
app.post('/api/register', async (req, res) => {
  const { username, password, tipo_usuario, email } = req.body;
  if (!username || !password || !tipo_usuario) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  try {
    const existe = await pool.query('SELECT 1 FROM usuario WHERE username = $1', [username]);
    if (existe.rows.length > 0) return res.status(409).json({ error: 'El usuario ya existe' });

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO usuario (username, password, tipo_usuario) VALUES ($1, $2, $3) RETURNING id_usuario, username, tipo_usuario',
      [username, hash, tipo_usuario]
    );

    if (tipo_usuario === 'cliente' && email) {
      await pool.query(
        'INSERT INTO cliente (nombre, apellido, email, id_usuario) VALUES ($1, $2, $3, $4)',
        [username, '', email, result.rows[0].id_usuario]
      );
    }

    res.status(201).json({ message: 'Usuario registrado' });
  } catch (err) {
    console.error('REGISTER ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const q = await pool.query('SELECT * FROM usuario WHERE username = $1', [username]);
    if (q.rows.length === 0) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

    const usuario = q.rows[0];
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

    res.json({ id_usuario: usuario.id_usuario, tipo_usuario: usuario.tipo_usuario, username: usuario.username });
  } catch (err) {
    console.error('LOGIN ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// Obtener todas las clases
app.get('/api/clases', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clase');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener una clase por ID
app.get('/api/clases/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM clase WHERE id_clase = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear una reserva de clase
app.post('/api/reservas', async (req, res) => {
  try {
    const { id_clase, fecha_reserva, descripcion, id_cliente } = req.body;
    const result = await pool.query(
      'INSERT INTO reserva (id_clase, fecha_reserva, descripcion, id_cliente) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_clase, fecha_reserva, descripcion, id_cliente]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener reservas de una clase
app.get('/api/clases/:id/reservas', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM reserva WHERE id_clase = $1', [id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todas las reservas
app.get('/api/reservas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reserva');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (Opcional) Eliminar una reserva
app.delete('/api/reservas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM reserva WHERE id_reserva = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API corriendo en puerto ${PORT}`);
});

// Logs de errores no capturados
process.on('unhandledRejection', (e) => console.error('UNHANDLED REJECTION:', e));
process.on('uncaughtException', (e) => console.error('UNCAUGHT EXCEPTION:', e));