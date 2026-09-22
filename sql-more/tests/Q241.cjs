'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE users(id INTEGER PRIMARY KEY,email TEXT,active INTEGER,tenant INTEGER);INSERT INTO users VALUES(1,'Ada@x',1,10),(2,'ada@x',0,10),(3,'Bo@x',1,20);",
  "expected": [
    {
      "id": 1,
      "email": "Ada@x"
    },
    {
      "id": 3,
      "email": "Bo@x"
    }
  ],
  "probes": [
    {
      "sql": "INSERT INTO users VALUES(4,'ADA@X',1,30)",
      "reject": "UNIQUE"
    },
    {
      "sql": "INSERT INTO users VALUES(4,'ADA@X',0,30);SELECT COUNT(*) AS n FROM users",
      "expected": [
        {
          "n": 4
        }
      ]
    }
  ]
};
module.exports=sql=>grade(sql,spec);
