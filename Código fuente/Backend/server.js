require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  ssl: { rejectUnauthorized: false }
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