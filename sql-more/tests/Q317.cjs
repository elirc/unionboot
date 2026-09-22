'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE ledger(tx INTEGER,line INTEGER,account TEXT,debit INTEGER,credit INTEGER,PRIMARY KEY(tx,line));INSERT INTO ledger VALUES(1,1,'cash',100,0),(1,2,'income',0,100),(2,1,'expense',30,0),(2,2,'cash',0,30),(3,1,'cash',20,0),(3,2,'income',0,15);",
  "expected": [
    {
      "tx": 1,
      "inflow": 100,
      "outflow": 0,
      "net": 100
    },
    {
      "tx": 2,
      "inflow": 0,
      "outflow": 30,
      "net": -30
    },
    {
      "tx": 3,
      "inflow": 20,
      "outflow": 0,
      "net": 20
    }
  ]
};
module.exports=sql=>grade(sql,spec);
