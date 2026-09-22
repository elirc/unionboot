'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE baskets(id INTEGER PRIMARY KEY,body TEXT);INSERT INTO baskets VALUES(1,'{\"tags\":[\"red\",\"blue\",\"red\"],\"items\":[{\"sku\":\"A\",\"qty\":2},{\"sku\":\"B\",\"qty\":1}]}'),(2,'{\"tags\":[],\"items\":[]}'),(3,'{\"tags\":[\"blue\"],\"items\":[{\"sku\":\"A\",\"qty\":3}]}');",
  "expected": [
    {
      "id": 1,
      "position": 0,
      "tag": "red"
    },
    {
      "id": 1,
      "position": 1,
      "tag": "blue"
    },
    {
      "id": 1,
      "position": 2,
      "tag": "red"
    },
    {
      "id": 3,
      "position": 0,
      "tag": "blue"
    }
  ]
};
module.exports=sql=>grade(sql,spec);
