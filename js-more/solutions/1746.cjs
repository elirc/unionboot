// 1746 Weighted interval scheduling / scenario 8 — gap=3; tie=more
// Prompt: ../prompts/1746.txt
'use strict';
const cfg={"gap":3,"tie":"more"};
// Why this works:
// Classic weighted interval scheduling. Sorting a copy of the jobs by end time
// makes "the jobs that could precede job i" a prefix of the array, so a binary
// search can find where that prefix stops. The copy matters twice: sort is
// in-place, and the caller's array must come back unchanged.
// best[i] is the best schedule using only the first i sorted jobs, stored as a
// whole answer {value, ids} rather than just a number, because the tie-break
// compares the selected id sequence and not only the total.
// For job i the binary search finds lo, the count of earlier jobs that finish
// early enough that job i may follow: jobs[mid].end + cfg.gap <= jobs[i].start.
// best[lo] is therefore the best schedule compatible with taking job i, and the
// step is a choice between skipping job i (best[i]) and taking it.
// better() encodes the whole policy: higher value wins; on equal value cfg.tie
// picks fewer or more jobs; on equal length the lexicographically smaller
// JSON-serialized id sequence wins, exactly as the prompt words it.
// ids are built with [...prior.ids, job.id], so each candidate owns its array
// and no earlier entry of best is ever mutated.
function weightedIntervals(input) {
  const jobs = [...input].sort((left, right) => left.end - right.end || (left.id < right.id ? -1 : 1));
  const best = [{value: 0, ids: []}];
  const better = (left, right) => {
    if (left.value !== right.value) return left.value > right.value ? left : right;
    if (left.ids.length !== right.ids.length) {
      const leftWins = cfg.tie === 'fewer'
        ? left.ids.length < right.ids.length
        : left.ids.length > right.ids.length;
      return leftWins ? left : right;
    }
    return JSON.stringify(left.ids) < JSON.stringify(right.ids) ? left : right;
  };
  for (let i = 0; i < jobs.length; i++) {
    // Binary search for the number of sorted jobs that job i may follow.
    let lo = 0;
    let hi = i;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (jobs[mid].end + cfg.gap <= jobs[i].start) lo = mid + 1;
      else hi = mid;
    }
    const prior = best[lo];
    const taking = {value: prior.value + jobs[i].value, ids: [...prior.ids, jobs[i].id]};
    const skipping = best[i];
    best.push(better(skipping, taking));
  }
  return best.at(-1);
}
module.exports=weightedIntervals;
