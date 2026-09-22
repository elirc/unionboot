SELECT tenant,id,title FROM projects WHERE (tenant,id) IN((1,2),(2,1)) ORDER BY tenant,id;
