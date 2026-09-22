SELECT tenant,id,title FROM projects WHERE (tenant,id)>(1,1) ORDER BY tenant,id LIMIT 2;
