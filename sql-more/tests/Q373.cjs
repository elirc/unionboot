'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE jobs(id INTEGER PRIMARY KEY,queue TEXT,state TEXT CHECK(state IN('queued','running','done','failed')));INSERT INTO jobs VALUES(1,'mail','queued'),(2,'mail','running'),(3,'mail','done'),(4,'bulk','queued'),(5,'bulk','failed');",
  "expected": [
    {
      "id": 1,
      "state": "queued"
    },
    {
      "id": 2,
      "state": "done"
    }
  ]
};
module.exports=sql=>grade(sql,spec);
