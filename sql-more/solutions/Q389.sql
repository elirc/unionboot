SELECT depth,COUNT(*) AS nodes FROM closure WHERE ancestor=1 AND depth>0 GROUP BY depth ORDER BY depth;
