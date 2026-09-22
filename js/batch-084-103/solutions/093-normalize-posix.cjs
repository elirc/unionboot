// 93: Normalize an absolute virtual path
// Accept a string beginning with / or throw TypeError. Collapse repeated / and dot segments; .. removes one component but cannot go above root. Remove trailing slash except for root. No filesystem access, URL decoding, or backslash interpretation.
// Hint: Process segments using a stack; this is a virtual POSIX path only.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=93
'use strict';
function normalizePath(text) {
  if(typeof text!=='string'||!text.startsWith('/'))throw new TypeError('Absolute path required');
  const stack=[];
  for(const part of text.split('/')) { if(!part||part==='.')continue; if(part==='..')stack.pop();else stack.push(part); }
  return '/'+stack.join('/');
}
module.exports = normalizePath;
