SELECT b.id,j.value AS tag FROM baskets b LEFT JOIN json_each(b.body,'$.tags') j ON true ORDER BY b.id,j.key;
