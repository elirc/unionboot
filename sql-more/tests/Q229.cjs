'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE configs(id INTEGER PRIMARY KEY,body TEXT);INSERT INTO configs VALUES(1,'{\"mode\":\"draft\",\"n\":2,\"tags\":[\"a\"],\"nested\":{\"x\":1,\"y\":2}}');",
  "expected": [
    {
      "n": 5,
      "mode": "draft"
    }
  ]
};
module.exports=sql=>grade(sql,spec);
