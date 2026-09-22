SELECT p.tenant,p.id,COUNT(t.id) AS tasks FROM projects p LEFT JOIN tasks t ON t.tenant=p.tenant AND t.project_id=p.id GROUP BY p.tenant,p.id ORDER BY p.tenant,p.id;
