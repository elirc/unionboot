UPDATE articles SET body='quick fox' WHERE rowid=4;SELECT rowid FROM articles WHERE articles MATCH 'fox' ORDER BY rowid;
