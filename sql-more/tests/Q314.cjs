'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE ledger(tx INTEGER,line INTEGER,account TEXT,debit INTEGER,credit INTEGER,PRIMARY KEY(tx,line));INSERT INTO ledger VALUES(1,1,'cash',100,0),(1,2,'income',0,100),(2,1,'expense',30,0),(2,2,'cash',0,30),(3,1,'cash',20,0),(3,2,'income',0,15);",
  "expected": [
    {
      "account": "cash",
      "balance": 70
    },
    {
      "account": "expense",
      "balance": 30
    },
    {
      "account": "income",
      "balance": -100
    }
  ]
};
module.exports=sql=>grade(sql,spec);
