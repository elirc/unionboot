// 93: Normalize an absolute virtual path
// Accept a string beginning with / or throw TypeError. Collapse repeated / and dot segments; .. removes one component but cannot go above root. Remove trailing slash except for root. No filesystem access, URL decoding, or backslash interpretation.
// Hint: Process segments using a stack; this is a virtual POSIX path only.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=93
'use strict';
// Why this works:
// Splitting on '/' turns the path into segments. A run of slashes produces
// empty segments and a trailing slash produces one empty segment at the end,
// so skipping every empty segment collapses '//' and drops the trailing slash
// for free. A '.' segment means "this directory", so it is skipped too.
// A '..' segment pops the last kept component. pop() on an empty array is a
// no-op, and that no-op is exactly the "cannot go above root" rule: the test
// asserts solve('/../../') is '/'.
// Joining the kept components behind a single leading '/' rebuilds the path.
// The result can only end in '/' when the stack is empty, which is the root
// case.
// Nothing is decoded or unescaped: the test passes '/a/%2e%2e' and expects it
// back unchanged, because '%2e%2e' is an ordinary segment and not '..'.
function normalizePath(text) {
  if (typeof text !== 'string' || !text.startsWith('/')) {
    throw new TypeError('Absolute path required');
  }
  const components = [];
  for (const segment of text.split('/')) {
    if (segment === '' || segment === '.') {
      continue;
    }
    if (segment === '..') {
      components.pop();
    } else {
      components.push(segment);
    }
  }
  return '/' + components.join('/');
}
module.exports = normalizePath;
