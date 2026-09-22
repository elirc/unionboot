SELECT id,trim(name)||' <'||COALESCE(lower(email),'no-email')||'>' AS display FROM contacts ORDER BY id;
