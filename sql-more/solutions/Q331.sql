SELECT t.tenant,t.id,p.title AS project FROM tasks t JOIN projects p ON p.tenant=t.tenant AND p.id=t.project_id ORDER BY t.tenant,t.id;
