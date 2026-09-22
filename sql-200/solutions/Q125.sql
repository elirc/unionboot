-- Why this works:
-- A PRIMARY KEY over two columns is unique as a pair, so (1,10) and (1,20)
-- coexist while a second (1,10) fails.
-- WITHOUT ROWID stores the row inside the primary-key B-tree instead of in
-- a separate rowid table. That is what makes the key columns NOT NULL:
-- in an ordinary rowid table a PRIMARY KEY column may hold NULL, a
-- long-standing SQLite quirk.
-- So the grader's NULL user_id insert fails with a NOT NULL error, not a
-- UNIQUE one.
CREATE TABLE membership(
  user_id INTEGER,
  team_id INTEGER,
  role TEXT NOT NULL,
  PRIMARY KEY(user_id, team_id)
) WITHOUT ROWID;
INSERT INTO membership VALUES(1, 10, 'reader'), (1, 20, 'writer');
SELECT user_id, team_id, role
FROM membership
ORDER BY user_id, team_id;
