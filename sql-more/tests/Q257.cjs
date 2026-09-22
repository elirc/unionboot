'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE VIRTUAL TABLE articles USING fts5(title,body);INSERT INTO articles(rowid,title,body) VALUES(1,'Red fox','quick brown fox jumps'),(2,'Blue bird','quick blue bird flies'),(3,'Fox notes','slow red fox sleeps'),(4,'Garden','blue flowers grow');",
  "expected": [
    {
      "rowid": 2
    }
  ]
};
module.exports=sql=>grade(sql,spec);
