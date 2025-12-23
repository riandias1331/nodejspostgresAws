import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import routes from './routes/users.js';
import errorHandler  from './middlewares/errorhandler.js';
import createUserTable from './data/createtable.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3333  ;


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Database PostgreSql
createUserTable()
app.get('/', async(req, res) => {  // Teste conexão Postgres
    const result = await pool.query("SELECT current_database()")
    res.send(`The database name is : ${result.rows[0].current_database}`)
})



// test database connection
app.get('/db-test', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    res.json(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

//// Routes
app.use(routes)

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
app.on('databaseConnected', () => {
  console.log('Database connection established, starting server...');
});


