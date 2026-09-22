SELECT b.id,t.fullkey,t.atom AS qty FROM baskets b,json_tree(b.body) t WHERE t.key='qty' AND t.type='integer' ORDER BY b.id,t.fullkey;
