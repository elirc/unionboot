'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE employees(id INTEGER PRIMARY KEY,name TEXT,dept TEXT,salary INTEGER);\nCREATE TABLE bonuses(employee_id INTEGER,amount INTEGER);\nINSERT INTO employees VALUES(1,'Ada','A',100),(2,'Bo','A',80),(3,'Cy','A',80),(4,'Dee','B',90),(5,'Eli','B',60),(6,'Flo','C',NULL);\nINSERT INTO bonuses VALUES(1,10),(1,5),(3,0),(4,20),(NULL,99);",
  "expected": [
    {
      "name": "Ada"
    },
    {
      "name": "Dee"
    }
  ]
};
module.exports=sql=>grade(sql,spec);
