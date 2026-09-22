SELECT lower(substr(email,instr(email,'@')+1)) AS domain,COUNT(*) AS contacts FROM contacts WHERE email IS NOT NULL GROUP BY domain ORDER BY domain;
