// 1846 Lazy iterator pipelines / scenario 8 — mode=negate; take=4
// Prompt: ../prompts/1846.txt
'use strict';
const cfg={"mode":"negate","take":4};
// Why this works:
// The whole pipeline is one generator, and a generator body does not start
// running until the first next() call. So building the result pulls nothing from
// the input, which is the first thing the prompt demands.
// for...of over the input drives the source one item at a time. A value that
// fails the filter is skipped with continue and nothing is emitted; a value that
// passes is projected and yielded, and control returns to the consumer until it
// asks for more. The input is never copied into an array, so an infinite or
// expensive source costs only what is consumed.
// Counting emissions and returning as soon as emitted reaches cfg.take is what
// stops the pull one item after the last one yielded. Returning from inside a
// for...of loop makes the loop call return() on the source iterator, which runs
// the source's finally block -- that is how the underlying iterator gets closed.
// Abandoning the pipeline early does the same thing: breaking out of a for...of
// over this generator calls return() on it, which unwinds its own for...of and
// closes the source in turn.
// cfg.take === 0 is handled before the loop, because otherwise the first value
// would be pulled and yielded before the count could stop it.
// cfg.mode selects the filter and the projection: 'even' and 'positive' filter
// and pass values through unchanged, 'square', 'negate' and 'double' keep every
// value and transform it.
function lazyPipeline(input) {
  return (function* () {
    if (cfg.take === 0) return;
    let emitted = 0;
    for (const value of input) {
      if (cfg.mode === 'even' && value % 2 !== 0) continue;
      if (cfg.mode === 'positive' && value <= 0) continue;
      const projected =
        cfg.mode === 'square' ? value * value :
        cfg.mode === 'negate' ? -value :
        cfg.mode === 'double' ? value * 2 :
        value;
      yield projected;
      if (++emitted === cfg.take) return;
    }
  })();
}
module.exports=lazyPipeline;
