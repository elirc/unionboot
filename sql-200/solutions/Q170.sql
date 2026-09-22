SELECT id,level FROM (SELECT id,level,LAG(level) OVER(ORDER BY id) AS prev FROM battery) WHERE prev IS NULL OR level<>prev ORDER BY id;
