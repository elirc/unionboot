'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE candidates(name TEXT PRIMARY KEY);CREATE TABLE skills(name TEXT,skill TEXT,level INTEGER);CREATE TABLE required(skill TEXT,min_level INTEGER);INSERT INTO candidates VALUES('Ada'),('Bo'),('Cy'),('Dee');INSERT INTO skills VALUES('Ada','sql',3),('Ada','js',2),('Ada','css',1),('Bo','sql',2),('Cy','sql',1),('Cy','js',3);INSERT INTO required VALUES('sql',2),('js',2);",
  "expected": [
    {
      "name": "Dee"
    }
  ]
};
module.exports=sql=>grade(sql,spec);
