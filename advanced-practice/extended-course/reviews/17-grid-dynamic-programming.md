# Review 17. Grid paths and rolling state

Return to [the questions](../17-grid-dynamic-programming.md). The recurrence counts paths to a cell, while the storage invariant explains when each predecessor value is available.

## C17-A: table and compression

The three rows are 1,1,1,1; then 1,2,3,4; then 1,3,6,10. Every interior value sums the value above and the current row's value to the left. In a rolling row, the current slot still represents above before assignment, while the previous slot already represents left. Left-to-right update order maintains this mixed interpretation correctly.

A complete baseline strategy initializes an array of n ones for the top row. For each remaining row, visit columns one through n minus one and add the prior slot into the current slot. Return the last slot. The first column stays one because only downward movement reaches it. One row or one column therefore returns one without special traversal machinery.

## C17-B: bounded independent evidence

Compare the table, rolling row, and explicit path enumeration for every positive dimension pair from one through five. There are twenty-five pairs. The one-cell result is one, two-by-two is two, three-by-two is three, and three-by-four is ten. Transposing dimensions preserves the count in this unobstructed model, but that symmetry alone cannot establish correctness.

Enumeration follows legal move sequences and counts arrivals, while DP combines predecessor counts. Their different structures reduce shared implementation mistakes. Keep the enumeration small and label the bound. A larger table may be computationally easy but eventually exceed exact Number integer representation, which is a separate concern from recurrence correctness.

## C17-C: a reversed scan

For two rows and three columns, the initial row is 1,1,1. A wrong right-to-left update first makes the last slot two using the still-old middle value, then makes the middle slot two. It returns two instead of the correct three. The final slot needed the updated current-row middle value, which was not available yet. This is a dependency-order defect, not a missing arithmetic operation.

## C17-D: obstacles change initialization

Initialize counts to zero with one at the start, provided the start is open. Visit cells in row-major order. A blocked cell resets its slot to zero. An open non-first-column cell adds the current left slot to its retained above count. A blocked start yields no paths, and a blocked destination yields zero at the final position. A blocked top-row cell eliminates paths continuing along that row until another route can reach later cells from below in subsequent rows.

Keep this implementation separate from the obstacle-free reference. Its tests must state obstacle coordinates, dimension validity, and whether the start is included in the scan. A copied initialization of all ones would assert nonexistent routes through a top-row obstacle.

## Transfer review

Allowing diagonal moves adds a third predecessor, including a value that a one-row implementation might overwrite before it is used. Preserve that old diagonal value in a temporary or use a fuller table. Re-derive dependencies before compressing storage; a familiar array shape does not automatically contain enough historical information for a changed recurrence.
