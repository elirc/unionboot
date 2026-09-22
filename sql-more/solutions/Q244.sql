CREATE INDEX normalized ON users(lower(email));SELECT seqno,cid,name FROM pragma_index_xinfo('normalized') WHERE key=1 ORDER BY seqno;
