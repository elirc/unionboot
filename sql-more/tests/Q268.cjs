'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE orders(id INTEGER PRIMARY KEY,customer TEXT,status TEXT,amount INTEGER);INSERT INTO orders VALUES(1,'Ada','paid',10),(2,'Ada','pending',20),(3,'Bo','paid',30),(4,'Cy','cancelled',40);",
  "expected": [
    {
      "id": 1
    },
    {
      "id": 2
    },
    {
      "id": 3
    }
  ]
};
module.exports=sql=>grade(sql,spec);
