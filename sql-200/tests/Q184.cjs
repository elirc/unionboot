'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE products(id INTEGER PRIMARY KEY,name TEXT,category TEXT,price INTEGER);\nINSERT INTO products VALUES(1,'Pen','office',3),(2,'Mug','home',8),(3,'Pad','office',12),(4,'Lamp','home',20),(5,'Rug','home',50);",
  "expected": [
    {
      "id": 4,
      "name": "Lamp"
    }
  ],
  "params": [
    "home",
    1,
    1
  ]
};
module.exports=sql=>grade(sql,spec);
