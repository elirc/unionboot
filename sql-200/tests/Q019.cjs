'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE customers(id INTEGER PRIMARY KEY,name TEXT);\nCREATE TABLE orders(id INTEGER PRIMARY KEY,customer_id INTEGER,status TEXT);\nCREATE TABLE products(id INTEGER PRIMARY KEY,name TEXT,category TEXT);\nCREATE TABLE lines(order_id INTEGER,product_id INTEGER,qty INTEGER,price INTEGER);\nINSERT INTO customers VALUES(1,'Ada'),(2,'Bo'),(3,'Cy'),(4,'Dee');\nINSERT INTO orders VALUES(10,1,'paid'),(11,1,'pending'),(12,2,'paid'),(13,3,'cancelled');\nINSERT INTO products VALUES(1,'Pen','office'),(2,'Mug','home'),(3,'Pad','office'),(4,'Lamp','home');\nINSERT INTO lines VALUES(10,1,2,3),(10,2,1,8),(11,3,4,2),(12,1,1,3),(12,3,2,2),(13,2,2,8);",
  "expected": [
    {
      "name": "Cy"
    },
    {
      "name": "Dee"
    }
  ]
};
module.exports=sql=>grade(sql,spec);
