SELECT team,name,ROW_NUMBER() OVER(PARTITION BY team ORDER BY score DESC,id) AS place FROM scores ORDER BY team,place;
