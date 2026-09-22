// 1810 JSON wildcard selection / scenario 2 — order=forward; missing=null; output=all
// Prompt: ../prompts/1810.txt
'use strict';
const cfg={"order":"forward","missing":"null","output":"all"};
// Why this works:
// A breadth-first walk of a JSON value guided by a path of tokens. nodes holds
// the values selected so far; each token maps that whole set to the next one,
// so one pass per path segment replaces any recursion.
// A '*' token expands a container into its own values. Object.keys gives own
// enumerable string keys only, which is what "no prototype traversal" means: a
// path token 'toString' finds nothing on a plain object, because hasOwnProperty
// is false for an inherited method. cfg.order flips the expansion order by
// reversing the freshly built key array -- Object.keys returns a new array, so
// reversing it does not disturb the input.
// A primitive has no wildcard children, so a '*' over a primitive contributes
// nothing to the next set. That is a silent drop even under missing='error':
// the prompt scopes the error to a literal missing key.
// A literal token either finds an own property or triggers cfg.missing: 'skip'
// drops the branch, 'null' replaces it with null and keeps walking, 'error'
// throws Error('Missing path').
// Values are only read and re-collected, never copied or written, so the caller's
// object graph comes back untouched and the returned values are the same objects.
// cfg.output finally projects: every surviving value, or the first one with null
// when nothing survived.
function jsonSelection(input) {
  let nodes = [input.value];
  for (const token of input.path) {
    const next = [];
    for (const value of nodes) {
      const isContainer = value !== null && typeof value === 'object';
      if (token === '*') {
        if (isContainer) {
          const keys = Object.keys(value);
          if (cfg.order === 'reverse') keys.reverse();
          for (const key of keys) next.push(value[key]);
        }
      } else if (isContainer && Object.prototype.hasOwnProperty.call(value, token)) {
        next.push(value[token]);
      } else if (cfg.missing === 'null') {
        next.push(null);
      } else if (cfg.missing === 'error') {
        throw new Error('Missing path');
      }
    }
    nodes = next;
  }
  if (cfg.output === 'count') return nodes.length;
  if (cfg.output === 'first') return nodes.length ? nodes[0] : null;
  return nodes;
}
module.exports=jsonSelection;
