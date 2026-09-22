'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE customers(id INTEGER PRIMARY KEY,full_name TEXT,age_text TEXT);INSERT INTO customers VALUES(1,'Ada Lovelace','36'),(2,'Bo Li','20'),(3,'Cy','unknown');PRAGMA user_version=1;",
  "expected": [
    {
      "customer_id": 1,
      "given_name": "Ada"
    },
    {
      "customer_id": 2,
      "given_name": "Bo"
    },
    {
      "customer_id": 3,
      "given_name": "Cy"
    }
  ]
};
module.exports=sql=>grade(sql,spec);
