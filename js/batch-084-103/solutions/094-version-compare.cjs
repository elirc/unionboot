// 94: Compare numeric version components
// Accept nonempty dot-separated digit components, otherwise throw TypeError. Return -1, 0, or 1. Ignore leading zeros and trailing zero components. Components can exceed Number precision; no prerelease/build notation.
// Hint: BigInt avoids rounding version components.
// Test starter: node js/batch-084-103/verify.cjs --starters --id=94
'use strict';
function compareVersions(a,b) {
  const parse=s=>{if(typeof s!=='string'||!/^\d+(\.\d+)*$/.test(s))throw new TypeError('Invalid version');return s.split('.').map(BigInt);};
  const x=parse(a),y=parse(b);
  for(let i=0;i<Math.max(x.length,y.length);i++){const p=x[i]??0n,q=y[i]??0n;if(p!==q)return p<q?-1:1;}
  return 0;
}
module.exports = compareVersions;
