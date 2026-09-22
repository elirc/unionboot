'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE inventory(sku TEXT PRIMARY KEY NOT NULL,qty INTEGER NOT NULL,price INTEGER NOT NULL,version INTEGER NOT NULL);\nINSERT INTO inventory VALUES('A',5,10,2),('B',0,20,1);CREATE TABLE incoming(sku TEXT,qty INTEGER,price INTEGER,version INTEGER); INSERT INTO incoming VALUES('A',6,11,3),('C',2,30,1);",
  "expected": [
    {
      "sku": "A",
      "qty": 6,
      "price": 11,
      "version": 3
    },
    {
      "sku": "B",
      "qty": 0,
      "price": 20,
      "version": 1
    },
    {
      "sku": "C",
      "qty": 2,
      "price": 30,
      "version": 1
    }
  ]
};
module.exports=sql=>grade(sql,spec);
