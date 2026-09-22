'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE inventory(sku TEXT PRIMARY KEY NOT NULL,qty INTEGER NOT NULL,price INTEGER NOT NULL,version INTEGER NOT NULL);\nINSERT INTO inventory VALUES('A',5,10,2),('B',0,20,1);",
  "expected": [
    {
      "bucket": "day",
      "name": "hits",
      "value": 5
    },
    {
      "bucket": "week",
      "name": "hits",
      "value": 8
    }
  ]
};
module.exports=sql=>grade(sql,spec);
