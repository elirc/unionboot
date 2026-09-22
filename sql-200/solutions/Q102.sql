SELECT id,lower(substr(email,instr(email,'@')+1)) AS domain FROM contacts WHERE email IS NOT NULL ORDER BY id;
