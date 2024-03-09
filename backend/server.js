const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors"); // เพิ่มการ import cors

const app = express();
const port = 3000;
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database("tripy.sqlite");

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use(cors());

app.get("/cashbox", (req, res) => {
  const query = "SELECT * FROM cashbox";

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(rows);
    }
  });
});

app.patch("/cashbox/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { balance } = req.body;

  const getCashboxById = `SELECT * FROM pockets WHERE id = ${id}`;

  const updateCashboxById =
    "UPDATE pockets SET pocket_balance = pocket_balance + $1 WHERE id = $2";

  db.all(getCashboxById, (err, rows) => {
    const noCashboxFound = !rows.length;
    if (noCashboxFound) {
      console.error(err);
      return res.status(400).send("cashbox doesn't exist in database");
    }

    db.run(updateCashboxById, [balance, id], function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      res.status(201).json({ id: id, balance });
    });
  });
});

// Define a route to fetch data from SQLite
app.get("/pockets", (req, res) => {
  const query = "SELECT * FROM pockets";

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(rows);
    }
  });
});

app.get("/sumAllPockets", (req, res) => {
  const query = "SELECT SUM(pocket_balance) as total FROM pockets";

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(rows);
    }
  });
});

// Define a route to fetch data from SQLite
app.get("/pockets/not/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(id);
  const query = `SELECT * FROM pockets WHERE NOT id = ${id}`;

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(rows);
    }
  });
});

app.get("/pockets/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const query = `SELECT * FROM pockets WHERE id = ${id}`;

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(rows);
    }
  });
});

app.post("/pockets", (req, res) => {
  const { pocket_name, target } = req.body;
  console.log("Request Body:", req.body);

  if (!req.body) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  if (!pocket_name) {
    return res
      .status(400)
      .json({ error: "Pocket name and balance are required." });
  }

  const query =
    "INSERT INTO pockets (pocket_name, pocket_balance, target) VALUES ($1, 0, $2)";

  db.run(query, [pocket_name,target], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    const newPocketId = this.lastID;
    res.status(201).json({ id: newPocketId, pocket_name, target });
  });
});

app.patch("/pockets/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { pocket_name, pocket_balance } = req.body;

  const getPocketById = `SELECT * FROM pockets WHERE id = ${id}`;

  const updatePocketById =
    "UPDATE pockets SET pocket_name = $1 , pocket_balance = $2 WHERE id = $3";

  db.all(getPocketById, (err, rows) => {
    const noPocketFound = !rows.length;
    if (noPocketFound) {
      console.error(err);
      return res.status(400).send("pockets doesn't exist in database");
    }

    db.run(updatePocketById, [pocket_name, pocket_balance, id], function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      res.status(201).json({ id: id, pocket_name, pocket_balance });
    });
  });
});

// หักเงิน
app.patch("/pocket/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { pocket_balance } = req.body;

  const getCashboxById = `SELECT * FROM pockets WHERE id = ${id}`;

  const updateCashboxById =
    "UPDATE pockets SET pocket_balance = pocket_balance + $1 WHERE id = $2";

  db.all(getCashboxById, (err, rows) => {
    const noCashboxFound = !rows.length;
    if (noCashboxFound) {
      console.error(err);
      return res.status(400).send("cashbox doesn't exist in database");
    }

    db.run(updateCashboxById, [pocket_balance, id], function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      res.status(201).json({ id: id, pocket_balance });
    });
  });
});

app.delete("/pockets/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const getPocketById = `SELECT * FROM pockets WHERE id = ${id}`;

  const removePocket = `DELETE FROM pockets WHERE id = ${id}`;

  db.all(getPocketById, (err, rows) => {
    const noPocketFound = !rows.length;
    if (noPocketFound) {
      console.error(err);
      return res.status(400).send("Plan doesn't exist in database");
    }
    db.run(removePocket, function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }
      res.status(200).send("Pocket removed Successfully!");
    });
  });
});

app.post("/moveMoney", (req, res) => {
  const { sourcePocketId, targetPocketId, amountToMove } = req.body;
  console.log(sourcePocketId, targetPocketId, amountToMove);

  // console.log(amountToMove);
  // if(typeof amountToMove != "number") {
  //   return res.status(400).send('amount not a number')
  // }

  const sql = `
    UPDATE pockets
    SET pocket_balance = pocket_balance - ${amountToMove} 
    WHERE id = ${sourcePocketId};

    UPDATE pockets
    SET pocket_balance = pocket_balance + ${amountToMove}
    WHERE id = ${targetPocketId};
  `;

  db.exec(sql, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.send("Money moved successfully");
  });
});

//========================= Expenses ==========================
app.get("/expenses", (req, res) => {
  const query = "SELECT * FROM expenses";

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(rows);
    }
  });
});

app.get("/expenses/id/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const query = `SELECT * FROM expenses WHERE id = ${id}`;

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(rows);
    }
  });
});

app.get("/expenses/:pocket_id", (req, res) => {
  const pocket_id = parseInt(req.params.pocket_id);
  const query = `SELECT * FROM expenses WHERE pocket_id = ${pocket_id}`;

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(rows);
    }
  });
});

app.post("/expenses", (req, res) => {
  const { title, amount, category, pocket_id } = req.body;

  const query =
    "INSERT INTO expenses (title, amount, category, pocket_id) VALUES ($1, $2, $3, $4)";

  db.run(query, [title, amount, category, pocket_id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    res.status(201).json({ title, amount, category, pocket_id });
  });
});

app.delete("/pockets/expenses/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const getExpenseById = `SELECT * FROM expenses WHERE pocket_id = ${id}`;

  const removeExpense = `DELETE FROM expenses WHERE pocket_id = ${id}`;

  db.all(getExpenseById, (err, rows) => {
    const noExpenseFound = !rows.length;
    if (noExpenseFound) {
      console.error(err);
      return res.status(400).send("expense doesn't exist in database");
    }
    db.run(removeExpense, function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }
      res.status(200).send("expense removed Successfully!");
    });
  });
});

app.delete("/expenses/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const getExpenseById = `SELECT * FROM expenses WHERE id = ${id}`;

  const removeExpense = `DELETE FROM expenses WHERE id = ${id}`;

  db.all(getExpenseById, (err, rows) => {
    const noExpenseFound = !rows.length;
    if (noExpenseFound) {
      console.error(err);
      return res.status(400).send("expense doesn't exist in database");
    }
    db.run(removeExpense, function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }
      res.status(200).send("expense removed Successfully!");
    });
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
