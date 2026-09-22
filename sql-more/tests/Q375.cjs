'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE jobs(id INTEGER PRIMARY KEY,queue TEXT,state TEXT CHECK(state IN('queued','running','done','failed')));INSERT INTO jobs VALUES(1,'mail','queued'),(2,'mail','running'),(3,'mail','done'),(4,'bulk','queued'),(5,'bulk','failed');INSERT INTO jobs VALUES(6,'mail','failed');",
  "expected": [
    {
      "remaining": 3,
      "dead": 1
    }
  ]
};
module.exports=sql=>grade(sql,spec);
