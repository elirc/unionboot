'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE moves(id INTEGER PRIMARY KEY,sku TEXT,delta INTEGER,at INTEGER);INSERT INTO moves VALUES(1,'A',10,1),(2,'A',-4,2),(3,'B',7,3),(4,'A',5,4),(5,'B',-2,5);CREATE TABLE physical(sku TEXT PRIMARY KEY,counted INTEGER);INSERT INTO physical VALUES('A',9),('B',5);",
  "expected": [
    {
      "sku": "A",
      "stock": 9
    },
    {
      "sku": "B",
      "stock": 5
    }
  ]
};
module.exports=sql=>grade(sql,spec);
