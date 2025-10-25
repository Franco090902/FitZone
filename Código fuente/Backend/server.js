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
    const nuevoUsuario = result.rows[0];

    // Si es cliente, lo creo en "cliente" y le asigno un gimnasio por defecto (si existe alguno)
    if (tipo_usuario === 'cliente' && email) {
      const g = await pool.query('SELECT id_gimnasio FROM gimnasio ORDER BY id_gimnasio ASC LIMIT 1');
      const idGimnasio = g.rows[0]?.id_gimnasio ?? null;

      if (idGimnasio) {
        await pool.query(
          'INSERT INTO cliente (nombre, apellido, email, id_usuario, id_gimnasio) VALUES ($1, $2, $3, $4, $5)',
          [username, '', email, nuevoUsuario.id_usuario, idGimnasio]
        );
      } else {
        // Si aún no hay gimnasios, lo creo sin id_gimnasio
        await pool.query(
          'INSERT INTO cliente (nombre, apellido, email, id_usuario) VALUES ($1, $2, $3, $4)',
          [username, '', email, nuevoUsuario.id_usuario]
        );
      }
    }

    // Respuesta única con el id generado
    return res.status(201).json({
      id_usuario: nuevoUsuario.id_usuario,
      username: nuevoUsuario.username,
      tipo_usuario: nuevoUsuario.tipo_usuario
    });
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


