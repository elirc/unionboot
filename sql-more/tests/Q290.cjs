'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE prices(sku TEXT,valid_from INTEGER,valid_to INTEGER,price INTEGER,PRIMARY KEY(sku,valid_from));INSERT INTO prices VALUES('A',1,4,10),('A',4,8,12),('A',8,NULL,15),('B',2,6,7),('B',7,NULL,9);",
  "expected": [
    {
      "valid_from": 1,
      "valid_to": 4,
      "price": 10
    },
    {
      "valid_from": 4,
      "valid_to": 8,
      "price": 12
    },
    {
      "valid_from": 8,
      "valid_to": 10,
      "price": 15
    },
    {
      "valid_from": 10,
      "valid_to": null,
      "price": 18
    }
  ]
};
module.exports=sql=>grade(sql,spec);
