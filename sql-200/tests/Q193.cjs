'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE orders2(id INTEGER PRIMARY KEY,customer_id INTEGER NOT NULL,status TEXT NOT NULL);\nCREATE TABLE lines2(order_id INTEGER NOT NULL,product_id INTEGER);\nINSERT INTO orders2 VALUES(1,10,'paid'),(2,11,'pending'),(3,10,'paid');\nINSERT INTO lines2 VALUES(1,100),(1,101),(3,100);",
  "expected": [
    {
      "detail": "SEARCH orders2 USING INDEX orders2_status (status=?)"
    }
  ]
};
module.exports=sql=>grade(sql,spec);
