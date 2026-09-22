'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE jobs(id INTEGER PRIMARY KEY,queue TEXT,state TEXT CHECK(state IN('queued','running','done','failed')));INSERT INTO jobs VALUES(1,'mail','queued'),(2,'mail','running'),(3,'mail','done'),(4,'bulk','queued'),(5,'bulk','failed');",
  "expected": [
    {
      "id": 1,
      "attempts": 0
    },
    {
      "id": 2,
      "attempts": 0
    },
    {
      "id": 3,
      "attempts": 0
    },
    {
      "id": 4,
      "attempts": 0
    },
    {
      "id": 5,
      "attempts": 1
    }
  ]
};
module.exports=sql=>grade(sql,spec);
