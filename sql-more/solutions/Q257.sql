-- Why this works:
-- A column filter is part of the query string, not of the select list, so
-- narrowing the search means writing the column name inside the MATCH
-- argument.
-- title : blue restricts the token lookup to the title column, so document 2
-- qualifies and document 4, whose blue is in the body, does not.
-- Selecting fewer columns would not restrict the search; the filter has to
-- be in the query.
-- The spaces around the colon are optional in FTS5 syntax.
SELECT rowid
FROM articles
WHERE articles MATCH 'title : blue'
ORDER BY rowid;
