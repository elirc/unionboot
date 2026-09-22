// 94: Compare numeric version components
// Accept nonempty dot-separated digit components, otherwise throw TypeError. Return -1, 0, or 1. Ignore leading zeros and trailing zero components. Components can exceed Number precision; no prerelease/build notation.
// Hint: BigInt avoids rounding version components.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=94
'use strict';
// Why this works:
// Each version string is validated with /^\d+(\.\d+)*$/ — one digit group,
// then any number of further groups each preceded by a single dot. That
// rejects '1..2', a leading or trailing dot, and a non-string, all as
// TypeError, before any comparison happens.
// Components are parsed with BigInt rather than Number. The test compares
// '9007199254740993' with '9007199254740992'; those differ by one just above
// Number.MAX_SAFE_INTEGER and would round to the same double.
// BigInt('02') is 2n, so leading zeros stop mattering the moment the component
// is parsed.
// The loop runs to the longer of the two component counts and treats a missing
// component as 0n. That makes trailing zero components invisible, so '1.2' and
// '1.2.0' compare equal, and the first component that differs decides whether
// the answer is -1 or 1.
function compareVersions(a, b) {
  function parse(version) {
    if (typeof version !== 'string' || !/^\d+(\.\d+)*$/.test(version)) {
      throw new TypeError('Invalid version');
    }
    return version.split('.').map(BigInt);
  }
  const left = parse(a);
  const right = parse(b);
  const componentCount = Math.max(left.length, right.length);
  for (let i = 0; i < componentCount; i++) {
    const leftPart = left[i] ?? 0n;
    const rightPart = right[i] ?? 0n;
    if (leftPart !== rightPart) {
      return leftPart < rightPart ? -1 : 1;
    }
  }
  return 0;
}
module.exports = compareVersions;
