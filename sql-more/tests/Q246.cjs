'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE users(id INTEGER PRIMARY KEY,email TEXT,active INTEGER,tenant INTEGER);INSERT INTO users VALUES(1,'Ada@x',1,10),(2,'ada@x',0,10),(3,'Bo@x',1,20);",
  "expected": [
    {
      "detail": "SEARCH users USING COVERING INDEX normalized (<expr>=?)"
    }
  ]
};
module.exports=sql=>grade(sql,spec);
