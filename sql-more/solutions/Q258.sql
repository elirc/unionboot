-- Why this works:
-- This is the same column-filter shape aimed at the other column, which is
-- what makes the seed worth reading twice.
-- red appears in the title of document 1 and in the body of document 3, so
-- restricting the search to body leaves only document 3.
-- Without the filter the query would return both documents, which is how
-- the pair of scenarios demonstrates column scoping.
SELECT rowid
FROM articles
WHERE articles MATCH 'body : red'
ORDER BY rowid;
