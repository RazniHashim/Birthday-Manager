const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password
  database: 'birthdate_manager'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Routes
app.get('/people', (req, res) => {
  db.query('SELECT * FROM people', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/add', (req, res) => {
  const { name, year, month, day } = req.body;
  db.query('INSERT INTO people (name, year, month, day) VALUES (?, ?, ?, ?)',
    [name, year, month, day],
    (err) => {
      if (err) return res.status(400).send('Name already exists or invalid data.');
      res.send('Person added');
    });
});

app.delete('/delete/:name', (req, res) => {
  db.query('DELETE FROM people WHERE name = ?', [req.params.name], (err) => {
    if (err) return res.status(500).send(err);
    res.send('Person deleted');
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
