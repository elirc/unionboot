'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE prices(sku TEXT,valid_from INTEGER,valid_to INTEGER,price INTEGER,PRIMARY KEY(sku,valid_from));INSERT INTO prices VALUES('A',1,4,10),('A',4,8,12),('A',8,NULL,15),('B',2,6,7),('B',7,NULL,9);CREATE TABLE orders(id INTEGER,sku TEXT,day INTEGER);INSERT INTO orders VALUES(1,'A',3),(2,'A',4),(3,'B',6),(4,'B',8);",
  "expected": [
    {
      "id": 1,
      "price": 10
    },
    {
      "id": 2,
      "price": 12
    },
    {
      "id": 3,
      "price": null
    },
    {
      "id": 4,
      "price": 9
    }
  ]
};
module.exports=sql=>grade(sql,spec);
