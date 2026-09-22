'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE nodes(id INTEGER PRIMARY KEY,name TEXT);CREATE TABLE closure(ancestor INTEGER,descendant INTEGER,depth INTEGER,PRIMARY KEY(ancestor,descendant));INSERT INTO nodes VALUES(1,'Root'),(2,'Sales'),(3,'Support'),(4,'East'),(5,'West');INSERT INTO closure VALUES(1,1,0),(2,2,0),(3,3,0),(4,4,0),(5,5,0),(1,2,1),(1,3,1),(2,4,1),(2,5,1),(1,4,2),(1,5,2);CREATE TABLE policy(node INTEGER PRIMARY KEY,mode TEXT);INSERT INTO policy VALUES(1,'read'),(2,'write'),(5,'deny');",
  "expected": [
    {
      "ancestor": 6,
      "depth": 0
    },
    {
      "ancestor": 2,
      "depth": 1
    },
    {
      "ancestor": 1,
      "depth": 2
    }
  ]
};
module.exports=sql=>grade(sql,spec);
