-- Why this works:
-- The reporting unit changes from the transaction to the account, so the
-- grouping column changes and the HAVING filter disappears: every account is
-- reported, balanced or not.
-- debit minus credit is the debit-normal convention the prompt states. Under
-- it an account that mostly receives credits, such as income, ends up
-- negative, and -115 is the correct answer rather than a sign error.
-- cash nets 100 - 30 + 20 = 90; expense is 30; income is -(100 + 15).
-- Unbalanced transaction 3 is included here; Q314 is the variant that
-- excludes it.
SELECT account,
       SUM(debit - credit) AS balance
FROM ledger
GROUP BY account
ORDER BY account;
