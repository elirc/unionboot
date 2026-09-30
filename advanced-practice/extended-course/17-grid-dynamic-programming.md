# 17. Grid paths and the meaning of a rolling row

Read [unique paths](../../52-unique-paths.js) and uniquePaths in [the reference module](../../solutions/round2-remaining.cjs). The robot may move only right or down through an unobstructed rectangular grid. Use positive integer dimensions for the baseline exercise. Obstacles, diagonal moves, invalid dimensions, and exact counts beyond Number's range are extensions requiring new contracts.

## Count paths by their final move

Let P(r,c) be the number of paths reaching cell r,c from the upper-left cell. Every path to an interior cell arrives either from the cell above or the cell to its left. These classes are disjoint because their final moves differ. Adding their counts therefore counts every path exactly once. The top row and left column each have one route to every cell: continue along that boundary. The one-cell grid has one empty-move route, matching the supplied sample.

The recurrence is not a shortest-distance calculation. All permitted routes to the same destination use the same number of right and down moves, but they differ in ordering. P counts those orderings. A visited set that accepts each cell only once would be useful for reachability yet would erase multiple ways to reach the same cell. The state must preserve counts, not just discovery.

A two-dimensional table is the clearest first implementation. Fill boundary values, then fill interior cells after their top and left dependencies are available. Row-major order works because the previous row is complete and the current row's left neighbor has already been calculated. Any different traversal order must still respect those dependencies.

## Worked trace: compressing three rows into one

For a three-row, four-column grid, the top row of counts is 1, 1, 1, 1. The next row becomes 1, 2, 3, 4. The final row becomes 1, 3, 6, 10. The answer is ten, the count at the lower-right cell.

A rolling array initially contains the top row. During the next row's left-to-right scan, row[c] still holds the count from above before it is updated, while row[c-1] already holds the current row's left count. Adding those two values gives the new cell. This mixed old/new interpretation is the entire compression proof. Calling the array simply current row before explaining that timing hides the reason the algorithm works.

At the final row's column two, the old stored value is three from the row above, and the updated left value is three from the current row. Their sum is six. At column three, the old value is four and updated left is six, giving ten. A right-to-left scan would combine old-row neighbors and compute a different recurrence. Compression makes update order part of the algorithm.

## Laboratory: compare tables and enumeration

Implement a full table and a rolling-row version in scratch. Compare every final result for dimensions one through five in each direction. Record twenty-five comparisons, including single-row, single-column, and one-cell boundaries. Keep the full table available for a worked trace so a mismatch can be localized to the first incorrect cell rather than only the final answer.

Build an independent recursive path enumerator for small grids. Its state is the current coordinates, and it branches only to legal right and down moves. Reaching the destination contributes one; a move outside the grid contributes none. This grows quickly, so retain the small bounds. It follows actual move sequences instead of reusing the rolling recurrence's storage, providing a useful independent check.

The unobstructed result is symmetric when dimensions are swapped. Use that as an additional property, not the sole oracle. A function that always returns one is symmetric but wrong for interior grids. Combining a relation between outputs with independently known small values is stronger than either alone.

## Debugging case: initialization counts impossible starts

Suppose you extend the grid to include blocked cells but keep every rolling entry initialized to one. A blocked cell on the top row should prevent paths from passing through it, yet the unchanged initialization gives later top-row cells a route that crosses the obstacle. The unobstructed boundary rule cannot be copied unchanged into the new problem.

For an obstacle extension, initialize a rolling array to zero with one at the starting position if the start is open. Scan every cell in dependency order. A blocked cell resets its count to zero; an open cell combines available predecessor counts. Treat the starting cell carefully so it retains its one empty-prefix route. Specify whether dimensions and blocked coordinates are validated, rather than relying on accidental array behavior.

This extension illustrates when a base case changes while the local recurrence remains similar. Re-derive the meaning of the state after changing the domain. A familiar loop shape is not evidence that its initialization still represents valid paths.

## Graded exercises

**C17-A:** Fill the three-by-four table and explain old-above versus new-left values in the rolling array. Five points require the correct ten-path result and a timing invariant.

**C17-B:** Compare full-table, rolling, and enumeration implementations on the twenty-five small dimension pairs. Five points require explicit bounds and at least one interior trace.

**C17-C:** Demonstrate a wrong right-to-left rolling update with a minimal nontrivial grid. Four points require identifying the stale dependency rather than merely reporting a wrong total.

**C17-D:** Add blocked cells in a separate implementation and test blocked start, blocked destination, and a blocked top-row cell. Four points require a newly derived initialization and a clear extension label.

## Hints, before the review

For C17-A, label each array slot with the row it currently represents during the scan. For C17-C, two rows and three columns are enough to distinguish directions. For C17-D, zero means no path reaches that cell, so it can be the correct transition result rather than an error. Read [the review](reviews/17-grid-dynamic-programming.md) after writing the counted object in one sentence.
