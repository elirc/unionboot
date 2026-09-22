CREATE TABLE calc(qty INTEGER,price INTEGER,v INTEGER AS(qty*price) VIRTUAL,s INTEGER AS(qty*price) STORED);SELECT name,hidden FROM pragma_table_xinfo('calc') WHERE hidden>0 ORDER BY cid;
