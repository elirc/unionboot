-- Why this works:
-- A trial balance is one control row for the whole ledger, so there is no
-- GROUP BY at all. An aggregate query with no grouping collapses every row
-- of the table into a single result row.
-- The three aggregates read the same six lines: 150 debits, 145 credits and
-- a net of 5, which is transaction 3's discrepancy surfacing at the top
-- level.
-- A nonzero discrepancy here means at least one transaction is unbalanced,
-- but it does not say which; Q312 is the query that attributes it.
-- One row needs no ORDER BY.
SELECT SUM(debit) AS debits,
       SUM(credit) AS credits,
       SUM(debit - credit) AS discrepancy
FROM ledger;
