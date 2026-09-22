-- Why this works:
-- An average order value is an average of order totals, so the aggregation
-- happens twice: the inner query collapses lines to one row per paid order,
-- the outer one averages those totals.
-- Averaging l.qty*l.price directly would average the four paid lines and give
-- 5.25 instead of the expected 10.5, the mean of 14 and 7.
-- AVG returns a real even over integer inputs, and ROUND(...,1) trims it to
-- the one decimal place the prompt asks for.
SELECT ROUND(AVG(total), 1) AS average_order
FROM (
       SELECT o.id,
              SUM(l.qty * l.price) AS total
       FROM orders o
       JOIN lines l ON l.order_id = o.id
       WHERE o.status = 'paid'
       GROUP BY o.id
     );
