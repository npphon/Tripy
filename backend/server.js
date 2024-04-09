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

app.get("/beginningBalance", (req, res) => {
  const { month, year } = req.query;
  console.log("begin", month, year);

  let query;
  if (parseInt(month) === 1) {
    const previousYear = parseInt(year) - 1;
    query = `SELECT * FROM beginningBalance WHERE month = 12 AND year = ${previousYear}`;
  } else {
    const previousMonth = parseInt(month) - 1;
    query = `SELECT * FROM beginningBalance WHERE month = ${previousMonth} AND year = ${year}`;
  }

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(rows);
    }
  });
});

app.patch("/beginningBalance", (req, res) => {
  // const {  } = req.query;
  const { month, year, amount } = req.body;
  console.log("begin", month, year, amount);

  const updateBeginningBalance = `UPDATE beginningBalance
              SET balance = balance + ${amount},
              updated_at = (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime'))
              WHERE month = ${month} AND year = ${year}`;
  db.run(updateBeginningBalance, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    console.log("beginningBalance update", {
      month,
      year,
      amount,
    });
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
  const { pocket_name, target, pocket_type } = req.body;
  console.log("created pocket:", req.body);

  if (!req.body) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  if (!pocket_name) {
    return res
      .status(400)
      .json({ error: "Pocket name and balance are required." });
  }

  const query =
    "INSERT INTO pockets (pocket_name, pocket_balance, target, pocket_type) VALUES ($1, 0, $2, $3)";

  db.run(query, [pocket_name, target, pocket_type], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    const newPocketId = this.lastID;
    res.status(201).json({ id: newPocketId, pocket_name, target, pocket_type });
  });
});

//set ค่าใหม่เลย
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

app.post("/expensesMoveMoney", (req, res) => {
  const {
    title,
    amount,
    category,
    pocket_id,
    type,
    transfer_id,
    transfer_pocket_id,
  } = req.body;

  const expensesQuery =
    "INSERT INTO expenses (title, amount, category, pocket_id, type, transfer_id, transfer_pocket_id) VALUES ($1, $2, $3, $4, $5, $6, $7)";

  db.run(
    expensesQuery,
    [title, amount, category, pocket_id, type, transfer_id, transfer_pocket_id],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      res
        .status(201)
        .json({
          title,
          amount,
          category,
          pocket_id,
          type,
          transfer_id,
          transfer_pocket_id,
        });
    }
  );
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

app.get("/expensesByTime", (req, res) => {
  const { month, year } = req.query;
  const query = `SELECT * FROM expenses WHERE strftime('%Y-%m', created_at) = '${year}-${month}' AND title NOT LIKE '%ย้ายเงินจาก%';`;

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
  const { title, amount, category, pocket_id, type } = req.body;
  let updatedAmount = parseInt(amount);
  if (type === "expense") {
    updatedAmount = -amount; // ถ้าเป็น expense ให้ใส่ลบลงไปใน pocket_balance
  } else if (type === "income") {
    updatedAmount = amount; // ถ้าเป็น expense ให้ใส่ลบลงไปใน pocket_balance
  }


  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // เดือนปัจจุบัน
  // const currentMonth = 4; // เดือนปัจจุบัน
  const currentYear = currentDate.getFullYear(); // ปีปัจจุบัน

  const checkQuery = `SELECT * FROM beginningBalance WHERE month = ${currentMonth} AND year = ${currentYear}`;
  db.get(checkQuery, (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    if (!row) {
      const selectBalanceQuery =
        "SELECT balance FROM beginningBalance ORDER BY id DESC LIMIT 1";
      db.get(selectBalanceQuery, [], (err, row) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }
        const balance = row.balance;

        const insertBeginningBalance =
          "INSERT INTO beginningBalance (month, year, balance) VALUES (?, ?, ?)";
        db.run(
          insertBeginningBalance,
          [currentMonth, currentYear, balance],
          function (err) {
            if (err) {
              console.error(err);
              return res.status(500).send("Internal Server Error");
            }
            console.log("beginningBalance", {
              currentMonth,
              currentYear,
              balance,
            });
            const updateBeginningBalance = `UPDATE beginningBalance
              SET balance = balance + ${updatedAmount},
              updated_at = (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime'))
              WHERE month = ${currentMonth} AND year = ${currentYear}`;
            db.run(updateBeginningBalance, function (err) {
              if (err) {
                console.error(err);
                return res.status(500).send("Internal Server Error");
              }
              console.log("beginningBalance update", {
                currentMonth,
                currentYear,
                updatedAmount,
              });
            });
          }
        );
      });
    } else {
      const updateBeginningBalance = `UPDATE beginningBalance
        SET balance = balance + ${updatedAmount},
        updated_at = (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')) 
        WHERE month = ${currentMonth} AND year = ${currentYear}`;
      db.run(updateBeginningBalance, function (err) {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }
        console.log("beginningBalance update", {
          currentMonth,
          currentYear,
          updatedAmount,
        });
      });
    }
  });

  const expensesQuery =
    "INSERT INTO expenses (title, amount, category, pocket_id, type) VALUES ($1, $2, $3, $4, $5)";

  db.run(
    expensesQuery,
    [title, amount, category, pocket_id, type],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      res.status(201).json({ title, amount, category, pocket_id, type });
    }
  );
});

app.delete("/expenses/pockets/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const getExpenseById = `SELECT * FROM expenses WHERE pocket_id = ${id}`;

  const removeExpense = `DELETE FROM expenses WHERE pocket_id = ${id}`;

  db.all(getExpenseById, (err, rows) => {
    // const noExpenseFound = !rows.length;
    // if (noExpenseFound) {
    //   console.error("pocketEx",err);
    //   return res.status(400).send("expense doesn't exist in database");
    // }
    db.run(removeExpense, function (err) {
      if (err) {
        console.error("pocke", err);
        return res.status(500).send("Internal Server Error");
      }
      res.status(200).send("expense removed Successfully!");
    });
  });
});

app.delete("/expenses/transfer/pocket/:transfer_pocket_id", (req, res) => {
  const transfer_pocket_id = parseInt(req.params.transfer_pocket_id);
  console.log(transfer_pocket_id);

  const getExpenseByTransferPocketId = `SELECT * FROM expenses WHERE transfer_pocket_id = ${transfer_pocket_id}`;

  const removeExpense = `DELETE FROM expenses WHERE transfer_pocket_id = ${transfer_pocket_id}`;

  db.all(getExpenseByTransferPocketId, (err, rows) => {
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

app.delete("/expenses/transfer/:transfer_id", (req, res) => {
  const transfer_id = req.params.transfer_id;
  console.log(transfer_id);

  const getExpenseById = `SELECT * FROM expenses WHERE transfer_id = '${transfer_id}'`;

  const removeExpense = `DELETE FROM expenses WHERE transfer_id = '${transfer_id}'`;

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
