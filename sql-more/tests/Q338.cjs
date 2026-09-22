'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE projects(tenant INTEGER,id INTEGER,title TEXT,PRIMARY KEY(tenant,id)) WITHOUT ROWID;CREATE TABLE tasks(tenant INTEGER,id INTEGER,project_id INTEGER,title TEXT,PRIMARY KEY(tenant,id),FOREIGN KEY(tenant,project_id) REFERENCES projects(tenant,id)) WITHOUT ROWID;INSERT INTO projects VALUES(1,1,'Alpha'),(1,2,'Beta'),(2,1,'Gamma');INSERT INTO tasks VALUES(1,1,1,'A'),(1,2,2,'B'),(2,1,1,'C');",
  "expected": [
    {
      "tenant": 1,
      "id": 1,
      "title": "Alpha"
    },
    {
      "tenant": 1,
      "id": 2,
      "title": "Beta"
    },
    {
      "tenant": 2,
      "id": 1,
      "title": "Delta"
    }
  ]
};
module.exports=sql=>grade(sql,spec);
