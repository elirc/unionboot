'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE moves(id INTEGER PRIMARY KEY,sku TEXT,delta INTEGER,at INTEGER);INSERT INTO moves VALUES(1,'A',10,1),(2,'A',-4,2),(3,'B',7,3),(4,'A',5,4),(5,'B',-2,5);CREATE TABLE priced(id INTEGER PRIMARY KEY,sku TEXT,delta INTEGER,unit_cost INTEGER);INSERT INTO priced VALUES(1,'A',10,2),(2,'A',5,4),(3,'A',-7,NULL);",
  "expected": [
    {
      "units": 8,
      "unit_cost": 2.67
    }
  ]
};
module.exports=sql=>grade(sql,spec);
