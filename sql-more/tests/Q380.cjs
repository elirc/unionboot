'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE jobs(id INTEGER PRIMARY KEY,queue TEXT,state TEXT CHECK(state IN('queued','running','done','failed')));INSERT INTO jobs VALUES(1,'mail','queued'),(2,'mail','running'),(3,'mail','done'),(4,'bulk','queued'),(5,'bulk','failed');",
  "expected": [
    {
      "id": 1,
      "lease_token": "tok1"
    },
    {
      "id": 2,
      "lease_token": "tok2"
    },
    {
      "id": 3,
      "lease_token": null
    },
    {
      "id": 4,
      "lease_token": null
    },
    {
      "id": 5,
      "lease_token": null
    }
  ],
  "probes": [
    {
      "sql": "UPDATE jobs SET lease_token='tok1' WHERE id=3",
      "reject": "UNIQUE"
    }
  ]
};
module.exports=sql=>grade(sql,spec);
