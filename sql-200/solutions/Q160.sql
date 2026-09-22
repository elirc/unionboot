UPDATE tasks SET points=points+7 WHERE id=3 RETURNING id,points;
