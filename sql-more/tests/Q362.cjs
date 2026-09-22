'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE moves(id INTEGER PRIMARY KEY,sku TEXT,delta INTEGER,at INTEGER);INSERT INTO moves VALUES(1,'A',10,1),(2,'A',-4,2),(3,'B',7,3),(4,'A',5,4),(5,'B',-2,5);",
  "expected": [
    {
      "id": 1,
      "sku": "A",
      "stock": 10
    },
    {
      "id": 2,
      "sku": "A",
      "stock": 6
    },
    {
      "id": 3,
      "sku": "B",
      "stock": 7
    },
    {
      "id": 4,
      "sku": "A",
      "stock": 11
    },
    {
      "id": 5,
      "sku": "B",
      "stock": 5
    }
  ]
};
module.exports=sql=>grade(sql,spec);