// Clases con cupos disponibles
app.get('/api/clases', async (req, res) => {
  try {
    const idGimnasio = req.query.gimnasio ? Number(req.query.gimnasio) : undefined;

    let sql = `
      SELECT
        c.id_clase,
        c.nombre,
        c.descripcion,
        c.capacidad,
        c.fecha_hora,
        c.id_gimnasio,
        (c.capacidad - COALESCE(COUNT(r.id_reserva), 0)) AS cupos_disponibles
      FROM clase c
      LEFT JOIN reserva r ON r.id_clase = c.id_clase
    `;
    const params = [];

    if (idGimnasio) {
      sql += ` WHERE c.id_gimnasio = $1 `;
      params.push(idGimnasio);
    }

    sql += ` GROUP BY c.id_clase ORDER BY c.fecha_hora ASC`;

    const r = await pool.query(sql, params);
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Trainers del gimnasio
app.get('/api/trainers', async (_req, res) => {
  try {
    const r = await pool.query(`
      SELECT id_trainer, nombre, especialidad, contacto, id_gimnasio
      FROM trainer
      ORDER BY nombre ASC
    `);
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mapea usuario logueado -> cliente
app.get('/api/clientes/by-usuario/:idUsuario', async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT id_cliente, nombre, apellido, email, id_gimnasio
       FROM cliente
       WHERE id_usuario = $1`,
      [req.params.idUsuario]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear reserva con control de cupos
app.post('/api/reservas', async (req, res) => {
  try {
    const { id_clase, fecha_reserva, descripcion, id_cliente } = req.body;
    if (!id_clase || !fecha_reserva || !id_cliente) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const cupos = await pool.query(
      `SELECT c.capacidad - COALESCE(COUNT(r.id_reserva), 0) AS cupos_disponibles
       FROM clase c
       LEFT JOIN reserva r ON r.id_clase = c.id_clase
       WHERE c.id_clase = $1
       GROUP BY c.capacidad`,
      [id_clase]
    );
    const disponibles = Number(cupos.rows?.[0]?.cupos_disponibles ?? 0);
    if (disponibles <= 0) return res.status(409).json({ error: 'No hay cupos disponibles' });

    const result = await pool.query(
      `INSERT INTO reserva (id_clase, fecha_reserva, descripcion, id_cliente)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id_clase, fecha_reserva, descripcion ?? null, id_cliente]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Todas las reservas (con datos de clase)
app.get('/api/reservas', async (_req, res) => {
  try {
    const r = await pool.query(`
      SELECT
        r.id_reserva, r.id_clase, r.fecha_reserva, r.descripcion, r.id_cliente,
        c.nombre AS clase_nombre, c.fecha_hora AS clase_fecha_hora
      FROM reserva r
      JOIN clase c ON c.id_clase = r.id_clase
      ORDER BY r.fecha_reserva DESC
    `);
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reservas por cliente
app.get('/api/clientes/:idCliente/reservas', async (req, res) => {
  try {
    const r = await pool.query(`
      SELECT
        r.id_reserva, r.id_clase, r.fecha_reserva, r.descripcion, r.id_cliente,
        c.nombre AS clase_nombre, c.fecha_hora AS clase_fecha_hora
      FROM reserva r
      JOIN clase c ON c.id_clase = r.id_clase
      WHERE r.id_cliente = $1
      ORDER BY r.fecha_reserva DESC
    `, [req.params.idCliente]);
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/reservas/:id', async (req, res) => {
  try {
    const r = await pool.query('DELETE FROM reserva WHERE id_reserva = $1', [req.params.id]);
    if (r.rowCount === 0) return res.sendStatus(404);
    return res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/espacios', async (req, res) => {
  try {
    const idGimnasio = req.query.gimnasio ? Number(req.query.gimnasio) : undefined;
    const sql = idGimnasio
      ? 'SELECT id_espacio, nombre, capacidad, descripcion, id_gimnasio FROM espacio WHERE id_gimnasio = $1 ORDER BY nombre'
      : 'SELECT id_espacio, nombre, capacidad, descripcion, id_gimnasio FROM espacio ORDER BY nombre';
    const r = await pool.query(sql, idGimnasio ? [idGimnasio] : []);
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear reserva de espacio (valida doble turno por UNIQUE)
app.post('/api/espacios/reservas', async (req, res) => {
  try {
    const { id_espacio, id_cliente, fecha_reserva, descripcion } = req.body;
    if (!id_espacio || !id_cliente || !fecha_reserva) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    const r = await pool.query(
      `INSERT INTO reserva_espacio (id_espacio, id_cliente, fecha_reserva, descripcion)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id_espacio, id_cliente, fecha_reserva, descripcion ?? null]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) {
    if (String(err.message).includes('uq_reserva_espacio')) {
      return res.status(409).json({ error: 'Ese espacio ya está reservado en ese horario' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Reservas de espacios por cliente
app.get('/api/clientes/:idCliente/espacios/reservas', async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT re.id_reserva_espacio, re.id_espacio, re.fecha_reserva, re.descripcion,
              e.nombre AS espacio_nombre, e.id_gimnasio
       FROM reserva_espacio re
       JOIN espacio e ON e.id_espacio = re.id_espacio
       WHERE re.id_cliente = $1
       ORDER BY re.fecha_reserva DESC`,
      [req.params.idCliente]
    );
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar reserva de espacio
app.delete('/api/espacios/reservas/:id', async (req, res) => {
  try {
    const r = await pool.query('DELETE FROM reserva_espacio WHERE id_reserva_espacio = $1', [req.params.id]);
    if (r.rowCount === 0) return res.sendStatus(404);
    return res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/api/trainers/reservas', async (req, res) => {
  try {
    const { id_trainer, id_cliente, fecha_reserva, descripcion } = req.body;
    if (!id_trainer || !id_cliente || !fecha_reserva) {
      return res.status(400).json({ error: 'Faltan datos' });
    }
    const r = await pool.query(
      `INSERT INTO reserva_trainer (id_trainer, id_cliente, fecha_reserva, descripcion)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [id_trainer, id_cliente, fecha_reserva, descripcion ?? null]
    );
    res.status(201).json(r.rows[0]);
  } catch (err) {
    if (String(err.message).includes('uq_reserva_trainer')) {
      return res.status(409).json({ error: 'Ese trainer ya tiene una reserva en ese horario' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Reservas de trainers por cliente
app.get('/api/clientes/:idCliente/trainers/reservas', async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT rt.id_reserva_trainer, rt.id_trainer, rt.id_cliente, rt.fecha_reserva, rt.descripcion,
              t.nombre AS trainer_nombre, t.especialidad
       FROM reserva_trainer rt
       JOIN trainer t ON t.id_trainer = rt.id_trainer
       WHERE rt.id_cliente = $1
       ORDER BY rt.fecha_reserva DESC`,
      [req.params.idCliente]
    );
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar reserva de trainer
app.delete('/api/trainers/reservas/:id', async (req, res) => {
  try {
    const r = await pool.query('DELETE FROM reserva_trainer WHERE id_reserva_trainer = $1', [req.params.id]);
    if (r.rowCount === 0) return res.sendStatus(404);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



//  OBTENER MEMBRESÍA DE UN CLIENTE
app.get('/api/membresia/:idCliente', async (req, res) => {
  const { idCliente } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM membresia WHERE id_cliente = $1',
      [idCliente]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener membresía' });
  }
});

//  OBTENER RESERVAS DEL CLIENTE
app.get('/api/reservas/:idCliente', async (req, res) => {
  const { idCliente } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM reserva WHERE id_cliente = $1 ORDER BY fecha DESC',
      [idCliente]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});


const PORT = process.env.PORT || 3000;
// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));


app.listen(PORT, () => {
  console.log(`API corriendo en puerto ${PORT}`);
});

// Logs de errores no capturados
process.on('unhandledRejection', (e) => console.error('UNHANDLED REJECTION:', e));
process.on('uncaughtException', (e) => console.error('UNCAUGHT EXCEPTION:', e));