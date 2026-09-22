'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE jobs(id INTEGER PRIMARY KEY,queue TEXT,state TEXT CHECK(state IN('queued','running','done','failed')));INSERT INTO jobs VALUES(1,'mail','queued'),(2,'mail','running'),(3,'mail','done'),(4,'bulk','queued'),(5,'bulk','failed');INSERT INTO jobs VALUES(6,'mail','queued'),(7,'mail','queued');",
  "expected": [
    {
      "id": 1,
      "state": "running"
    },
    {
      "id": 2,
      "state": "running"
    },
    {
      "id": 3,
      "state": "done"
    },
    {
      "id": 4,
      "state": "queued"
    },
    {
      "id": 5,
      "state": "failed"
    },
    {
      "id": 6,
      "state": "running"
    },
    {
      "id": 7,
      "state": "queued"
    }
  ]
};
module.exports=sql=>grade(sql,spec);
