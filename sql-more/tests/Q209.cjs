'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE docs(id INTEGER PRIMARY KEY,body TEXT CHECK(json_valid(body)));INSERT INTO docs VALUES(1,'{\"name\":\"Ada\",\"age\":30,\"active\":true,\"city\":null}'),(2,'{\"name\":\"Bo\",\"age\":\"20\",\"active\":false}'),(3,'{\"name\":\"Cy\",\"active\":true,\"city\":\"Rome\"}');",
  "expected": [
    {
      "id": 1
    }
  ]
};
module.exports=sql=>grade(sql,spec);
