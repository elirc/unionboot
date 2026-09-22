SELECT rowid,highlight(articles,0,'[',']') AS marked FROM articles WHERE articles MATCH 'fox' ORDER BY rowid;
