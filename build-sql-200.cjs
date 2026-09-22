'use strict';
// SQL-200 authoring source. No packages, network, or learner-file replacement.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const target = path.join(__dirname, 'sql-200');
if (fs.existsSync(target)) throw new Error('Refusing existing sql-200 directory; never overwrite learner work.');
const families = [];
// A small SQLite-script tokenizer: semicolons inside literals/comments are not separators.
// Trigger BEGIN...END bodies are outside this pack's contract; learners write queries and simple SQL sequences.
function splitSQL(sql) {
  let parts=[],start=0,quote=null,line=false,block=false;
  for(let i=0;i<sql.length;i++) {
    const c=sql[i],n=sql[i+1];
    if(line){if(c==='\n')line=false;continue;}
    if(block){if(c==='*'&&n==='/'){block=false;i++;}continue;}
    if(quote){if(c===quote){if(n===quote){i++;}else quote=null;}continue;}
    if(c==='-'&&n==='-'){line=true;i++;continue;}
    if(c==='/'&&n==='*'){block=true;i++;continue;}
    if(c==="'"||c==='"'||c==='`'){quote=c;continue;}
    if(c==='['){quote=']';continue;}
    if(c===';'){parts.push(sql.slice(start,i));start=i+1;}
  }
  if(quote||block)throw new SyntaxError('Unterminated SQL literal or block comment');
  parts.push(sql.slice(start));
  return parts.filter(s=>s.replace(/--[^\n]*/g,'').replace(/\/\*[\s\S]*?\*\//g,'').trim());
}
function execute(db,sql,params) {
  const statements=splitSQL(sql);let result=[];
  for(let i=0;i<statements.length;i++){
    const stmt=db.prepare(statements[i]);
    const bound=params&&i===statements.length-1 ? params : [];
    let values;
    if(Array.isArray(bound)) values=stmt.all(...bound);
    else values=stmt.all(bound);
    result=values.map(r=>Object.fromEntries(Object.entries(r)));
    // EXPLAIN QUERY PLAN: node ids and parent links are version-dependent metadata, not the learning target.
    if(stmt.columns().map(c=>c.name).join(',')==='id,parent,notused,detail') result=result.map(r=>({detail:r.detail}));
  }
  return result;
}
function checkProbes(db,probes) {
  for(const p of probes){
    if(p.reject){assert.throws(()=>db.exec(p.sql),new RegExp(p.reject));}
    else assert.deepEqual(execute(db,p.sql),p.expected);
  }
}
const rows = (columns, values) => values.map(v => Object.fromEntries(columns.split(',').map((c, i) => [c, v[i]])));
function family(name, seed, definitions) {
  assert.equal(definitions.length, 10, name + ' must have ten scenarios');
  for (const d of definitions) {
    assert.ok(d.expected.length, name + '/' + d.semanticKey + ': expected rows must expose blank submissions');
    const { DatabaseSync } = require('node:sqlite');
    const db = new DatabaseSync(':memory:');
    try {
      db.exec('PRAGMA foreign_keys=ON;'); db.exec(seed + (d.seedExtra || ''));
      const actual = execute(db, d.sql, d.params);
      assert.deepEqual(actual, d.expected, name + '/' + d.semanticKey);
      if (d.probes) checkProbes(db, d.probes);
    } finally { db.close(); }
  }
  console.log('Preflight: 10/10 ' + name);
  families.push({ name, seed, definitions });
}
function q(semanticKey, task, sql, columns, values, extra = {}) {
  return { semanticKey, variant: semanticKey, task, sql, expected: rows(columns, values), ...extra };
}

family('Join preservation and matching', `
CREATE TABLE people(id INTEGER PRIMARY KEY, name TEXT NOT NULL, team_id INTEGER);
CREATE TABLE teams(id INTEGER PRIMARY KEY, label TEXT NOT NULL);
INSERT INTO people VALUES(1,'Ada',10),(2,'Bo',10),(3,'Cy',20),(4,'Dee',NULL),(5,'Eli',99);
INSERT INTO teams VALUES(10,'Blue'),(20,'Gold'),(30,'Red');`, [
q('inner-match-only','Return people with an existing team; order by person id.',
`SELECT p.name,t.label FROM people p JOIN teams t ON t.id=p.team_id ORDER BY p.id;`, 'name,label', [['Ada','Blue'],['Bo','Blue'],['Cy','Gold']]),
q('left-preserve-every-person','Return every person and their team label, retaining NULL for absent teams; order by person id.',
`SELECT p.name,t.label FROM people p LEFT JOIN teams t ON t.id=p.team_id ORDER BY p.id;`, 'name,label', [['Ada','Blue'],['Bo','Blue'],['Cy','Gold'],['Dee',null],['Eli',null]]),
q('left-preserve-every-team','Return every team and its matched people, including empty teams; order by team id then person id.',
`SELECT t.label,p.name FROM teams t LEFT JOIN people p ON p.team_id=t.id ORDER BY t.id,p.id;`, 'label,name', [['Blue','Ada'],['Blue','Bo'],['Gold','Cy'],['Red',null]]),
q('full-outer-emulation','Emulate a full outer join with LEFT JOIN plus UNION ALL: all people and unmatched teams. Order by label then name, with NULL labels first (SQLite default). Do not use native FULL JOIN.',
`SELECT p.name,t.label FROM people p LEFT JOIN teams t ON t.id=p.team_id
UNION ALL SELECT p.name,t.label FROM teams t LEFT JOIN people p ON p.team_id=t.id WHERE p.id IS NULL
ORDER BY label,name;`, 'name,label', [['Dee',null],['Eli',null],['Ada','Blue'],['Bo','Blue'],['Cy','Gold'],[null,'Red']]),
q('on-filter-preserves-left','Return every person but attach a label only for Blue teams. Put the Blue filter in ON, not WHERE. Order by person id.',
`SELECT p.name,t.label FROM people p LEFT JOIN teams t ON t.id=p.team_id AND t.label='Blue' ORDER BY p.id;`, 'name,label', [['Ada','Blue'],['Bo','Blue'],['Cy',null],['Dee',null],['Eli',null]]),
q('where-filter-rejects-unmatched','Return only people whose joined label is Blue; this WHERE policy intentionally excludes unmatched people. Order by person id.',
`SELECT p.name,t.label FROM people p LEFT JOIN teams t ON t.id=p.team_id WHERE t.label='Blue' ORDER BY p.id;`, 'name,label', [['Ada','Blue'],['Bo','Blue']]),
q('self-join-unique-teammate-pairs','Find unique unordered teammate pairs with the same non-NULL team id. Do not pair a person with themselves. Order by both person ids.',
`SELECT a.name AS first,b.name AS second FROM people a JOIN people b ON a.team_id=b.team_id AND a.id<b.id ORDER BY a.id,b.id;`, 'first,second', [['Ada','Bo']]),
q('cross-join-small-assignment-grid','Cross join people id <=2 with teams id >=20 to build candidate assignments; order by person id,team id.',
`SELECT p.name,t.label FROM people p CROSS JOIN teams t WHERE p.id<=2 AND t.id>=20 ORDER BY p.id,t.id;`, 'name,label', [['Ada','Gold'],['Ada','Red'],['Bo','Gold'],['Bo','Red']]),
q('unmatched-including-dangling-fk','Find people with no matching team, including NULL and dangling team ids. Order by person id.',
`SELECT p.name FROM people p LEFT JOIN teams t ON t.id=p.team_id WHERE t.id IS NULL ORDER BY p.id;`, 'name', [['Dee'],['Eli']]),
q('empty-team-count-zero','Count matched people per team, preserving empty teams as zero; count p.id, not COUNT(*). Order by team id.',
`SELECT t.label,COUNT(p.id) AS members FROM teams t LEFT JOIN people p ON t.id=p.team_id GROUP BY t.id,t.label ORDER BY t.id;`, 'label,members', [['Blue',2],['Gold',1],['Red',0]])
]);

family('Multi-table commerce joins', `
CREATE TABLE customers(id INTEGER PRIMARY KEY,name TEXT);
CREATE TABLE orders(id INTEGER PRIMARY KEY,customer_id INTEGER,status TEXT);
CREATE TABLE products(id INTEGER PRIMARY KEY,name TEXT,category TEXT);
CREATE TABLE lines(order_id INTEGER,product_id INTEGER,qty INTEGER,price INTEGER);
INSERT INTO customers VALUES(1,'Ada'),(2,'Bo'),(3,'Cy'),(4,'Dee');
INSERT INTO orders VALUES(10,1,'paid'),(11,1,'pending'),(12,2,'paid'),(13,3,'cancelled');
INSERT INTO products VALUES(1,'Pen','office'),(2,'Mug','home'),(3,'Pad','office'),(4,'Lamp','home');
INSERT INTO lines VALUES(10,1,2,3),(10,2,1,8),(11,3,4,2),(12,1,1,3),(12,3,2,2),(13,2,2,8);`, [
q('paid-line-detail','Join all four tables for paid line details. Order by order id and product id.',
`SELECT c.name AS customer,o.id AS order_id,p.name AS product,l.qty,l.qty*l.price AS amount FROM customers c JOIN orders o ON o.customer_id=c.id JOIN lines l ON l.order_id=o.id JOIN products p ON p.id=l.product_id WHERE o.status='paid' ORDER BY o.id,p.id;`, 'customer,order_id,product,qty,amount', [['Ada',10,'Pen',2,6],['Ada',10,'Mug',1,8],['Bo',12,'Pen',1,3],['Bo',12,'Pad',2,4]]),
q('paid-spend-preserve-customers','Return all customers and their paid spend, zero when none. Exclude pending/cancelled in the join condition. Order by customer id.',
`SELECT c.name,COALESCE(SUM(l.qty*l.price),0) AS spend FROM customers c LEFT JOIN orders o ON o.customer_id=c.id AND o.status='paid' LEFT JOIN lines l ON l.order_id=o.id GROUP BY c.id,c.name ORDER BY c.id;`, 'name,spend', [['Ada',14],['Bo',7],['Cy',0],['Dee',0]]),
q('category-paid-revenue','Report paid revenue by product category through orders and lines; order by category.',
`SELECT p.category,SUM(l.qty*l.price) AS revenue FROM products p JOIN lines l ON l.product_id=p.id JOIN orders o ON o.id=l.order_id WHERE o.status='paid' GROUP BY p.category ORDER BY p.category;`, 'category,revenue', [['home',8],['office',13]]),
q('distinct-paid-buyers-per-product','Count distinct paid buyers for every product, including zero-sales products. Order by product id.',
`SELECT p.name,COUNT(DISTINCT CASE WHEN o.status='paid' THEN o.customer_id END) AS buyers FROM products p LEFT JOIN lines l ON l.product_id=p.id LEFT JOIN orders o ON o.id=l.order_id GROUP BY p.id,p.name ORDER BY p.id;`, 'name,buyers', [['Pen',2],['Mug',1],['Pad',1],['Lamp',0]]),
q('order-count-not-line-count','Return paid order count per customer without overcounting line fan-out; preserve all customers and order by customer id.',
`SELECT c.name,COUNT(DISTINCT o.id) AS paid_orders FROM customers c LEFT JOIN orders o ON o.customer_id=c.id AND o.status='paid' LEFT JOIN lines l ON l.order_id=o.id GROUP BY c.id,c.name ORDER BY c.id;`, 'name,paid_orders', [['Ada',1],['Bo',1],['Cy',0],['Dee',0]]),
q('office-paid-customers-semijoin','List distinct customers who bought an office item on a paid order. Order by customer id.',
`SELECT DISTINCT c.id,c.name FROM customers c JOIN orders o ON o.customer_id=c.id JOIN lines l ON l.order_id=o.id JOIN products p ON p.id=l.product_id WHERE o.status='paid' AND p.category='office' ORDER BY c.id;`, 'id,name', [[1,'Ada'],[2,'Bo']]),
q('pending-reserved-quantities','Report quantities reserved on pending orders, grouped by product; order by product id.',
`SELECT p.name,SUM(l.qty) AS reserved FROM products p JOIN lines l ON l.product_id=p.id JOIN orders o ON o.id=l.order_id WHERE o.status='pending' GROUP BY p.id,p.name ORDER BY p.id;`, 'name,reserved', [['Pad',4]]),
q('customer-category-paid-breakdown','Report only customer/category pairs with paid sales; order by customer id then category.',
`SELECT c.name,p.category,SUM(l.qty*l.price) AS total FROM customers c JOIN orders o ON o.customer_id=c.id JOIN lines l ON l.order_id=o.id JOIN products p ON p.id=l.product_id WHERE o.status='paid' GROUP BY c.id,c.name,p.category ORDER BY c.id,p.category;`, 'name,category,total', [['Ada','home',8],['Ada','office',6],['Bo','office',7]]),
q('customers-with-no-paid-lines','Find customers with no paid order lines using NOT EXISTS across orders and lines; order by customer id.',
`SELECT c.name FROM customers c WHERE NOT EXISTS(SELECT 1 FROM orders o JOIN lines l ON l.order_id=o.id WHERE o.customer_id=c.id AND o.status='paid') ORDER BY c.id;`, 'name', [['Cy'],['Dee']]),
q('average-paid-order-not-line','Calculate average paid order value after aggregating lines to orders; round to one decimal place.',
`SELECT ROUND(AVG(total),1) AS average_order FROM (SELECT o.id,SUM(l.qty*l.price) AS total FROM orders o JOIN lines l ON l.order_id=o.id WHERE o.status='paid' GROUP BY o.id);`, 'average_order', [[10.5]])
]);

family('GROUP BY HAVING and aggregate policy', `
CREATE TABLE sales(id INTEGER PRIMARY KEY,region TEXT,amount INTEGER,status TEXT);
INSERT INTO sales VALUES(1,'East',10,'paid'),(2,'East',20,'paid'),(3,'East',100,'pending'),(4,'West',5,'paid'),(5,'West',NULL,'paid'),(6,'North',40,'paid'),(7,'North',-10,'refund'),(8,'South',NULL,'pending');`, [
q('sum-all-statuses','Sum amounts by region, retaining SQL NULL when every amount is NULL; order alphabetically.', `SELECT region,SUM(amount) AS total FROM sales GROUP BY region ORDER BY region;`, 'region,total', [['East',130],['North',30],['South',null],['West',5]]),
q('where-paid-before-group','Filter to paid rows before grouping; return their totals by region.', `SELECT region,SUM(amount) AS total FROM sales WHERE status='paid' GROUP BY region ORDER BY region;`, 'region,total', [['East',30],['North',40],['West',5]]),
q('having-paid-total-at-least-thirty','Group paid rows, retaining groups whose total is at least 30; order by region.', `SELECT region,SUM(amount) AS total FROM sales WHERE status='paid' GROUP BY region HAVING SUM(amount)>=30 ORDER BY region;`, 'region,total', [['East',30],['North',40]]),
q('count-rows-versus-values','Show COUNT(*) and COUNT(amount) by region; order by region.', `SELECT region,COUNT(*) AS rows_count,COUNT(amount) AS known_count FROM sales GROUP BY region ORDER BY region;`, 'region,rows_count,known_count', [['East',3,3],['North',2,2],['South',1,0],['West',2,1]]),
q('average-unknown-excluded','Average known amounts for each region; round to two decimals, keep all-unknown average NULL.', `SELECT region,ROUND(AVG(amount),2) AS average FROM sales GROUP BY region ORDER BY region;`, 'region,average', [['East',43.33],['North',15],['South',null],['West',5]]),
q('average-unknown-as-zero','Treat unknown amounts as zero before averaging; round to two decimals.', `SELECT region,ROUND(AVG(COALESCE(amount,0)),2) AS average FROM sales GROUP BY region ORDER BY region;`, 'region,average', [['East',43.33],['North',15],['South',0],['West',2.5]]),
q('having-multiple-statuses','Return regions with at least two distinct statuses and that status count.', `SELECT region,COUNT(DISTINCT status) AS statuses FROM sales GROUP BY region HAVING COUNT(DISTINCT status)>=2 ORDER BY region;`, 'region,statuses', [['East',2],['North',2]]),
q('having-no-unknowns','Return only regions with no NULL amounts, plus row count.', `SELECT region,COUNT(*) AS entries FROM sales GROUP BY region HAVING COUNT(*)=COUNT(amount) ORDER BY region;`, 'region,entries', [['East',3],['North',2]]),
q('where-positive-versus-net','Discard nonpositive and unknown values before summing; report regions with at least two qualifying rows.', `SELECT region,SUM(amount) AS total FROM sales WHERE amount>0 GROUP BY region HAVING COUNT(*)>=2 ORDER BY region;`, 'region,total', [['East',130]]),
q('group-by-two-dimensions','Group by region and status, returning rows and zero-filled total; order by both grouping keys.', `SELECT region,status,COUNT(*) AS entries,COALESCE(SUM(amount),0) AS total FROM sales GROUP BY region,status ORDER BY region,status;`, 'region,status,entries,total', [['East','paid',2,30],['East','pending',1,100],['North','paid',1,40],['North','refund',1,-10],['South','pending',1,0],['West','paid',2,5]])
]);

family('Subqueries correlated lookups and existence', `
CREATE TABLE employees(id INTEGER PRIMARY KEY,name TEXT,dept TEXT,salary INTEGER);
CREATE TABLE bonuses(employee_id INTEGER,amount INTEGER);
INSERT INTO employees VALUES(1,'Ada','A',100),(2,'Bo','A',80),(3,'Cy','A',80),(4,'Dee','B',90),(5,'Eli','B',60),(6,'Flo','C',NULL);
INSERT INTO bonuses VALUES(1,10),(1,5),(3,0),(4,20),(NULL,99);`, [
q('scalar-global-average','Return employees above the global average known salary, ordered by id.', `SELECT name,salary FROM employees WHERE salary>(SELECT AVG(salary) FROM employees) ORDER BY id;`, 'name,salary', [['Ada',100],['Dee',90]]),
q('correlated-department-average','Return employees above their own department average known salary.', `SELECT e.name,e.salary FROM employees e WHERE e.salary>(SELECT AVG(x.salary) FROM employees x WHERE x.dept=e.dept) ORDER BY e.id;`, 'name,salary', [['Ada',100],['Dee',90]]),
q('exists-any-bonus-including-zero','Return employees with any bonus row, even a zero bonus; do not duplicate employees.', `SELECT e.name FROM employees e WHERE EXISTS(SELECT 1 FROM bonuses b WHERE b.employee_id=e.id) ORDER BY e.id;`, 'name', [['Ada'],['Cy'],['Dee']]),
q('not-exists-null-safe-antijoin','Return employees without bonus rows. A NULL employee_id in bonuses must not poison the answer (avoid unfiltered NOT IN).', `SELECT e.name FROM employees e WHERE NOT EXISTS(SELECT 1 FROM bonuses b WHERE b.employee_id=e.id) ORDER BY e.id;`, 'name', [['Bo'],['Eli'],['Flo']]),
q('in-subquery-positive-bonus','Return employees appearing in the set of positive-bonus employee ids.', `SELECT name FROM employees WHERE id IN(SELECT employee_id FROM bonuses WHERE amount>0) ORDER BY id;`, 'name', [['Ada'],['Dee']]),
q('join-preaggregated-bonus','Preaggregate bonus totals, then left join all employees with missing total zero.', `SELECT e.name,COALESCE(b.total,0) AS bonus FROM employees e LEFT JOIN (SELECT employee_id,SUM(amount) AS total FROM bonuses GROUP BY employee_id) b ON b.employee_id=e.id ORDER BY e.id;`, 'name,bonus', [['Ada',15],['Bo',0],['Cy',0],['Dee',20],['Eli',0],['Flo',0]]),
q('correlated-bonus-total','Use a correlated scalar aggregate to report employees whose bonus sum is at least 15, plus that sum.', `SELECT e.name,(SELECT SUM(b.amount) FROM bonuses b WHERE b.employee_id=e.id) AS bonus FROM employees e WHERE (SELECT SUM(b.amount) FROM bonuses b WHERE b.employee_id=e.id)>=15 ORDER BY e.id;`, 'name,bonus', [['Ada',15],['Dee',20]]),
q('correlated-no-higher-salary','Return known-salary employees for whom no colleague in the same department earns more; order by id.', `SELECT e.name FROM employees e WHERE e.salary IS NOT NULL AND NOT EXISTS(SELECT 1 FROM employees x WHERE x.dept=e.dept AND x.salary>e.salary) ORDER BY e.id;`, 'name', [['Ada'],['Dee']]),
q('correlated-count-higher-colleagues','For every employee count same-department colleagues with a strictly higher salary. Unknown salary compares to nothing, producing zero.', `SELECT e.name,(SELECT COUNT(*) FROM employees x WHERE x.dept=e.dept AND x.salary>e.salary) AS higher FROM employees e ORDER BY e.id;`, 'name,higher', [['Ada',0],['Bo',1],['Cy',1],['Dee',0],['Eli',1],['Flo',0]]),
q('relational-division-all-known-paid','Return departments where every known-salary employee has a bonus record; require at least one known-salary employee (no vacuous C).', `SELECT DISTINCT e.dept FROM employees e WHERE EXISTS(SELECT 1 FROM employees k WHERE k.dept=e.dept AND k.salary IS NOT NULL) AND NOT EXISTS(SELECT 1 FROM employees x WHERE x.dept=e.dept AND x.salary IS NOT NULL AND NOT EXISTS(SELECT 1 FROM bonuses b WHERE b.employee_id=x.id)) ORDER BY e.dept;`, 'dept', [['B']], { seedExtra: `INSERT INTO bonuses VALUES(5,2);` })
]);

family('Ranking and top N per group', `
CREATE TABLE scores(id INTEGER PRIMARY KEY,team TEXT,name TEXT,score INTEGER);
INSERT INTO scores VALUES(1,'A','Ada',100),(2,'A','Bo',90),(3,'A','Cy',90),(4,'A','Dee',70),(5,'B','Eli',80),(6,'B','Flo',80),(7,'B','Gus',60);`, [
q('row-number-with-id-tiebreak','Number players within team by score descending then id ascending; order by team and row number.', `SELECT team,name,ROW_NUMBER() OVER(PARTITION BY team ORDER BY score DESC,id) AS place FROM scores ORDER BY team,place;`, 'team,name,place', [['A','Ada',1],['A','Bo',2],['A','Cy',3],['A','Dee',4],['B','Eli',1],['B','Flo',2],['B','Gus',3]]),
q('rank-with-gaps-on-ties','Rank within team by score descending, sharing tied ranks and leaving gaps; order by team,id.', `SELECT team,name,RANK() OVER(PARTITION BY team ORDER BY score DESC) AS place FROM scores ORDER BY team,id;`, 'team,name,place', [['A','Ada',1],['A','Bo',2],['A','Cy',2],['A','Dee',4],['B','Eli',1],['B','Flo',1],['B','Gus',3]]),
q('dense-rank-without-gaps','Dense-rank scores within team, with no gaps after ties; order by team,id.', `SELECT team,name,DENSE_RANK() OVER(PARTITION BY team ORDER BY score DESC) AS place FROM scores ORDER BY team,id;`, 'team,name,place', [['A','Ada',1],['A','Bo',2],['A','Cy',2],['A','Dee',3],['B','Eli',1],['B','Flo',1],['B','Gus',2]]),
q('top-one-deterministic','Return exactly one winner per team, choosing the lower id on ties; order by team.', `WITH ranked AS(SELECT *,ROW_NUMBER() OVER(PARTITION BY team ORDER BY score DESC,id) AS rn FROM scores) SELECT team,name,score FROM ranked WHERE rn=1 ORDER BY team;`, 'team,name,score', [['A','Ada',100],['B','Eli',80]]),
q('top-one-all-tied-winners','Return all players tied for the highest score of each team; order by team,id.', `WITH ranked AS(SELECT *,RANK() OVER(PARTITION BY team ORDER BY score DESC) AS r FROM scores) SELECT team,name,score FROM ranked WHERE r=1 ORDER BY team,id;`, 'team,name,score', [['A','Ada',100],['B','Eli',80],['B','Flo',80]]),
q('top-two-rows-per-team','Return at most two rows per team using score descending and id to break ties.', `WITH r AS(SELECT *,ROW_NUMBER() OVER(PARTITION BY team ORDER BY score DESC,id) AS n FROM scores) SELECT team,name FROM r WHERE n<=2 ORDER BY team,n;`, 'team,name', [['A','Ada'],['A','Bo'],['B','Eli'],['B','Flo']]),
q('top-two-distinct-score-levels','Return all players in each team\'s top two distinct score levels; order by team,score descending,id.', `WITH r AS(SELECT *,DENSE_RANK() OVER(PARTITION BY team ORDER BY score DESC) AS n FROM scores) SELECT team,name FROM r WHERE n<=2 ORDER BY team,score DESC,id;`, 'team,name', [['A','Ada'],['A','Bo'],['A','Cy'],['B','Eli'],['B','Flo'],['B','Gus']]),
q('global-rank-not-partitioned','Rank all players globally by score with gaps; order by score descending then id.', `SELECT name,RANK() OVER(ORDER BY score DESC) AS place FROM scores ORDER BY score DESC,id;`, 'name,place', [['Ada',1],['Bo',2],['Cy',2],['Eli',4],['Flo',4],['Dee',6],['Gus',7]]),
q('second-distinct-score-only','Return all players at the second distinct score level in each team.', `WITH r AS(SELECT *,DENSE_RANK() OVER(PARTITION BY team ORDER BY score DESC) AS n FROM scores) SELECT team,name,score FROM r WHERE n=2 ORDER BY team,id;`, 'team,name,score', [['A','Bo',90],['A','Cy',90],['B','Gus',60]]),
q('bottom-one-per-team','Return the lowest scorer per team, lower id wins a tie.', `WITH r AS(SELECT *,ROW_NUMBER() OVER(PARTITION BY team ORDER BY score,id) AS n FROM scores) SELECT team,name,score FROM r WHERE n=1 ORDER BY team;`, 'team,name,score', [['A','Dee',70],['B','Gus',60]])
]);

family('Window offsets frames and analytics', `
CREATE TABLE readings(id INTEGER PRIMARY KEY,sensor TEXT,day INTEGER,value INTEGER);
INSERT INTO readings VALUES(1,'A',1,10),(2,'A',2,20),(3,'A',2,30),(4,'A',4,40),(5,'B',1,5),(6,'B',3,15);`, [
q('lag-previous-reading-null-boundary','Show previous value per sensor ordered by day,id, with NULL for first row; output ordered by id.', `SELECT id,LAG(value) OVER(PARTITION BY sensor ORDER BY day,id) AS previous FROM readings ORDER BY id;`, 'id,previous', [[1,null],[2,10],[3,20],[4,30],[5,null],[6,5]]),
q('lead-next-reading-zero-boundary','Show next value per sensor ordered by day,id, with zero at the end.', `SELECT id,LEAD(value,1,0) OVER(PARTITION BY sensor ORDER BY day,id) AS next FROM readings ORDER BY id;`, 'id,next', [[1,20],[2,30],[3,40],[4,0],[5,15],[6,0]]),
q('lag-delta-null-first','Compute change from the previous row per sensor; first delta is NULL.', `SELECT id,value-LAG(value) OVER(PARTITION BY sensor ORDER BY day,id) AS delta FROM readings ORDER BY id;`, 'id,delta', [[1,null],[2,10],[3,10],[4,10],[5,null],[6,10]]),
q('running-total-rows-frame','Return running sums per sensor with an explicit ROWS frame ordered by day,id.', `SELECT id,SUM(value) OVER(PARTITION BY sensor ORDER BY day,id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS total FROM readings ORDER BY id;`, 'id,total', [[1,10],[2,30],[3,60],[4,100],[5,5],[6,20]]),
q('running-total-range-day-peers','Use RANGE through current day, so both A day=2 rows see the same accumulated total.', `SELECT id,SUM(value) OVER(PARTITION BY sensor ORDER BY day RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS total FROM readings ORDER BY id;`, 'id,total', [[1,10],[2,60],[3,60],[4,100],[5,5],[6,20]]),
q('moving-average-two-rows','Average current and one preceding reading per sensor, round to two decimals.', `SELECT id,ROUND(AVG(value) OVER(PARTITION BY sensor ORDER BY day,id ROWS BETWEEN 1 PRECEDING AND CURRENT ROW),2) AS average FROM readings ORDER BY id;`, 'id,average', [[1,10],[2,15],[3,25],[4,35],[5,5],[6,10]]),
q('centered-three-row-average','Average preceding,current,and following rows within sensor; boundary windows contain fewer rows.', `SELECT id,ROUND(AVG(value) OVER(PARTITION BY sensor ORDER BY day,id ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING),2) AS average FROM readings ORDER BY id;`, 'id,average', [[1,15],[2,20],[3,30],[4,35],[5,10],[6,10]]),
q('last-value-full-partition','Show each sensor\'s final reading on every row. Explicitly extend LAST_VALUE frame through UNBOUNDED FOLLOWING.', `SELECT id,LAST_VALUE(value) OVER(PARTITION BY sensor ORDER BY day,id ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_value FROM readings ORDER BY id;`, 'id,last_value', [[1,40],[2,40],[3,40],[4,40],[5,15],[6,15]]),
q('share-of-partition-total','Compute percentage of sensor total per reading, rounded to one decimal. Use real division.', `SELECT id,ROUND(100.0*value/SUM(value) OVER(PARTITION BY sensor),1) AS percent FROM readings ORDER BY id;`, 'id,percent', [[1,10],[2,20],[3,30],[4,40],[5,25],[6,75]]),
q('moving-calendar-range-one-day','Sum values within current day and one day before, using numeric RANGE (not previous physical row).', `SELECT id,SUM(value) OVER(PARTITION BY sensor ORDER BY day RANGE BETWEEN 1 PRECEDING AND CURRENT ROW) AS total FROM readings ORDER BY id;`, 'id,total', [[1,10],[2,60],[3,60],[4,40],[5,5],[6,15]])
]);

family('CTE pipelines and recursive traversal', `
CREATE TABLE staff(id INTEGER PRIMARY KEY,name TEXT,manager_id INTEGER);
INSERT INTO staff VALUES(1,'Ada',NULL),(2,'Bo',1),(3,'Cy',1),(4,'Dee',2),(5,'Eli',2),(6,'Flo',4);
CREATE TABLE edges(src INTEGER,dst INTEGER);
INSERT INTO edges VALUES(1,2),(2,3),(3,1),(2,4);`, [
q('ordinary-cte-direct-report-count','Use a nonrecursive CTE to count direct reports per manager, returning only managers with two or more.', `WITH counts AS(SELECT manager_id,COUNT(*) AS reports FROM staff WHERE manager_id IS NOT NULL GROUP BY manager_id) SELECT s.name,c.reports FROM counts c JOIN staff s ON s.id=c.manager_id WHERE c.reports>=2 ORDER BY s.id;`, 'name,reports', [['Ada',2],['Bo',2]]),
q('org-tree-root-depth','Recursively traverse from Ada id=1, include root at depth zero, order by depth,id.', `WITH RECURSIVE tree(id,name,depth) AS(SELECT id,name,0 FROM staff WHERE id=1 UNION ALL SELECT s.id,s.name,t.depth+1 FROM staff s JOIN tree t ON s.manager_id=t.id) SELECT name,depth FROM tree ORDER BY depth,id;`, 'name,depth', [['Ada',0],['Bo',1],['Cy',1],['Dee',2],['Eli',2],['Flo',3]]),
q('subtree-exclude-anchor','List descendants of Bo id=2, excluding Bo; order by id.', `WITH RECURSIVE tree(id,name) AS(SELECT id,name FROM staff WHERE manager_id=2 UNION ALL SELECT s.id,s.name FROM staff s JOIN tree t ON s.manager_id=t.id) SELECT name FROM tree ORDER BY id;`, 'name', [['Dee'],['Eli'],['Flo']]),
q('ancestors-upward','Walk from Flo id=6 upward, include Flo at distance zero; order by distance.', `WITH RECURSIVE chain(id,name,manager_id,distance) AS(SELECT id,name,manager_id,0 FROM staff WHERE id=6 UNION ALL SELECT s.id,s.name,s.manager_id,c.distance+1 FROM staff s JOIN chain c ON s.id=c.manager_id) SELECT name,distance FROM chain ORDER BY distance;`, 'name,distance', [['Flo',0],['Dee',1],['Bo',2],['Ada',3]]),
q('tree-path-strings','Build slash-delimited name paths from the root and return leaves only, ordered by staff id.', `WITH RECURSIVE tree(id,path) AS(SELECT id,name FROM staff WHERE manager_id IS NULL UNION ALL SELECT s.id,t.path||'/'||s.name FROM staff s JOIN tree t ON s.manager_id=t.id) SELECT path FROM tree t WHERE NOT EXISTS(SELECT 1 FROM staff s WHERE s.manager_id=t.id) ORDER BY t.id;`, 'path', [['Ada/Cy'],['Ada/Bo/Eli'],['Ada/Bo/Dee/Flo']]),
q('depth-limited-subtree','Traverse from Ada but stop at depth two, returning only depth-two names.', `WITH RECURSIVE tree(id,name,depth) AS(SELECT id,name,0 FROM staff WHERE id=1 UNION ALL SELECT s.id,s.name,t.depth+1 FROM staff s JOIN tree t ON s.manager_id=t.id WHERE t.depth<2) SELECT name FROM tree WHERE depth=2 ORDER BY id;`, 'name', [['Dee'],['Eli']]),
q('cycle-safe-reachability-union','Compute distinct nodes reachable from 1 in cyclic edges, including 1. Use UNION duplicate elimination on node alone so the recursion terminates.', `WITH RECURSIVE reach(node) AS(VALUES(1) UNION SELECT e.dst FROM edges e JOIN reach r ON e.src=r.node) SELECT node FROM reach ORDER BY node;`, 'node', [[1],[2],[3],[4]]),
q('integer-series-inclusive','Use a recursive CTE to produce integers 2 through 6 and their squares.', `WITH RECURSIVE nums(n) AS(VALUES(2) UNION ALL SELECT n+1 FROM nums WHERE n<6) SELECT n,n*n AS square FROM nums ORDER BY n;`, 'n,square', [[2,4],[3,9],[4,16],[5,25],[6,36]]),
q('recursive-date-spine-left-join','Generate 2024-01-01 through 2024-01-04 inclusively, left join daily events, and zero-fill absent days. SQLite date modifiers are dialect-specific.', `WITH RECURSIVE days(day) AS(VALUES('2024-01-01') UNION ALL SELECT date(day,'+1 day') FROM days WHERE day<'2024-01-04') SELECT d.day,COUNT(e.id) AS events FROM days d LEFT JOIN events e ON e.day=d.day GROUP BY d.day ORDER BY d.day;`, 'day,events', [['2024-01-01',2],['2024-01-02',0],['2024-01-03',1],['2024-01-04',0]], {seedExtra:`CREATE TABLE events(id INTEGER,day TEXT); INSERT INTO events VALUES(1,'2024-01-01'),(2,'2024-01-01'),(3,'2024-01-03');`}),
q('all-manager-descendant-counts','Use recursive ancestor/descendant pairs to count all descendants for each manager, excluding self.', `WITH RECURSIVE links(ancestor,descendant) AS(SELECT manager_id,id FROM staff WHERE manager_id IS NOT NULL UNION ALL SELECT l.ancestor,s.id FROM links l JOIN staff s ON s.manager_id=l.descendant) SELECT s.name,COUNT(*) AS descendants FROM links l JOIN staff s ON s.id=l.ancestor GROUP BY s.id,s.name ORDER BY s.id;`, 'name,descendants', [['Ada',5],['Bo',3],['Dee',1]])
]);

family('Set operations and membership policies', `
CREATE TABLE spring(name TEXT); CREATE TABLE autumn(name TEXT);
INSERT INTO spring VALUES('Ada'),('Bo'),('Bo'),('Cy'),(NULL);
INSERT INTO autumn VALUES('Bo'),('Dee'),(NULL),(NULL);`, [
q('union-distinct-including-null','Return distinct names in either cohort, NULL first then alphabetical. UNION treats duplicate NULLs as one set member.', `SELECT name FROM spring UNION SELECT name FROM autumn ORDER BY name;`, 'name', [[null],['Ada'],['Bo'],['Cy'],['Dee']]),
q('union-all-retain-multiplicity','Combine both cohorts without deduplication, NULL first then name.', `SELECT name FROM spring UNION ALL SELECT name FROM autumn ORDER BY name;`, 'name', [[null],[null],[null],['Ada'],['Bo'],['Bo'],['Bo'],['Cy'],['Dee']]),
q('intersect-including-null','Return distinct names shared by both cohorts, including their shared NULL.', `SELECT name FROM spring INTERSECT SELECT name FROM autumn ORDER BY name;`, 'name', [[null],['Bo']]),
q('except-spring-minus-autumn','Return distinct spring-only names.', `SELECT name FROM spring EXCEPT SELECT name FROM autumn ORDER BY name;`, 'name', [['Ada'],['Cy']]),
q('except-autumn-minus-spring','Return distinct autumn-only names.', `SELECT name FROM autumn EXCEPT SELECT name FROM spring ORDER BY name;`, 'name', [['Dee']]),
q('symmetric-difference','Return names in exactly one cohort, using two EXCEPT sets combined with UNION; parenthesize via CTEs.', `WITH a AS(SELECT name FROM spring EXCEPT SELECT name FROM autumn),b AS(SELECT name FROM autumn EXCEPT SELECT name FROM spring) SELECT name FROM a UNION SELECT name FROM b ORDER BY name;`, 'name', [['Ada'],['Cy'],['Dee']]),
q('intersect-known-names-only','Find shared known names, explicitly excluding NULL before intersection.', `SELECT name FROM spring WHERE name IS NOT NULL INTERSECT SELECT name FROM autumn WHERE name IS NOT NULL ORDER BY name;`, 'name', [['Bo']]),
q('union-all-source-tagged','Return distinct known name/source pairs (deduplicate inside each cohort), ordered by name,source.', `SELECT DISTINCT name,'spring' AS source FROM spring WHERE name IS NOT NULL UNION ALL SELECT DISTINCT name,'autumn' AS source FROM autumn WHERE name IS NOT NULL ORDER BY name,source;`, 'name,source', [['Ada','spring'],['Bo','autumn'],['Bo','spring'],['Cy','spring'],['Dee','autumn']]),
q('multiset-count-after-union-all','Count occurrences of each name across both cohorts, preserving NULL as its own group.', `WITH both AS(SELECT name FROM spring UNION ALL SELECT name FROM autumn) SELECT name,COUNT(*) AS occurrences FROM both GROUP BY name ORDER BY name;`, 'name,occurrences', [[null,3],['Ada',1],['Bo',3],['Cy',1],['Dee',1]]),
q('join-is-not-intersect-multiplicity','Join the cohorts on equal known names, deliberately retaining duplicate match pairs rather than INTERSECT semantics.', `SELECT s.name FROM spring s JOIN autumn a ON s.name=a.name ORDER BY s.name;`, 'name', [['Bo'],['Bo']])
]);

family('NULL semantics and three valued logic', `
CREATE TABLE measures(id INTEGER PRIMARY KEY,a INTEGER,b INTEGER,label TEXT);
INSERT INTO measures VALUES(1,10,2,'ok'),(2,NULL,2,NULL),(3,5,0,''),(4,NULL,NULL,'missing'),(5,0,0,'zero'),(6,3,NULL,NULL);
CREATE TABLE excluded(value INTEGER); INSERT INTO excluded VALUES(5),(NULL);`, [
q('coalesce-missing-numeric','Return a with NULL replaced by -1; zero remains zero.', `SELECT id,COALESCE(a,-1) AS value FROM measures ORDER BY id;`, 'id,value', [[1,10],[2,-1],[3,5],[4,-1],[5,0],[6,3]]),
q('nullif-safe-real-ratio','Divide a by b using real arithmetic and NULLIF to produce NULL for zero denominators.', `SELECT id,1.0*a/NULLIF(b,0) AS ratio FROM measures ORDER BY id;`, 'id,ratio', [[1,5],[2,null],[3,null],[4,null],[5,null],[6,null]]),
q('blank-and-null-label-fallback','Normalize both empty labels and NULL labels to unknown using NULLIF and COALESCE.', `SELECT id,COALESCE(NULLIF(label,''),'unknown') AS label FROM measures ORDER BY id;`, 'id,label', [[1,'ok'],[2,'unknown'],[3,'unknown'],[4,'missing'],[5,'zero'],[6,'unknown']]),
q('not-equal-excludes-unknown','Return ids where a !=5. Unknown comparisons must remain excluded, not treated as true.', `SELECT id FROM measures WHERE a<>5 ORDER BY id;`, 'id', [[1],[5],[6]]),
q('not-equal-or-unknown','Return ids where a is either different from 5 or NULL.', `SELECT id FROM measures WHERE a<>5 OR a IS NULL ORDER BY id;`, 'id', [[1],[2],[4],[5],[6]]),
q('null-safe-equality-emulation','Return ids with a and b equal including both-NULL as equal. Emulate null-safe equality explicitly.', `SELECT id FROM measures WHERE a=b OR (a IS NULL AND b IS NULL) ORDER BY id;`, 'id', [[4],[5]]),
q('is-distinct-emulation','Return ids where a and b differ, treating exactly one NULL as distinct and both NULL as equal.', `SELECT id FROM measures WHERE a<>b OR (a IS NULL AND b IS NOT NULL) OR (a IS NOT NULL AND b IS NULL) ORDER BY id;`, 'id', [[1],[2],[3],[6]]),
q('not-in-null-filter-and-known-left','Return known a values not in excluded; filter NULL out of the subquery and exclude unknown left values.', `SELECT id,a FROM measures WHERE a IS NOT NULL AND a NOT IN(SELECT value FROM excluded WHERE value IS NOT NULL) ORDER BY id;`, 'id,a', [[1,10],[5,0],[6,3]]),
q('three-valued-or-truth-table','Show the SQLite result (1=true,0=false,NULL=unknown) of (a=5 OR b=2) for every row. SQLite has no separate boolean storage type.', `SELECT id,(a=5 OR b=2) AS truth FROM measures ORDER BY id;`, 'id,truth', [[1,1],[2,1],[3,1],[4,null],[5,0],[6,null]]),
q('count-null-and-zero-separately','Return one summary row counting NULL a, zero a, and all known a separately.', `SELECT SUM(CASE WHEN a IS NULL THEN 1 ELSE 0 END) AS missing,SUM(CASE WHEN a=0 THEN 1 ELSE 0 END) AS zeros,COUNT(a) AS known FROM measures;`, 'missing,zeros,known', [[2,1,4]])
]);

family('SQLite dates times and calendar boundaries', `
CREATE TABLE events(id INTEGER PRIMARY KEY,happened_at TEXT);
INSERT INTO events VALUES(1,'2024-02-28 23:30:00'),(2,'2024-02-29 00:30:00'),(3,'2024-03-01 12:00:00'),(4,'2024-03-03 09:00:00'),(5,'2024-12-31 23:00:00');`, [
q('date-part-iso-text','Extract the date from each ISO timestamp using SQLite date(); order by id.', `SELECT id,date(happened_at) AS day FROM events ORDER BY id;`, 'id,day', [[1,'2024-02-28'],[2,'2024-02-29'],[3,'2024-03-01'],[4,'2024-03-03'],[5,'2024-12-31']]),
q('half-open-month-filter','Return February events using inclusive lower and exclusive March upper timestamp bounds.', `SELECT id FROM events WHERE happened_at>='2024-02-01' AND happened_at<'2024-03-01' ORDER BY id;`, 'id', [[1],[2]]),
q('month-group-strftime','Count events by YYYY-MM using SQLite strftime, ordered by month.', `SELECT strftime('%Y-%m',happened_at) AS month,COUNT(*) AS events FROM events GROUP BY month ORDER BY month;`, 'month,events', [['2024-02',2],['2024-03',2],['2024-12',1]]),
q('leap-year-end-of-month','Return month-end date for each event via start of month,+1 month,-1 day; SQLite modifiers.', `SELECT id,date(happened_at,'start of month','+1 month','-1 day') AS month_end FROM events ORDER BY id;`, 'id,month_end', [[1,'2024-02-29'],[2,'2024-02-29'],[3,'2024-03-31'],[4,'2024-03-31'],[5,'2024-12-31']]),
q('fixed-offset-day-shift','Apply a fixed +2 hour offset (not an IANA time zone or DST conversion) and return shifted dates.', `SELECT id,date(happened_at,'+2 hours') AS local_day FROM events ORDER BY id;`, 'id,local_day', [[1,'2024-02-29'],[2,'2024-02-29'],[3,'2024-03-01'],[4,'2024-03-03'],[5,'2025-01-01']]),
q('elapsed-hours-julianday','Calculate elapsed hours from event 1 to event 2 with julianday; round to two decimals.', `SELECT ROUND((julianday(b.happened_at)-julianday(a.happened_at))*24,2) AS hours FROM events a CROSS JOIN events b WHERE a.id=1 AND b.id=2;`, 'hours', [[1]]),
q('weekend-sunday-zero','Return weekend events using SQLite strftime %w where Sunday=0 and Saturday=6.', `SELECT id,strftime('%w',happened_at) AS weekday FROM events WHERE strftime('%w',happened_at) IN('0','6') ORDER BY id;`, 'id,weekday', [[4,'0']]),
q('monday-week-bucket','Compute the Monday date of the week containing each event, using %w arithmetic (Sunday belongs to the prior Monday).', `SELECT id,date(happened_at,'-'||((CAST(strftime('%w',happened_at) AS INTEGER)+6)%7)||' days') AS week_start FROM events ORDER BY id;`, 'id,week_start', [[1,'2024-02-26'],[2,'2024-02-26'],[3,'2024-02-26'],[4,'2024-02-26'],[5,'2024-12-30']]),
q('unixepoch-explicit-modifier','Convert integer epoch seconds to UTC ISO timestamps using explicit unixepoch modifier; do not use auto.', `SELECT seconds,datetime(seconds,'unixepoch') AS utc FROM epochs ORDER BY seconds;`, 'seconds,utc', [[0,'1970-01-01 00:00:00'],[86400,'1970-01-02 00:00:00'],[1709164800,'2024-02-29 00:00:00']], {seedExtra:`CREATE TABLE epochs(seconds INTEGER); INSERT INTO epochs VALUES(0),(86400),(1709164800);`}),
q('calendar-day-age-fixed-asof','Compute date-only age in whole days as of fixed 2024-03-04, excluding events after that date. No wall-clock now.', `SELECT id,CAST(julianday('2024-03-04')-julianday(date(happened_at)) AS INTEGER) AS age_days FROM events WHERE date(happened_at)<='2024-03-04' ORDER BY id;`, 'id,age_days', [[1,5],[2,4],[3,3],[4,1]])
]);

family('String normalization parsing and matching', `
CREATE TABLE contacts(id INTEGER PRIMARY KEY,name TEXT,email TEXT,code TEXT);
INSERT INTO contacts VALUES(1,' Ada ','ADA@EXAMPLE.COM','AB-001'),(2,'Bo','bo@work.org','AB-002'),(3,'cy','cy@example.com','XY-010'),(4,'Dee',NULL,'XY-011'),(5,'Eli','eli+tag@example.com','ZZ-100');`, [
q('trim-lowercase-ascii','Trim surrounding spaces from name and lowercase email; SQLite built-ins are ASCII-oriented without ICU. Preserve NULL email.', `SELECT id,trim(name) AS name,lower(email) AS email FROM contacts ORDER BY id;`, 'id,name,email', [[1,'Ada','ada@example.com'],[2,'Bo','bo@work.org'],[3,'cy','cy@example.com'],[4,'Dee',null],[5,'Eli','eli+tag@example.com']]),
q('extract-email-domain','Extract lowercase domain after @ for known emails, using instr and substr.', `SELECT id,lower(substr(email,instr(email,'@')+1)) AS domain FROM contacts WHERE email IS NOT NULL ORDER BY id;`, 'id,domain', [[1,'example.com'],[2,'work.org'],[3,'example.com'],[5,'example.com']]),
q('domain-count-normalized','Count known emails by normalized domain; order by domain.', `SELECT lower(substr(email,instr(email,'@')+1)) AS domain,COUNT(*) AS contacts FROM contacts WHERE email IS NOT NULL GROUP BY domain ORDER BY domain;`, 'domain,contacts', [['example.com',3],['work.org',1]]),
q('code-prefix-and-numeric-suffix','Parse two-letter prefix and integer suffix from all fixed-format codes.', `SELECT id,substr(code,1,2) AS prefix,CAST(substr(code,4) AS INTEGER) AS number FROM contacts ORDER BY id;`, 'id,prefix,number', [[1,'AB',1],[2,'AB',2],[3,'XY',10],[4,'XY',11],[5,'ZZ',100]]),
q('replace-delimiter','Remove hyphens from codes using replace.', `SELECT id,replace(code,'-','') AS compact FROM contacts ORDER BY id;`, 'id,compact', [[1,'AB001'],[2,'AB002'],[3,'XY010'],[4,'XY011'],[5,'ZZ100']]),
q('length-after-trim','Return names whose trimmed length is exactly three, preserving original case after trimming.', `SELECT id,trim(name) AS name FROM contacts WHERE length(trim(name))=3 ORDER BY id;`, 'id,name', [[1,'Ada'],[4,'Dee'],[5,'Eli']]),
q('case-sensitive-glob-prefix','Use SQLite GLOB for case-sensitive code matching XY-*; return code and id ordered by id.', `SELECT id,code FROM contacts WHERE code GLOB 'XY-*' ORDER BY id;`, 'id,code', [[3,'XY-010'],[4,'XY-011']]),
q('like-literal-wildcard-escape','Find labels containing a literal underscore with LIKE and ESCAPE, not a one-character wildcard.', `SELECT id,label FROM labels WHERE label LIKE '%!_%' ESCAPE '!' ORDER BY id;`, 'id,label', [[1,'a_b'],[3,'_']], {seedExtra:`CREATE TABLE labels(id INTEGER,label TEXT); INSERT INTO labels VALUES(1,'a_b'),(2,'axb'),(3,'_'),(4,'ab');`}),
q('concatenation-null-fallback','Build display text name <email>, with trimmed name and lowercase email; replace missing email with no-email.', `SELECT id,trim(name)||' <'||COALESCE(lower(email),'no-email')||'>' AS display FROM contacts ORDER BY id;`, 'id,display', [[1,'Ada <ada@example.com>'],[2,'Bo <bo@work.org>'],[3,'cy <cy@example.com>'],[4,'Dee <no-email>'],[5,'Eli <eli+tag@example.com>']]),
q('ordered-group-concat','Build a single comma-separated list of trimmed names sorted by id descending. Order input explicitly inside a subquery.', `SELECT group_concat(name,',') AS roster FROM (SELECT trim(name) AS name FROM contacts ORDER BY id DESC);`, 'roster', [['Eli,Dee,cy,Bo,Ada']])
]);

family('CASE pivot and conditional aggregation', `
CREATE TABLE tickets(id INTEGER PRIMARY KEY,team TEXT,status TEXT,hours INTEGER,priority INTEGER);
INSERT INTO tickets VALUES(1,'A','open',2,1),(2,'A','closed',5,3),(3,'A','open',NULL,2),(4,'B','closed',3,1),(5,'B','pending',4,NULL),(6,'B','open',0,3);`, [
q('searched-case-priority-bands','Map priority 1 to urgent,2 to normal,3 to low,and NULL to unknown; order by id.', `SELECT id,CASE WHEN priority=1 THEN 'urgent' WHEN priority=2 THEN 'normal' WHEN priority=3 THEN 'low' ELSE 'unknown' END AS band FROM tickets ORDER BY id;`, 'id,band', [[1,'urgent'],[2,'low'],[3,'normal'],[4,'urgent'],[5,'unknown'],[6,'low']]),
q('simple-case-status-labels','Use simple CASE to map open->todo,closed->done,and every other status->waiting.', `SELECT id,CASE status WHEN 'open' THEN 'todo' WHEN 'closed' THEN 'done' ELSE 'waiting' END AS label FROM tickets ORDER BY id;`, 'id,label', [[1,'todo'],[2,'done'],[3,'todo'],[4,'done'],[5,'waiting'],[6,'todo']]),
q('count-pivot-all-statuses','Pivot counts by team into open_count,closed_count,pending_count columns; missing categories count zero.', `SELECT team,SUM(CASE WHEN status='open' THEN 1 ELSE 0 END) AS open_count,SUM(CASE WHEN status='closed' THEN 1 ELSE 0 END) AS closed_count,SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) AS pending_count FROM tickets GROUP BY team ORDER BY team;`, 'team,open_count,closed_count,pending_count', [['A',2,1,0],['B',1,1,1]]),
q('sum-pivot-hours-zero-fill','Pivot total hours for open and closed tickets by team; unknown hours contribute zero.', `SELECT team,SUM(CASE WHEN status='open' THEN COALESCE(hours,0) ELSE 0 END) AS open_hours,SUM(CASE WHEN status='closed' THEN COALESCE(hours,0) ELSE 0 END) AS closed_hours FROM tickets GROUP BY team ORDER BY team;`, 'team,open_hours,closed_hours', [['A',2,5],['B',0,3]]),
q('conditional-average-ignore-other-statuses','Average known open-ticket hours per team; do not turn non-open rows into zero.', `SELECT team,AVG(CASE WHEN status='open' THEN hours END) AS average_open FROM tickets GROUP BY team ORDER BY team;`, 'team,average_open', [['A',2],['B',0]]),
q('weighted-priority-score','Sum workload points per team using urgent=5,normal=2,low=1,unknown=0 regardless of hours.', `SELECT team,SUM(CASE priority WHEN 1 THEN 5 WHEN 2 THEN 2 WHEN 3 THEN 1 ELSE 0 END) AS points FROM tickets GROUP BY team ORDER BY team;`, 'team,points', [['A',8],['B',6]]),
q('case-boundary-hours','Classify NULL hours as unestimated,zero as none,1..3 as small,and >3 as large. Test NULL first.', `SELECT id,CASE WHEN hours IS NULL THEN 'unestimated' WHEN hours=0 THEN 'none' WHEN hours<=3 THEN 'small' ELSE 'large' END AS size FROM tickets ORDER BY id;`, 'id,size', [[1,'small'],[2,'large'],[3,'unestimated'],[4,'small'],[5,'large'],[6,'none']]),
q('conditional-having-open-at-least-two','Return team and total ticket count only for teams with at least two open tickets. Keep closed tickets in the total.', `SELECT team,COUNT(*) AS tickets FROM tickets GROUP BY team HAVING SUM(CASE WHEN status='open' THEN 1 ELSE 0 END)>=2 ORDER BY team;`, 'team,tickets', [['A',3]]),
q('closed-percentage-all-tickets','Calculate closed-ticket percentage per team out of all statuses, rounded to one decimal.', `SELECT team,ROUND(100.0*SUM(CASE WHEN status='closed' THEN 1 ELSE 0 END)/COUNT(*),1) AS closed_percent FROM tickets GROUP BY team ORDER BY team;`, 'team,closed_percent', [['A',33.3],['B',33.3]]),
q('custom-case-sort-status','Sort pending first,open second,closed last,then id; return id and status.', `SELECT id,status FROM tickets ORDER BY CASE status WHEN 'pending' THEN 0 WHEN 'open' THEN 1 ELSE 2 END,id;`, 'id,status', [[5,'pending'],[1,'open'],[3,'open'],[6,'open'],[2,'closed'],[4,'closed']])
]);

family('SQLite schema constraints and integrity', `CREATE TABLE departments(id INTEGER PRIMARY KEY); INSERT INTO departments VALUES(10),(20);`, [
q('integer-primary-key-rowid-alias','SQLite-specific: create items(id INTEGER PRIMARY KEY,name TEXT NOT NULL). Insert One without id, then select id,name ordered by id. The grader also checks generated id and required name.', `CREATE TABLE items(id INTEGER PRIMARY KEY,name TEXT NOT NULL); INSERT INTO items(name) VALUES('One'); SELECT id,name FROM items ORDER BY id;`, 'id,name', [[1,'One']], {probes:[{sql:`INSERT INTO items(name) VALUES(NULL)`,reject:'NOT NULL'},{sql:`SELECT rowid,id FROM items`,expected:rows('id',[[1]])}]}),
q('not-null-and-check-positive','Create stock(sku TEXT PRIMARY KEY NOT NULL,qty INTEGER NOT NULL CHECK(qty>=0)); insert A with 0 and B with 3, then return all rows ordered by sku. Negative and NULL quantity must be rejected.', `CREATE TABLE stock(sku TEXT PRIMARY KEY NOT NULL,qty INTEGER NOT NULL CHECK(qty>=0)); INSERT INTO stock VALUES('A',0),('B',3); SELECT sku,qty FROM stock ORDER BY sku;`, 'sku,qty', [['A',0],['B',3]], {probes:[{sql:`INSERT INTO stock VALUES('C',-1)`,reject:'CHECK'},{sql:`INSERT INTO stock VALUES('C',NULL)`,reject:'NOT NULL'}]}),
q('unique-email-case-sensitive','Create users(id INTEGER PRIMARY KEY,email TEXT NOT NULL UNIQUE) with default BINARY case sensitivity. Insert Ada@x and ada@x as different emails, then return id,email. Exact duplicates must fail.', `CREATE TABLE users(id INTEGER PRIMARY KEY,email TEXT NOT NULL UNIQUE); INSERT INTO users VALUES(1,'Ada@x'),(2,'ada@x'); SELECT id,email FROM users ORDER BY id;`, 'id,email', [[1,'Ada@x'],[2,'ada@x']], {probes:[{sql:`INSERT INTO users VALUES(3,'Ada@x')`,reject:'UNIQUE'}]}),
q('unique-email-nocase-ascii','Create users(id INTEGER PRIMARY KEY,email TEXT NOT NULL COLLATE NOCASE UNIQUE), insert Ada@x, and return id,email. SQLite NOCASE is ASCII-oriented; differently cased duplicate ada@x must fail.', `CREATE TABLE users(id INTEGER PRIMARY KEY,email TEXT NOT NULL COLLATE NOCASE UNIQUE); INSERT INTO users VALUES(1,'Ada@x'); SELECT id,email FROM users ORDER BY id;`, 'id,email', [[1,'Ada@x']], {probes:[{sql:`INSERT INTO users VALUES(2,'ada@x')`,reject:'UNIQUE'}]}),
q('composite-primary-key-without-rowid','SQLite-specific: create membership(user_id INTEGER,team_id INTEGER,role TEXT NOT NULL,PRIMARY KEY(user_id,team_id)) WITHOUT ROWID. Insert (1,10,reader),(1,20,writer); select all sorted by both ids. Duplicate pair and NULL key must fail.', `CREATE TABLE membership(user_id INTEGER,team_id INTEGER,role TEXT NOT NULL,PRIMARY KEY(user_id,team_id)) WITHOUT ROWID; INSERT INTO membership VALUES(1,10,'reader'),(1,20,'writer'); SELECT user_id,team_id,role FROM membership ORDER BY user_id,team_id;`, 'user_id,team_id,role', [[1,10,'reader'],[1,20,'writer']], {probes:[{sql:`INSERT INTO membership VALUES(1,10,'owner')`,reject:'UNIQUE'},{sql:`INSERT INTO membership VALUES(NULL,10,'owner')`,reject:'NOT NULL'}]}),
q('foreign-key-restrict','Create workers(id INTEGER PRIMARY KEY,dept_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT). Insert (1,10), then return rows. Orphan insert and deleting department 10 must fail; foreign_keys is enabled by the runner.', `CREATE TABLE workers(id INTEGER PRIMARY KEY,dept_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT); INSERT INTO workers VALUES(1,10); SELECT id,dept_id FROM workers ORDER BY id;`, 'id,dept_id', [[1,10]], {probes:[{sql:`INSERT INTO workers VALUES(2,99)`,reject:'FOREIGN KEY'},{sql:`DELETE FROM departments WHERE id=10`,reject:'FOREIGN KEY'}]}),
q('foreign-key-cascade-delete','Create workers(id INTEGER PRIMARY KEY,dept_id INTEGER REFERENCES departments(id) ON DELETE CASCADE); insert workers (1,10),(2,20), delete department 10, and return remaining workers.', `CREATE TABLE workers(id INTEGER PRIMARY KEY,dept_id INTEGER REFERENCES departments(id) ON DELETE CASCADE); INSERT INTO workers VALUES(1,10),(2,20); DELETE FROM departments WHERE id=10; SELECT id,dept_id FROM workers ORDER BY id;`, 'id,dept_id', [[2,20]], {probes:[{sql:`DELETE FROM departments WHERE id=20; SELECT COUNT(*) AS remaining FROM workers`,expected:rows('remaining',[[0]])}]}),
q('check-enum-and-boolean-integer','SQLite-specific: create flags(id INTEGER PRIMARY KEY,status TEXT NOT NULL CHECK(status IN (draft,live)),enabled INTEGER NOT NULL CHECK(enabled IN (0,1))) using quoted status literals. Insert (1,draft,0),(2,live,1); return rows. Invalid status and boolean integer 2 must fail.', `CREATE TABLE flags(id INTEGER PRIMARY KEY,status TEXT NOT NULL CHECK(status IN('draft','live')),enabled INTEGER NOT NULL CHECK(enabled IN(0,1))); INSERT INTO flags VALUES(1,'draft',0),(2,'live',1); SELECT id,status,enabled FROM flags ORDER BY id;`, 'id,status,enabled', [[1,'draft',0],[2,'live',1]], {probes:[{sql:`INSERT INTO flags VALUES(3,'other',0)`,reject:'CHECK'},{sql:`INSERT INTO flags VALUES(3,'draft',2)`,reject:'CHECK'}]}),
q('strict-table-reject-text-numeric','SQLite-specific STRICT table: create amounts(id INTEGER PRIMARY KEY,value INTEGER NOT NULL) STRICT. Insert (1,7), return rows. Non-numeric text must not be stored as INTEGER.', `CREATE TABLE amounts(id INTEGER PRIMARY KEY,value INTEGER NOT NULL) STRICT; INSERT INTO amounts VALUES(1,7); SELECT id,value FROM amounts ORDER BY id;`, 'id,value', [[1,7]], {probes:[{sql:`INSERT INTO amounts VALUES(2,'seven')`,reject:'cannot store TEXT'}]}),
q('nullable-check-three-valued-acceptance','Create optional_scores(id INTEGER PRIMARY KEY,score INTEGER CHECK(score>=0)) without NOT NULL. SQLite CHECK permits NULL because only false violates it. Insert (1,NULL),(2,0); select rows. Negative must fail; NULL must remain allowed.', `CREATE TABLE optional_scores(id INTEGER PRIMARY KEY,score INTEGER CHECK(score>=0)); INSERT INTO optional_scores VALUES(1,NULL),(2,0); SELECT id,score FROM optional_scores ORDER BY id;`, 'id,score', [[1,null],[2,0]], {probes:[{sql:`INSERT INTO optional_scores VALUES(3,-1)`,reject:'CHECK'},{sql:`INSERT INTO optional_scores VALUES(3,NULL); SELECT score FROM optional_scores WHERE id=3`,expected:rows('score',[[null]])}]})
]);

family('UPSERT conflict targets and merge policy', `
CREATE TABLE inventory(sku TEXT PRIMARY KEY NOT NULL,qty INTEGER NOT NULL,price INTEGER NOT NULL,version INTEGER NOT NULL);
INSERT INTO inventory VALUES('A',5,10,2),('B',0,20,1);`, [
q('insert-new-key','Insert missing SKU C=(qty 3,price 30,version 1) with ON CONFLICT DO NOTHING; return all inventory ordered by sku.', `INSERT INTO inventory VALUES('C',3,30,1) ON CONFLICT(sku) DO NOTHING; SELECT sku,qty,price,version FROM inventory ORDER BY sku;`, 'sku,qty,price,version', [['A',5,10,2],['B',0,20,1],['C',3,30,1]]),
q('existing-key-do-nothing','Attempt A=(99,99,99), preserving existing row on conflict; return all inventory.', `INSERT INTO inventory VALUES('A',99,99,99) ON CONFLICT(sku) DO NOTHING; SELECT sku,qty,price,version FROM inventory ORDER BY sku;`, 'sku,qty,price,version', [['A',5,10,2],['B',0,20,1]]),
q('replace-quantity-only','Upsert A=(3,99,9), changing only qty to excluded.qty and preserving price/version.', `INSERT INTO inventory VALUES('A',3,99,9) ON CONFLICT(sku) DO UPDATE SET qty=excluded.qty; SELECT sku,qty,price,version FROM inventory ORDER BY sku;`, 'sku,qty,price,version', [['A',3,10,2],['B',0,20,1]]),
q('accumulate-quantity','Upsert A quantity 3, adding incoming qty to stored qty; price/version unchanged.', `INSERT INTO inventory VALUES('A',3,99,9) ON CONFLICT(sku) DO UPDATE SET qty=inventory.qty+excluded.qty; SELECT sku,qty,price,version FROM inventory ORDER BY sku;`, 'sku,qty,price,version', [['A',8,10,2],['B',0,20,1]]),
q('keep-maximum-quantity','Incoming A qty=3 and B qty=4; upsert to maximum of current/incoming qty, preserving other fields.', `INSERT INTO inventory VALUES('A',3,99,9),('B',4,99,9) ON CONFLICT(sku) DO UPDATE SET qty=MAX(inventory.qty,excluded.qty); SELECT sku,qty,price,version FROM inventory ORDER BY sku;`, 'sku,qty,price,version', [['A',5,10,2],['B',4,20,1]]),
q('accept-newer-version','Incoming A=(7,12,3); update all three fields only when incoming version is strictly newer.', `INSERT INTO inventory VALUES('A',7,12,3) ON CONFLICT(sku) DO UPDATE SET qty=excluded.qty,price=excluded.price,version=excluded.version WHERE excluded.version>inventory.version; SELECT sku,qty,price,version FROM inventory ORDER BY sku;`, 'sku,qty,price,version', [['A',7,12,3],['B',0,20,1]]),
q('reject-stale-version','Incoming A=(7,12,1); apply strictly-newer-version UPSERT policy, leaving version 2 unchanged.', `INSERT INTO inventory VALUES('A',7,12,1) ON CONFLICT(sku) DO UPDATE SET qty=excluded.qty,price=excluded.price,version=excluded.version WHERE excluded.version>inventory.version; SELECT sku,qty,price,version FROM inventory ORDER BY sku;`, 'sku,qty,price,version', [['A',5,10,2],['B',0,20,1]]),
q('minimum-price-and-version-increment','Incoming A price 8; keep minimum price, preserve qty, increment stored version by one rather than adopting incoming version.', `INSERT INTO inventory VALUES('A',100,8,50) ON CONFLICT(sku) DO UPDATE SET price=MIN(inventory.price,excluded.price),version=inventory.version+1; SELECT sku,qty,price,version FROM inventory ORDER BY sku;`, 'sku,qty,price,version', [['A',5,8,3],['B',0,20,1]]),
q('batch-insert-select-merge','Merge incoming table into inventory, replacing qty/price/version on conflicts and inserting new keys. SQLite INSERT SELECT UPSERT needs WHERE true to disambiguate ON.', `INSERT INTO inventory SELECT sku,qty,price,version FROM incoming WHERE true ON CONFLICT(sku) DO UPDATE SET qty=excluded.qty,price=excluded.price,version=excluded.version; SELECT sku,qty,price,version FROM inventory ORDER BY sku;`, 'sku,qty,price,version', [['A',6,11,3],['B',0,20,1],['C',2,30,1]], {seedExtra:`CREATE TABLE incoming(sku TEXT,qty INTEGER,price INTEGER,version INTEGER); INSERT INTO incoming VALUES('A',6,11,3),('C',2,30,1);`}),
q('composite-conflict-target','Create counters(bucket TEXT,name TEXT,value INTEGER,PRIMARY KEY(bucket,name)); insert day/hits=2 and week/hits=8, then upsert day/hits incoming 3 by adding only that composite key. Return sorted rows.', `CREATE TABLE counters(bucket TEXT,name TEXT,value INTEGER,PRIMARY KEY(bucket,name)); INSERT INTO counters VALUES('day','hits',2),('week','hits',8); INSERT INTO counters VALUES('day','hits',3) ON CONFLICT(bucket,name) DO UPDATE SET value=counters.value+excluded.value; SELECT bucket,name,value FROM counters ORDER BY bucket,name;`, 'bucket,name,value', [['day','hits',5],['week','hits',8]])
]);

family('Transactions savepoints and atomic state', `
CREATE TABLE accounts(id INTEGER PRIMARY KEY,balance INTEGER NOT NULL CHECK(balance>=0));
INSERT INTO accounts VALUES(1,100),(2,50);
CREATE TABLE audit(id INTEGER PRIMARY KEY,note TEXT);`, [
q('commit-balanced-transfer','In one explicit transaction transfer 20 from account 1 to 2 and commit. Return all balances ordered by id.', `BEGIN; UPDATE accounts SET balance=balance-20 WHERE id=1; UPDATE accounts SET balance=balance+20 WHERE id=2; COMMIT; SELECT id,balance FROM accounts ORDER BY id;`, 'id,balance', [[1,80],[2,70]]),
q('rollback-transfer','Transfer 20 in an explicit transaction but ROLLBACK it; return balances after rollback.', `BEGIN; UPDATE accounts SET balance=balance-20 WHERE id=1; UPDATE accounts SET balance=balance+20 WHERE id=2; ROLLBACK; SELECT id,balance FROM accounts ORDER BY id;`, 'id,balance', [[1,100],[2,50]]),
q('savepoint-discard-inner-changes','Begin; subtract 10 from account 1; set savepoint optional; add 99 to account 2; roll back to optional and release it; commit. Return balances.', `BEGIN; UPDATE accounts SET balance=balance-10 WHERE id=1; SAVEPOINT optional; UPDATE accounts SET balance=balance+99 WHERE id=2; ROLLBACK TO optional; RELEASE optional; COMMIT; SELECT id,balance FROM accounts ORDER BY id;`, 'id,balance', [[1,90],[2,50]]),
q('release-savepoint-then-outer-rollback','Begin; create savepoint inner_step; add 30 to account 2; release savepoint; roll back outer transaction. RELEASE is not an outer COMMIT.', `BEGIN; SAVEPOINT inner_step; UPDATE accounts SET balance=balance+30 WHERE id=2; RELEASE inner_step; ROLLBACK; SELECT id,balance FROM accounts ORDER BY id;`, 'id,balance', [[1,100],[2,50]]),
q('savepoint-as-outer-transaction','Without BEGIN, start SAVEPOINT batch; add 5 to both balances; RELEASE batch commits the outermost savepoint transaction.', `SAVEPOINT batch; UPDATE accounts SET balance=balance+5; RELEASE batch; SELECT id,balance FROM accounts ORDER BY id;`, 'id,balance', [[1,105],[2,55]]),
q('transactional-ddl-rollback','SQLite-specific: create temporary_work table within BEGIN, insert a row, then ROLLBACK. Return count of that table name in sqlite_schema (zero). DDL is transactional here.', `BEGIN; CREATE TABLE temporary_work(value INTEGER); INSERT INTO temporary_work VALUES(1); ROLLBACK; SELECT COUNT(*) AS tables_found FROM sqlite_schema WHERE type='table' AND name='temporary_work';`, 'tables_found', [[0]]),
q('commit-data-and-audit','Atomically transfer 10 and insert audit note transfer:10; commit, then return each account balance plus audit row count.', `BEGIN; UPDATE accounts SET balance=balance-10 WHERE id=1; UPDATE accounts SET balance=balance+10 WHERE id=2; INSERT INTO audit(note) VALUES('transfer:10'); COMMIT; SELECT id,balance,(SELECT COUNT(*) FROM audit) AS audit_count FROM accounts ORDER BY id;`, 'id,balance,audit_count', [[1,90,1],[2,60,1]]),
q('rollback-audit-with-transfer','Transfer 10 and insert audit note inside one transaction, then roll back both. Return balances and audit row count.', `BEGIN; UPDATE accounts SET balance=balance-10 WHERE id=1; UPDATE accounts SET balance=balance+10 WHERE id=2; INSERT INTO audit(note) VALUES('transfer:10'); ROLLBACK; SELECT id,balance,(SELECT COUNT(*) FROM audit) AS audit_count FROM accounts ORDER BY id;`, 'id,balance,audit_count', [[1,100,0],[2,50,0]]),
q('nested-savepoint-preserve-middle','Begin, add 1 to account 1, savepoint a, add 2, savepoint b, add 4, rollback to b, release b, release a, commit. Return balances.', `BEGIN; UPDATE accounts SET balance=balance+1 WHERE id=1; SAVEPOINT a; UPDATE accounts SET balance=balance+2 WHERE id=1; SAVEPOINT b; UPDATE accounts SET balance=balance+4 WHERE id=1; ROLLBACK TO b; RELEASE b; RELEASE a; COMMIT; SELECT id,balance FROM accounts ORDER BY id;`, 'id,balance', [[1,103],[2,50]]),
q('immediate-transaction-commit','SQLite-specific: use BEGIN IMMEDIATE, decrease account 1 by 15 and increase account 2 by 15, then COMMIT and return balances. This single-connection exercise verifies committed state, not concurrent lock contention.', `BEGIN IMMEDIATE; UPDATE accounts SET balance=balance-15 WHERE id=1; UPDATE accounts SET balance=balance+15 WHERE id=2; COMMIT; SELECT id,balance FROM accounts ORDER BY id;`, 'id,balance', [[1,85],[2,65]])
]);

family('UPDATE DELETE and subquery driven mutations', `
CREATE TABLE tasks(id INTEGER PRIMARY KEY,owner TEXT,status TEXT,points INTEGER);
CREATE TABLE blocked(owner TEXT); CREATE TABLE adjustments(owner TEXT,delta INTEGER);
INSERT INTO tasks VALUES(1,'Ada','open',3),(2,'Ada','done',5),(3,'Bo','open',2),(4,'Cy','open',4),(5,'Cy','done',1),(6,'Dee','open',NULL);
INSERT INTO blocked VALUES('Bo'),(NULL); INSERT INTO adjustments VALUES('Ada',2),('Cy',-1);`, [
q('update-owner-in-subquery','Mark tasks of blocked owners cancelled using IN; NULL in blocked does not match Dee. Return all id,status.', `UPDATE tasks SET status='cancelled' WHERE owner IN(SELECT owner FROM blocked); SELECT id,status FROM tasks ORDER BY id;`, 'id,status', [[1,'open'],[2,'done'],[3,'cancelled'],[4,'open'],[5,'done'],[6,'open']]),
q('delete-blocked-exists','Delete tasks with a matching blocked owner using EXISTS; return remaining id,owner.', `DELETE FROM tasks WHERE EXISTS(SELECT 1 FROM blocked b WHERE b.owner=tasks.owner); SELECT id,owner FROM tasks ORDER BY id;`, 'id,owner', [[1,'Ada'],[2,'Ada'],[4,'Cy'],[5,'Cy'],[6,'Dee']]),
q('correlated-adjustment-guard','Add each owner\'s adjustment to all of their task points; update only owners present in adjustments to avoid NULL assignment.', `UPDATE tasks SET points=points+(SELECT delta FROM adjustments a WHERE a.owner=tasks.owner) WHERE EXISTS(SELECT 1 FROM adjustments a WHERE a.owner=tasks.owner); SELECT id,points FROM tasks ORDER BY id;`, 'id,points', [[1,5],[2,7],[3,2],[4,3],[5,0],[6,null]]),
q('coalesce-fill-unknown-points','Replace only NULL points with zero, leaving known values unchanged.', `UPDATE tasks SET points=0 WHERE points IS NULL; SELECT id,points FROM tasks ORDER BY id;`, 'id,points', [[1,3],[2,5],[3,2],[4,4],[5,1],[6,0]]),
q('delete-completed-only','Delete done tasks and return all remaining id,status.', `DELETE FROM tasks WHERE status='done'; SELECT id,status FROM tasks ORDER BY id;`, 'id,status', [[1,'open'],[3,'open'],[4,'open'],[6,'open']]),
q('delete-owner-with-low-total','Delete all tasks of owners whose total known points is below 3. NULL-only sum does not qualify.', `DELETE FROM tasks WHERE owner IN(SELECT owner FROM tasks GROUP BY owner HAVING SUM(points)<3); SELECT id,owner FROM tasks ORDER BY id;`, 'id,owner', [[1,'Ada'],[2,'Ada'],[4,'Cy'],[5,'Cy'],[6,'Dee']]),
q('update-unblocked-open-semijoin','Add 10 points to open unblocked tasks only; zero-fill unknown before adding. Use NOT EXISTS so NULL blocked owners do not poison the filter.', `UPDATE tasks SET points=COALESCE(points,0)+10 WHERE status='open' AND NOT EXISTS(SELECT 1 FROM blocked b WHERE b.owner=tasks.owner); SELECT id,points FROM tasks ORDER BY id;`, 'id,points', [[1,13],[2,5],[3,2],[4,14],[5,1],[6,10]]),
q('update-highest-open-task','Mark exactly one highest-point open task urgent, with id as ascending tie-break. Choose target via ordered subquery.', `UPDATE tasks SET status='urgent' WHERE id=(SELECT id FROM tasks WHERE status='open' ORDER BY points DESC,id LIMIT 1); SELECT id,status FROM tasks ORDER BY id;`, 'id,status', [[1,'open'],[2,'done'],[3,'open'],[4,'urgent'],[5,'done'],[6,'open']]),
q('delete-no-adjustment-owners','Delete tasks whose owner has no adjustment; use NOT EXISTS and return id,owner.', `DELETE FROM tasks WHERE NOT EXISTS(SELECT 1 FROM adjustments a WHERE a.owner=tasks.owner); SELECT id,owner FROM tasks ORDER BY id;`, 'id,owner', [[1,'Ada'],[2,'Ada'],[4,'Cy'],[5,'Cy']]),
q('update-returning-single-row','SQLite-specific RETURNING: increase task 3 points by 7 and return id,points from the UPDATE itself. Exactly one row avoids unspecified multi-row RETURNING ordering.', `UPDATE tasks SET points=points+7 WHERE id=3 RETURNING id,points;`, 'id,points', [[3,9]], {probes:[{sql:`SELECT points FROM tasks WHERE id=3`,expected:rows('points',[[9]])}]})
]);

family('Gaps islands sequences and streaks', `
CREATE TABLE visits(id INTEGER PRIMARY KEY,day INTEGER);
INSERT INTO visits VALUES(1,1),(2,2),(3,4),(4,5),(5,6),(6,9);
CREATE TABLE battery(id INTEGER PRIMARY KEY,level INTEGER);
INSERT INTO battery VALUES(1,80),(2,60),(3,50),(4,50),(5,55),(6,54),(7,54),(8,70);`, [
q('next-visit-gap','Return each visit day and days until the next visit per ordered row; final gap is NULL. Order by day.', `SELECT day,LEAD(day) OVER(ORDER BY day)-day AS gap FROM visits ORDER BY day;`, 'day,gap', [[1,1],[2,2],[4,1],[5,1],[6,3],[9,null]]),
q('missing-day-gaps-list','Use a recursive CTE over day range min..max and find missing integers not present as visit days. Order by missing day.', `WITH RECURSIVE span(day,max) AS(SELECT MIN(day),MAX(day) FROM visits UNION ALL SELECT day+1,span.max FROM span WHERE day<span.max) SELECT day AS missing FROM span s WHERE NOT EXISTS(SELECT 1 FROM visits v WHERE v.day=s.day) ORDER BY missing;`, 'missing', [[3],[7],[8]]),
q('triple-streak-at-least-three-consecutive','Find days starting a run of at least 3 consecutive visit days, using LEAD with day offsets.', `SELECT day FROM (SELECT day,LEAD(day,1) OVER(ORDER BY day) AS d1,LEAD(day,2) OVER(ORDER BY day) AS d2 FROM visits) WHERE d1=day+1 AND d2=day+2 ORDER BY day;`, 'day', [[4]]),
q('island-identity-both-ends','Assign island numbers by day minus ROW_NUMBER, returning every visit with group id, ordered by day.', `SELECT day,day-ROW_NUMBER() OVER(ORDER BY day) AS island FROM visits ORDER BY day;`, 'day,island', [[1,0],[2,0],[4,1],[5,1],[6,1],[9,3]]),
q('largest-island-size','Collapse consecutive-day islands and report the largest island size. Use MAX of COUNT.', `WITH g AS(SELECT day,day-ROW_NUMBER() OVER(ORDER BY day) AS island FROM visits),c AS(SELECT island,COUNT(*) AS size FROM g GROUP BY island) SELECT MAX(size) AS largest FROM c;`, 'largest', [[3]]),
q('every-island-start-and-end','Return island start day,end day,and size ordered by start.', `WITH g AS(SELECT day,day-ROW_NUMBER() OVER(ORDER BY day) AS island FROM visits),agg AS(SELECT island,MIN(day) AS start_day,MAX(day) AS end_day,COUNT(*) AS size FROM g GROUP BY island) SELECT start_day,end_day,size FROM agg ORDER BY start_day;`, 'start_day,end_day,size', [[1,2,2],[4,6,3],[9,9,1]]),
q('battery-rising-flag','Flag each battery reading 1 if it strictly exceeds the preceding level, otherwise 0; the first row is 0. Order by id.', `SELECT id,CASE WHEN level>LAG(level) OVER(ORDER BY id) THEN 1 ELSE 0 END AS flag FROM battery ORDER BY id;`, 'id,flag', [[1,0],[2,0],[3,0],[4,0],[5,1],[6,0],[7,0],[8,1]]),
q('rising-streak-summed-groups','Find the longest nondecreasing contiguous run, counting the initial row. Equality continues a run; only a decrease starts another. Levels 50,50,55 and 54,54,70 form runs of length three.', `WITH f AS(SELECT id,CASE WHEN level>=LAG(level) OVER(ORDER BY id) THEN 0 ELSE 1 END AS new_run FROM battery),s AS(SELECT id,SUM(new_run) OVER(ORDER BY id ROWS UNBOUNDED PRECEDING) AS run FROM f),c AS(SELECT run,COUNT(*) AS size FROM s GROUP BY run) SELECT MAX(size) AS longest FROM c;`, 'longest', [[3]]),
q('longest-nonincreasing-run','Find the longest contiguous run where each battery level is less than or equal to the previous level; count initial row. Equality continues a run; an increase starts another.', `WITH f AS(SELECT id,CASE WHEN level<=LAG(level) OVER(ORDER BY id) THEN 0 ELSE 1 END AS new_run FROM battery),s AS(SELECT id,SUM(new_run) OVER(ORDER BY id ROWS UNBOUNDED PRECEDING) AS run FROM f),c AS(SELECT run,COUNT(*) AS size FROM s GROUP BY run) SELECT MAX(size) AS longest FROM c;`, 'longest', [[4]]),
q('adjacent-duplicate-compress','Return battery readings that differ from the immediately preceding reading, keeping the first reading. Order by id.', `SELECT id,level FROM (SELECT id,level,LAG(level) OVER(ORDER BY id) AS prev FROM battery) WHERE prev IS NULL OR level<>prev ORDER BY id;`, 'id,level', [[1,80],[2,60],[3,50],[5,55],[6,54],[8,70]])
]);

family('Deduplication keep policies and hygiene', `
CREATE TABLE raw(id INTEGER PRIMARY KEY,name TEXT,email TEXT,seen_at TEXT);
INSERT INTO raw VALUES(1,'Ada','ada@x.com','2024-01-01'),(2,'Bo','bo@x.com','2024-01-02'),(3,'ada','ada@x.com','2024-01-03'),(4,'Cy',NULL,'2024-01-04'),(5,'cy','CY@x.com','2024-01-05'),(6,'Dee','dee@x.com','2024-01-06'),(7,'dee','dee@x.com','2024-01-07');`, [
q('keep-first-seen-per-email','Keep the lowest-id row per normalized lowercase email; NULL emails are already distinct by id. Return id,email ordered by id.', `WITH r AS(SELECT *,ROW_NUMBER() OVER(PARTITION BY lower(email) ORDER BY id) AS n FROM raw) SELECT id,email FROM r WHERE n=1 ORDER BY id;`, 'id,email', [[1,'ada@x.com'],[2,'bo@x.com'],[4,null],[5,'CY@x.com'],[6,'dee@x.com']]),
q('keep-latest-seen-per-email','Keep only the latest seen_at row per normalized email, id as tie-break. Return id,email ordered by id.', `WITH r AS(SELECT *,ROW_NUMBER() OVER(PARTITION BY lower(email) ORDER BY seen_at DESC,id DESC) AS n FROM raw) SELECT id,email FROM r WHERE n=1 ORDER BY id;`, 'id,email', [[2,'bo@x.com'],[3,'ada@x.com'],[4,null],[5,'CY@x.com'],[7,'dee@x.com']]),
q('group-min-policy','Use GROUP BY email-min policy: one row per normalized email, showing its minimum id.', `SELECT lower(email) AS email,MIN(id) AS first_id FROM raw GROUP BY lower(email) ORDER BY email;`, 'email,first_id', [[null,4],['ada@x.com',1],['bo@x.com',2],['cy@x.com',5],['dee@x.com',6]]),
q('delete-duplicates-keep-min-id','Physically delete duplicate rows keeping the minimum id per normalized email, then return remaining id,email. Verify deletion, not just selection.', `DELETE FROM raw WHERE id NOT IN(SELECT MIN(id) FROM raw GROUP BY lower(email)); SELECT id,email FROM raw ORDER BY id;`, 'id,email', [[1,'ada@x.com'],[2,'bo@x.com'],[4,null],[5,'CY@x.com'],[6,'dee@x.com']]),
q('duplicate-emails-only','Return only normalized emails appearing more than once, plus their count; exclude NULL.', `SELECT lower(email) AS email,COUNT(*) AS copies FROM raw WHERE email IS NOT NULL GROUP BY lower(email) HAVING COUNT(*)>1 ORDER BY email;`, 'email,copies', [['ada@x.com',2],['dee@x.com',2]]),
q('exact-duplicate-pairs','Find exact duplicate (name,email) pairs including counts, ordered by email then name. Unlike case-normalized matching, Ada and ada are distinct.', `SELECT name,email,COUNT(*) AS copies FROM raw GROUP BY name,email HAVING COUNT(*)>1 ORDER BY email,name;`, 'name,email,copies', [['Bo','bo@x.com',2]], {seedExtra:`INSERT INTO raw VALUES(8,'Bo','bo@x.com','2024-01-08');`}),
q('keep-latest-per-normalized-name','Keep the most recent row per lowercase name, not per email; therefore Cy without email and cy with email compete. Return id,name,email ordered by id.', `WITH r AS(SELECT *,ROW_NUMBER() OVER(PARTITION BY lower(name) ORDER BY seen_at DESC,id DESC) AS n FROM raw) SELECT id,name,email FROM r WHERE n=1 ORDER BY id;`, 'id,name,email', [[2,'Bo','bo@x.com'],[3,'ada','ada@x.com'],[5,'cy','CY@x.com'],[7,'dee','dee@x.com']]),
q('dedup-projection-only','Return distinct (name,email) pairs sorted by name then email using default BINARY collation; the two identical Bo pairs collapse.', `SELECT DISTINCT name,email FROM raw ORDER BY name,email;`, 'name,email', [['Ada','ada@x.com'],['Bo','bo@x.com'],['Cy',null],['Dee','dee@x.com'],['ada','ada@x.com'],['cy','CY@x.com'],['dee','dee@x.com']], {seedExtra:`INSERT INTO raw VALUES(8,'Bo','bo@x.com','2024-01-08');`}),
q('delete-null-email-rows','Delete rows with NULL email and return remaining id,email.', `DELETE FROM raw WHERE email IS NULL; SELECT id,email FROM raw ORDER BY id;`, 'id,email', [[1,'ada@x.com'],[2,'bo@x.com'],[3,'ada@x.com'],[5,'CY@x.com'],[6,'dee@x.com'],[7,'dee@x.com']]),
q('dedup-count-before-after','Return duplicate_count (rows minus distinct normalized-email groups) and total_rows in one summary row. NULL group counts as one distinct email.', `SELECT COUNT(*)-(SELECT COUNT(*) FROM (SELECT lower(email) FROM raw GROUP BY lower(email))) AS duplicate_count,COUNT(*) AS total_rows FROM raw;`, 'duplicate_count,total_rows', [[2,7]])
]);

family('Parameterized queries with node sqlite bindings', `
CREATE TABLE products(id INTEGER PRIMARY KEY,name TEXT,category TEXT,price INTEGER);
INSERT INTO products VALUES(1,'Pen','office',3),(2,'Mug','home',8),(3,'Pad','office',12),(4,'Lamp','home',20),(5,'Rug','home',50);`, [
q('positional-parameters','Use positional ? binding for category and max price. The harness binds params after the SQL; return id,name ordered by id.', `SELECT id,name FROM products WHERE category=? AND price<=? ORDER BY id;`, 'id,name', [[1,'Pen']], {params:['office',5]}),
q('named-parameter-object','Use named $category binding for category office; return id,name,price ordered by id. node:sqlite receives an object, not interpolated SQL.', `SELECT id,name,price FROM products WHERE category=$category ORDER BY id;`, 'id,name,price', [[1,'Pen',3],[3,'Pad',12]], {params:[{'$category':'office'}]}),
q('bound-like-pattern','Use bound LIKE pattern, not literal interpolation, to match names starting with P. The percent is an intentional wildcard, not escaped. Return id,name.', `SELECT id,name FROM products WHERE name LIKE ? ORDER BY id;`, 'id,name', [[1,'Pen'],[3,'Pad']], {params:['P%']}),
q('limit-offset-parameterized-pagination','Return page 2 of home items sorted by price ascending, using bound offset. Page size is 1.', `SELECT id,name FROM products WHERE category=? ORDER BY price LIMIT ? OFFSET ?;`, 'id,name', [[4,'Lamp']], {params:['home',1,1]}),
q('parameterized-in-list-dynamic-placeholders','Match ids 1 and 3 using IN with one bound placeholder per id, built as ?,?. Return id,name ordered by id.', `SELECT id,name FROM products WHERE id IN (?,?) ORDER BY id;`, 'id,name', [[1,'Pen'],[3,'Pad']], {params:[1,3]}),
q('parameterized-aggregate-minimum-price','Return the minimum price for the bound category home.', `SELECT MIN(price) AS cheapest FROM products WHERE category=?;`, 'cheapest', [[8]], {params:['home']}),
q('parameterized-update-raise-price','Raise the price of product 2 by the bound amount 2 using a bound value, then return its id,price.', `UPDATE products SET price=price+? WHERE id=? RETURNING id,price;`, 'id,price', [[2,10]], {params:[2,2]}),
q('bound-quote-containing-value','Safely match a name containing an apostrophe using one bound ? value; do not interpolate or add SQL quoting to the placeholder. Return id,name.', `SELECT id,name FROM products WHERE name=? ORDER BY id;`, 'id,name', [[6,"O'Brien pen"]], {params:["O'Brien pen"],seedExtra:`INSERT INTO products VALUES(6,'O''Brien pen','office',9);`}),
q('parameterized-between-range','Return products with price between bound low 3 and high 12 inclusive, ordered by price.', `SELECT id,name,price FROM products WHERE price BETWEEN ? AND ? ORDER BY price,id;`, 'id,name,price', [[1,'Pen',3],[2,'Mug',8],[3,'Pad',12]], {params:[3,12]}),
q('parameterized-conditional-aggregate','Compute sum of prices over the bound category home, and the number of those items costing more than bound 10. Both predicates use bound values.', `SELECT SUM(price) AS total,SUM(CASE WHEN price>? THEN 1 ELSE 0 END) AS expensive FROM products WHERE category=?;`, 'total,expensive', [[78,2]], {params:[10,'home']})
]);

family('EXPLAIN QUERY PLAN and index aware queries', `
CREATE TABLE orders2(id INTEGER PRIMARY KEY,customer_id INTEGER NOT NULL,status TEXT NOT NULL);
CREATE TABLE lines2(order_id INTEGER NOT NULL,product_id INTEGER);
INSERT INTO orders2 VALUES(1,10,'paid'),(2,11,'pending'),(3,10,'paid');
INSERT INTO lines2 VALUES(1,100),(1,101),(3,100);`, [
q('rowid-lookup-uses-index','Confirm point lookup by rowid primary key uses Search orders2 USING INTEGER PRIMARY KEY (rowid=?) rather than a SCAN.', `EXPLAIN QUERY PLAN SELECT * FROM orders2 WHERE id=1;`, 'detail', [['SEARCH orders2 USING INTEGER PRIMARY KEY (rowid=?)']]),
q('scan-without-index','For this seeded table with no status index, explain SELECT * FROM orders2 WHERE status=paid (quote paid as a SQL text literal). Observe the table SCAN chosen here; this is not a claim that every unindexed predicate always forces a full scan.', `EXPLAIN QUERY PLAN SELECT * FROM orders2 WHERE status='paid';`, 'detail', [['SCAN orders2']]),
q('index-creation-changes-plan','Create a status index, then verify the same status query now uses the index via SEARCH ... USING INDEX (two-step policy allowed).', `CREATE INDEX orders2_status ON orders2(status); EXPLAIN QUERY PLAN SELECT * FROM orders2 WHERE status='paid';`, 'detail', [['SEARCH orders2 USING INDEX orders2_status (status=?)']]),
q('covering-index-avoids-table-lookup','Create a covering index on (status,customer_id), select only those columns filtered by status, and assert a SEARCH plan naming the index without a separate table scan step.', `CREATE INDEX orders2_cover ON orders2(status,customer_id); EXPLAIN QUERY PLAN SELECT customer_id FROM orders2 WHERE status='paid';`, 'detail', [['SEARCH orders2 USING COVERING INDEX orders2_cover (status=?)']]),
q('join-order-inner-outer-loop','SQLite-specific plan experiment: create status and line-order indexes, use CROSS JOIN to hold orders as the outer loop, and INDEXED BY to require named indexes. Explain SELECT o.id,l.product_id where o.status=paid and l.order_id=o.id. Inspect two SEARCH nodes; these hints are for teaching, not general tuning advice.', `CREATE INDEX orders2_status ON orders2(status); CREATE INDEX lines2_order ON lines2(order_id); EXPLAIN QUERY PLAN SELECT o.id,l.product_id FROM orders2 AS o INDEXED BY orders2_status CROSS JOIN lines2 AS l INDEXED BY lines2_order WHERE o.status='paid' AND l.order_id=o.id;`, 'detail', [['SEARCH o USING COVERING INDEX orders2_status (status=?)'],['SEARCH l USING INDEX lines2_order (order_id=?)']]),
q('unique-index-enforces-uniqueness','Create a UNIQUE index on lines2(order_id,product_id); insert the distinct pair (2,100), then return all four rows ordered by order_id,product_id. The grader subsequently checks that inserting duplicate (1,100) fails.', `CREATE UNIQUE INDEX lines2_pair ON lines2(order_id,product_id); INSERT INTO lines2 VALUES(2,100); SELECT order_id,product_id FROM lines2 ORDER BY order_id,product_id;`, 'order_id,product_id', [[1,100],[1,101],[2,100],[3,100]], {probes:[{sql:`INSERT INTO lines2 VALUES(1,100)`,reject:'UNIQUE'}]}),
q('auto-index-for-unique-constraint','Create t2(x TEXT UNIQUE) and explain SELECT * FROM t2 WHERE x=\'a\'. Observe the persistent index SQLite creates to enforce UNIQUE (sqlite_autoindex_t2_1), rather than a table scan. This constraint index is not a transient query-time automatic index.', `CREATE TABLE t2(x TEXT UNIQUE); EXPLAIN QUERY PLAN SELECT * FROM t2 WHERE x='a';`, 'detail', [['SEARCH t2 USING COVERING INDEX sqlite_autoindex_t2_1 (x=?)']]),
q('uncorrelated-in-list-plan','SQLite-specific, pinned to this pack runtime: explain the uncorrelated IN subquery selecting orders whose customer_id appears on paid orders. Inspect outer scan, LIST SUBQUERY, inner scan, and bloom-filter construction in their returned order.', `EXPLAIN QUERY PLAN SELECT * FROM orders2 WHERE customer_id IN(SELECT customer_id FROM orders2 WHERE status='paid');`, 'detail', [['SCAN orders2'],['LIST SUBQUERY 1'],['SCAN orders2'],['CREATE BLOOM FILTER']]),
q('order-by-uses-index-avoids-sort','Create index on (status,customer_id), select customer_id where status=pending ordered by customer_id, and confirm plan uses the index and contains no USE TEMP B-TREE FOR ORDER BY step.', `CREATE INDEX orders2_status_cust ON orders2(status,customer_id); EXPLAIN QUERY PLAN SELECT customer_id FROM orders2 WHERE status='pending' ORDER BY customer_id;`, 'detail', [['SEARCH orders2 USING COVERING INDEX orders2_status_cust (status=?)']]),
q('temporary-btree-for-group-by','Confirm a GROUP BY on unindexed lines2.product_id uses a TEMP B-TREE FOR GROUP BY step in its plan.', `EXPLAIN QUERY PLAN SELECT product_id,COUNT(*) FROM lines2 GROUP BY product_id;`, 'detail', [['SCAN lines2'],['USE TEMP B-TREE FOR GROUP BY']])
]);

// The authoring gate runs before any target files are created.
assert.equal(families.length,20);
const semanticKeys = new Set();
const all = [];
for (const f of families) for (const [i,d] of f.definitions.entries()) {
  const key=f.name+'|'+d.semanticKey;
  assert.ok(!semanticKeys.has(key),'Duplicate family|semanticKey '+key);semanticKeys.add(key);
  const id='Q'+String(all.length+1).padStart(3,'0');
  all.push({...d,id,family:f.name,scenario:i+1,seed:f.seed+(d.seedExtra||'')});
}
assert.equal(all.length,200);
const runtime = `'use strict';\nconst assert=require('node:assert/strict');\nconst {DatabaseSync}=require('node:sqlite');\n${splitSQL.toString()}\n${execute.toString()}\n${checkProbes.toString()}\nmodule.exports=function grade(sql,spec){\n  const db=new DatabaseSync(':memory:');let phase='seed';\n  try{\n    db.exec('PRAGMA foreign_keys=ON;');db.exec(spec.seed);\n    phase='execute';const actual=execute(db,sql,spec.params);\n    phase='assert';assert.deepEqual(actual,spec.expected,'Exact rows/order do not match expected result');\n    phase='integrity';if(spec.probes)checkProbes(db,spec.probes);\n    return {rows:actual.length};\n  }catch(e){e.phase=phase;throw e;}finally{db.close();}\n};\n`;
const verify = String.raw`'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
let id,starters=false,inventory=false;
function usage(message){console.error(message+'\nUsage: node verify.cjs [--inventory | [--starters] [--id=Q001 | --id=1]]');process.exit(2);}
try {
  const args=process.argv.slice(2),seen=new Set();
  for(let i=0;i<args.length;i++){
    const a=args[i];
    if(a==='--starters'||a==='--inventory'){
      if(seen.has(a))throw Error('Duplicate option '+a);seen.add(a);
      if(a==='--starters')starters=true;else inventory=true;
    }else if(a==='--id'||a.startsWith('--id=')){
      if(id!==undefined)throw Error('Duplicate id');
      const raw=a==='--id'?args[++i]:a.slice(5);
      if(!/^(?:Q\d{3}|\d+)$/.test(raw||''))throw Error('Invalid id');
      const n=Number(raw.replace(/^Q/,''));if(n<1||n>200||!Number.isSafeInteger(n))throw Error('Id out of range');
      id='Q'+String(n).padStart(3,'0');
    }else throw Error('Unknown option '+a);
  }
  if(inventory&&(starters||id!==undefined))throw Error('--inventory cannot combine with grading flags');
}catch(e){usage(e.message);}
let manifest;
try {
  manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'manifest.json'),'utf8'));
  assert.equal(manifest.length,200);assert.equal(new Set(manifest.map(r=>r.id)).size,200);
  assert.equal(new Set(manifest.map(r=>r.family)).size,20);
  const seen=new Set(),counts=new Map();
  for(const [i,r] of manifest.entries()){
    assert.equal(r.id,'Q'+String(i+1).padStart(3,'0'));assert.equal(r.scenario,i%10+1);assert.equal(r.tech,'sql');
    assert.ok(r.variant&&r.semanticKey);assert.ok(!seen.has(r.family+'|'+r.semanticKey));seen.add(r.family+'|'+r.semanticKey);
    counts.set(r.family,(counts.get(r.family)||0)+1);
    for(const key of ['prompt','starter','solution','test']){
      assert.equal(typeof r[key],'string');assert.ok(!path.isAbsolute(r[key])&&!r[key].split(/[\\/]/).includes('..'));
      assert.ok(fs.statSync(path.join(__dirname,r[key])).isFile(),r.id+' missing '+key);
    }
    assert.ok(fs.readFileSync(path.join(__dirname,r.prompt),'utf8').includes(r.id));
  }
  for(const count of counts.values())assert.equal(count,10);
}catch(e){usage('Inventory/manifest error: '+e.message);}
if(inventory){console.log('Inventory: 200 prompts, 200 starters, 200 solutions, 200 shared tests; Q001..Q200; 20 families; no database opened.');process.exit(0);}
const mode=starters?'starter':'solution',entries=id?manifest.filter(r=>r.id===id):manifest,results=[];
for(const row of entries){let phase='load';try{
  const source=fs.readFileSync(path.join(__dirname,row[mode]),'utf8');
  const test=require(path.join(__dirname,row.test));phase='test';test(source);
  results.push({id:row.id,family:row.family,passed:true,phase:'complete',errorType:null,error:null});
  console.log('PASS '+row.id+' '+row.family+' / scenario '+row.scenario+' / '+row.variant);
}catch(e){phase=e.phase||phase;
  results.push({id:row.id,family:row.family,passed:false,phase,errorType:e.name||'Error',error:e.message});
  console.error('FAIL '+row.id+' '+phase+' '+(e.name||'Error')+' '+e.message.slice(0,180).replace(/\n/g,' '));
}}
const passed=results.filter(r=>r.passed).length,failed=results.length-passed;
const report={track:'sql-200',mode,groups:results.length,passed,failed,results};
fs.writeFileSync(path.join(__dirname,'verification-'+mode+(id?'-'+id:'')+'.json'),JSON.stringify(report,null,2)+'\n');
console.log(mode+' SQL groups: '+passed+' passed, '+failed+' failed.');
process.exitCode=failed?1:0;
`;
const files = new Map();
const add=(name,content)=>{assert.ok(!files.has(name));files.set(name,content);};
const manifest=all.map(d=>({id:d.id,tech:'sql',family:d.family,scenario:d.scenario,variant:d.variant,semanticKey:d.semanticKey,title:`${d.family}, scenario ${d.scenario}: ${d.variant}`,prompt:`prompts/${d.id}.txt`,starter:`starters/${d.id}.sql`,solution:`solutions/${d.id}.sql`,test:`tests/${d.id}.cjs`}));
add('runtime.cjs',runtime);add('verify.cjs',verify);add('manifest.json',JSON.stringify(manifest,null,2)+'\n');
for(const d of all){
  const spec={seed:d.seed,expected:d.expected};
  if(d.params)spec.params=d.params;if(d.probes)spec.probes=d.probes;
  const example=JSON.stringify(d.expected[0]);
  const shape=Object.keys(d.expected[0]).join(', ');
  add(`prompts/${d.id}.txt`,`${d.id} — family ${d.family}, scenario ${d.scenario}: ${d.variant}\n\nTask\n${d.task}\n\nDialect: SQLite, executed with Node node:sqlite DatabaseSync. SQLite date/string functions, dynamic typing, rowid/INTEGER PRIMARY KEY, booleans-as-integers, PRAGMAs and query-plan text are SQLite-specific, not portable SQL promises.\n\nSeed schema and data (a fresh in-memory database for every run; foreign_keys=ON)\n${d.seed.trim()}\n\n${d.params?'Bindings supplied by the test using node:sqlite preparedStatement.all(...params): '+JSON.stringify(d.params)+'\nWrite placeholders in SQL; do not interpolate these values. For a named-binding object, that object is passed as the first all() argument.\n\n':''}Concrete example\nWith the exact seed above, the first result row is ${example}.\n\nExpected shape\nColumns (exact aliases): ${shape}. ${d.expected.length} row(s); exact order below is graded. NULL is JSON null; SQLite numeric results become JavaScript numbers.\n${JSON.stringify(d.expected,null,2)}\n\n${d.probes?'Integrity checks after the result assertion (these exercise constraints/state, not helper solution SQL):\n'+JSON.stringify(d.probes,null,2)+'\n\n':''}Submission\nEdit starters/${d.id}.sql. Use one query or a small semicolon-separated sequence; the final statement must produce the expected result. Earlier statements may mutate only this disposable database. The same test and seed grade starter and reference. Blank SQL executes no statements and returns [], which fails the nonempty expected rows.\n${d.expected[0].detail?'EXPLAIN QUERY PLAN mode: return the native EQP rows. The runner compares only their detail strings in order, ignoring numeric node IDs/parent/estimates. Text expectations target the bundled SQLite version documented in GUIDE.txt.\n':''}Run: node sql-200/verify.cjs --starters --id=${d.id}\nReference: node sql-200/verify.cjs --id=${d.id}\n`);
  add(`starters/${d.id}.sql`,'-- TODO: write your SQL here');
  add(`solutions/${d.id}.sql`,d.sql.trim()+'\n');
  add(`tests/${d.id}.cjs`,`'use strict';\n// One shared test for starter and reference; the candidate SQL is the only difference.\nconst grade=require('../runtime.cjs');\nconst spec=${JSON.stringify(spec,null,2)};\nmodule.exports=sql=>grade(sql,spec);\n`);
}
const {DatabaseSync}=require('node:sqlite');const versionDb=new DatabaseSync(':memory:');
const sqliteVersion=versionDb.prepare('SELECT sqlite_version() AS version').get().version;versionDb.close();
add('GUIDE.txt',`SQL-200 — 20 related scenario families, 10 scenarios per family\n\nPrerequisite: Node v22.16.0 with built-in node:sqlite DatabaseSync (verified).\nAuthoring runtime SQLite: ${sqliteVersion}. No sqlite3 CLI, packages, network, or services.\nExperimentalWarning from Node is informational.\n\nFrom unionboot:\n  node sql-200/verify.cjs --inventory\n  node sql-200/verify.cjs\n  node sql-200/verify.cjs --id=Q001\n  node sql-200/verify.cjs --id=1\n  node sql-200/verify.cjs --starters --id=Q001\n  node sql-200/verify.cjs --starters\n\nInventory checks files/manifest only and never loads node:sqlite or opens a DB.\nDefault mode grades all reference solutions; --starters grades your work.\nExit codes: 0 all selected groups pass; 1 any grading failure; 2 bad CLI or manifest/inventory parse errors. SQL syntax/runtime errors are grading failures (1), not CLI parse errors.\nReports: verification-solution.json / verification-starter.json; per-ID runs use verification-solution-Q001.json etc. Reports include groups,passed,failed and per-id phase/errorType/error.\n\nWorkflow: read prompts/Qxxx.txt, edit starters/Qxxx.sql, run one starter group.\nEach starter initially contains exactly -- TODO: write your SQL here.\nNo hidden helper SQL completes a blank. Every expected result has at least one row; blanks return [] and fail exact-row assertions. SQL errors including no-such-table/column always fail.\n\nEach run opens its own fresh :memory: DB, enables foreign keys, seeds schema and data, runs submitted SQL, and compares exact final result rows. Constraints and some mutation tasks also inspect stored state. Identical tests grade either source. Tests are deterministic examples, not proof against adversarial hardcoding; do not replace queries with literal answers.\nThe script runner supports simple semicolon-separated statements with quoted strings/identifiers and comments. CREATE TRIGGER BEGIN...END bodies and sqlite shell dot commands are intentionally outside this pack. Only the final statement returns graded rows. Binding tasks bind fixed values to the final prepared statement through node:sqlite; no SQL interpolation.\n\nSQLite-specific caveats\n- INTEGER PRIMARY KEY is a rowid alias; SQLite has dynamic typing unless STRICT is used.\n- Booleans are represented with integers/NULL; date functions operate on supported text/numeric encodings.\n- Built-in lower/NOCASE are ASCII-oriented without ICU. Fixed offsets are not time zones.\n- RETURNING multi-row order is unspecified; the RETURNING scenario changes one row.\n- EXPLAIN QUERY PLAN scenarios compare detail text only and target SQLite ${sqliteVersion}; optimizer text can change on another Node/SQLite version. These are educational plan experiments, not cross-version performance tests.\n- Transaction scenarios use one connection and check final state, not concurrency/isolation under competing writers.\n\nFamilies\n${families.map((f,i)=>String(i+1).padStart(2,'0')+'. '+f.name+' (Q'+String(i*10+1).padStart(3,'0')+'..Q'+String(i*10+10).padStart(3,'0')+')').join('\n')}\n\nAuthoring\n../build-sql-200.cjs owns family definitions and emits this pack. It first executes all 200 references against manually specified expected rows and enforces unique family|semanticKey. It refuses any existing sql-200 path and writes new files exclusively. Do not delete your work to regenerate. Maintainers must patch the generator and only the specifically affected generated files with old-content comparison; never replace learner starters.\n`);
// Syntax-check all emitted JavaScript in memory before first write.
const vm=require('node:vm');for(const [name,text] of files)if(name.endsWith('.cjs'))new vm.Script(text,{filename:name});
fs.mkdirSync(target);for(const dir of ['prompts','starters','solutions','tests'])fs.mkdirSync(path.join(target,dir));
for(const [name,text] of files)fs.writeFileSync(path.join(target,name),text,{flag:'wx'});
console.log('Generated SQL-200: 200 validated references; 20 unique families; '+files.size+' files; SQLite '+sqliteVersion+'.');





