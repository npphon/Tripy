const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');  // เพิ่มการ import cors

const app = express();
const port = 3000;
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database('tripy.sqlite');

app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

app.use(cors());
  
// Define a route to fetch data from SQLite
app.get('/pockets', (req, res) => {
  const query = 'SELECT * FROM pockets';

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(rows);
    }
  });
});

app.get('/pockets/:id', (req, res) => {
  const id = parseInt(req.params.id)
  console.log(id);
  const query = `SELECT * FROM pockets WHERE id = ${id}`;

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(rows);
    }
  });
});

app.post('/pockets', (req, res) => {
    const { pocket_name, pocket_balance } = req.body;
    console.log('Request Body:', req.body);
    
    if (!req.body) {
        return res.status(400).json({ error: 'Invalid request body' });
    }

    if (!pocket_name || !pocket_balance) {
      return res.status(400).json({ error: 'Pocket name and balance are required.' });
    }
  
    const query = 'INSERT INTO pockets (pocket_name, pocket_balance) VALUES ($1, $2)';
  
    db.run(query, [pocket_name, pocket_balance], function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
  
      const newPocketId = this.lastID;
      res.status(201).json({ id: newPocketId, pocket_name, pocket_balance });
    });
  });

app.get('/cashbox', (req, res) => {
    const query = 'SELECT * FROM cashbox';
  
    db.all(query, (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(rows);
      }
    });
  });

  

  app.get('/expenses', (req, res) => {
    const query = 'SELECT * FROM expenses';
  
    db.all(query, (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(rows);
      }
    });
  });

  app.get('/expenses/:pocket_id', (req, res) => {
    const pocket_id = parseInt(req.params.pocket_id)
    const query = `SELECT * FROM expenses WHERE pocket_id = ${pocket_id}`;
  
    db.all(query, (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(rows);
      }
    });
  });

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
