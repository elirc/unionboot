'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE prices(sku TEXT,valid_from INTEGER,valid_to INTEGER,price INTEGER,PRIMARY KEY(sku,valid_from));INSERT INTO prices VALUES('A',1,4,10),('A',4,8,12),('A',8,NULL,15),('B',2,6,7),('B',7,NULL,9);",
  "expected": [
    {
      "sku": "A",
      "price": 12
    },
    {
      "sku": "B",
      "price": 7
    }
  ]
};
module.exports=sql=>grade(sql,spec);
