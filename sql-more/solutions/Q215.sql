SELECT id FROM baskets b WHERE EXISTS(SELECT 1 FROM json_each(b.body,'$.tags') WHERE value='red') ORDER BY id;
