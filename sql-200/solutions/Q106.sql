SELECT id,trim(name) AS name FROM contacts WHERE length(trim(name))=3 ORDER BY id;
