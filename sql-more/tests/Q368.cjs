'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE moves(id INTEGER PRIMARY KEY,sku TEXT,delta INTEGER,at INTEGER);INSERT INTO moves VALUES(1,'A',10,1),(2,'A',-4,2),(3,'B',7,3),(4,'A',5,4),(5,'B',-2,5);",
  "expected": [
    {
      "sku": "A",
      "rate": 0.8,
      "cover_days": 13.8
    },
    {
      "sku": "B",
      "rate": 0.4,
      "cover_days": 12.5
    }
  ]
};
module.exports=sql=>grade(sql,spec);
