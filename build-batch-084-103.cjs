'use strict';
// Individually authored exercise definitions; generation only handles file layout.
const fs = require('node:fs');
const path = require('node:path');
const base = path.join(__dirname, 'js', 'batch-084-103');
const catalog = [];
function add(id, slug, title, spec, hint, signature, implementation, checks) {
  catalog.push({ id, slug, title, spec, hint, signature, implementation, checks });
}
add(84, 'adjacent-groups', 'Group consecutive equal values',
  'Return arrays of consecutive equal primitive values using Object.is equality. Do not merge separated runs or mutate the input. Empty input returns [].',
  'Compare each value with the last value of the current run, not a global lookup.', 'groupRuns(values)',
`function groupRuns(values) {
  const out = [];
  for (const value of values) {
    const last = out[out.length - 1];
    if (last && Object.is(last[last.length - 1], value)) last.push(value);
    else out.push([value]);
  }
  return out;
}`,
`assert.deepEqual(solve([1,1,2,1]), [[1,1],[2],[1]]);
assert.deepEqual(solve([]), []);
assert.deepEqual(solve([NaN,NaN,0,-0]), [[NaN,NaN],[0],[-0]]);
const input = Object.freeze(['a','a','b']); assert.deepEqual(solve(input), [['a','a'],['b']]);`);
add(85, 'zip-longest', 'Zip uneven arrays',
  'Return pairs through the longer dense array. Fill missing positions with fill (default null). Preserve actual undefined entries. Do not mutate either input.',
  'Use index bounds rather than nullish coalescing to detect missing entries.', 'zipLongest(a, b, fill = null)',
`function zipLongest(a,b,fill=null) {
  return Array.from({length:Math.max(a.length,b.length)}, (_,i) => [i<a.length?a[i]:fill,i<b.length?b[i]:fill]);
}`,
`assert.deepEqual(solve([1,2],['a']), [[1,'a'],[2,null]]);
assert.deepEqual(solve([],[],0), []);
assert.deepEqual(solve([undefined],[2,3],'?'), [[undefined,2],['?',3]]);
assert.deepEqual(solve([],['x'],false), [[false,'x']]);`);
add(86, 'stable-partition', 'Partition with callback indices',
  'Return [matches, others], preserving input order. Call predicate(value,index) exactly once per item. Input is a dense array; do not mutate it.',
  'One loop and two result arrays avoid evaluating the predicate twice.', 'partition(values, predicate)',
`function partition(values,predicate) {
  const yes=[], no=[];
  values.forEach((value,index)=>(predicate(value,index)?yes:no).push(value));
  return [yes,no];
}`,
`assert.deepEqual(solve([1,2,3,4],n=>n%2===0), [[2,4],[1,3]]);
assert.deepEqual(solve([],()=>true), [[],[]]);
const seen=[]; assert.deepEqual(solve(['a','b','c'],(v,i)=>{seen.push([v,i]);return i!==1;}), [['a','c'],['b']]);
assert.deepEqual(seen,[['a',0],['b',1],['c',2]]);`);
add(87, 'window-sums', 'Rolling fixed-window sums',
  'Return the sum of every contiguous window of size k over finite numbers. k must be a positive integer or throw RangeError. k larger than input length returns []. Target O(n).',
  'Add the entering value and subtract the departing value.', 'windowSums(nums, k)',
`function windowSums(nums,k) {
  if (!Number.isInteger(k)||k<1) throw new RangeError('Invalid window');
  const out=[]; let sum=0;
  for(let i=0;i<nums.length;i++) { sum+=nums[i]; if(i>=k)sum-=nums[i-k]; if(i>=k-1)out.push(sum); }
  return out;
}`,
`assert.deepEqual(solve([1,2,3,4],2), [3,5,7]);
assert.deepEqual(solve([-2,3,-1],1), [-2,3,-1]);
assert.deepEqual(solve([1],2), []);
assert.throws(()=>solve([],0),RangeError);
assert.throws(()=>solve([1],1.5),RangeError);`);
add(88, 'range-sum-index', 'Build a range-sum query function',
  'Return query(start,end) summing nums[start..end), in O(1) per query after O(n) setup. Reject noninteger indices or bounds outside 0 <= start <= end <= length with RangeError. Capture a snapshot, not later input mutations.',
  'A prefix array with an initial zero makes empty ranges natural.', 'rangeSumIndex(nums)',
`function rangeSumIndex(nums) {
  const prefix=[0]; for(const n of nums)prefix.push(prefix[prefix.length-1]+n);
  return (start,end)=>{
    if(!Number.isInteger(start)||!Number.isInteger(end)||start<0||end<start||end>=prefix.length)throw new RangeError('Invalid range');
    return prefix[end]-prefix[start];
  };
}`,
`const input=[2,-1,4,7]; const q=solve(input); assert.equal(q(1,3),3);
assert.equal(q(0,4),12); assert.equal(q(2,2),0);
input[0]=999; assert.equal(q(0,1),2);
assert.throws(()=>q(3,2),RangeError); assert.throws(()=>q(0,5),RangeError);
assert.equal(solve([])(0,0),0);`);
add(89, 'lower-bound', 'First valid insertion index',
  'For a sorted ascending array of finite numbers, return the first index whose value is >= target; return length if none. Duplicates must return their first position. O(log n), no mutation.',
  'Keep a half-open search interval [lo,hi).', 'lowerBound(nums, target)',
`function lowerBound(nums,target) {
  let lo=0,hi=nums.length;
  while(lo<hi) { const mid=lo+Math.floor((hi-lo)/2); if(nums[mid]<target)lo=mid+1;else hi=mid; }
  return lo;
}`,
`assert.equal(solve([1,3,3,7],3),1);
assert.equal(solve([1,3,3,7],4),3);
assert.equal(solve([],5),0);
assert.equal(solve([1,2],3),2); assert.equal(solve([1,2],-5),0);`);
add(90, 'sorted-compaction', 'Compact sorted duplicates in place',
  'Given a sorted dense array of finite numbers, remove duplicate values in place, truncate its length, and return the new length. Use O(1) extra space. Empty input stays empty.',
  'A write pointer advances only for a value unlike the previous retained value.', 'compactSorted(nums)',
`function compactSorted(nums) {
  let write=0;
  for(let read=0;read<nums.length;read++)if(write===0||nums[read]!==nums[write-1])nums[write++]=nums[read];
  nums.length=write; return write;
}`,
`const a=[1,1,2,2,2,5]; assert.equal(solve(a),3); assert.deepEqual(a,[1,2,5]);
const b=[]; assert.equal(solve(b),0); assert.deepEqual(b,[]);
const c=[-3,-3,-1]; assert.equal(solve(c),2); assert.deepEqual(c,[-3,-1]);`);
add(91, 'decode-runs', 'Decode explicit run records',
  'Input is an array of [text,count] pairs. Text must be a string, count a nonnegative safe integer, otherwise throw TypeError. Return their repeated concatenation. Before allocating output, reject a total UTF-16 length over maxLength (default 10000) with RangeError. maxLength must be a nonnegative safe integer.',
  'Validate the complete output length first, then allocate repetitions.', 'decodeRuns(runs, maxLength = 10000)',
`function decodeRuns(runs,maxLength=10000) {
  if(!Number.isSafeInteger(maxLength)||maxLength<0)throw new RangeError('Invalid limit');
  let total=0;
  for(const [text,count] of runs){
    if(typeof text!=='string'||!Number.isSafeInteger(count)||count<0)throw new TypeError('Invalid run');
    total+=text.length*count; if(total>maxLength)throw new RangeError('Output too long');
  }
  return runs.map(([text,count])=>text.repeat(count)).join('');
}`,
`assert.equal(solve([['ab',2],['!',1]]),'abab!');
assert.equal(solve([['x',0]],0),''); assert.equal(solve([]),'');
assert.throws(()=>solve([['a',-1]]),TypeError);
assert.throws(()=>solve([['ab',3]],5),RangeError);
assert.equal(solve([['ab',3]],6),'ababab');`);
add(92, 'literal-regex', 'Escape literal regex input',
  'Return a string that can be passed to new RegExp to match the input literally. Escape regular-expression metacharacters, including backslash. No regex flags are needed; slash is not special in the constructor.',
  'Iterating characters makes the escape list explicit.', 'escapeRegex(text)',
`function escapeRegex(text) {
  const special=new Set('.*+?^$'+'{}()|[]'+String.fromCharCode(92));
  return [...text].map(ch=>special.has(ch)?String.fromCharCode(92)+ch:ch).join('');
}`,
`const text='a.b+[x](y)?'; assert.ok(new RegExp('^'+solve(text)+'$').test(text));
assert.ok(!new RegExp('^'+solve('a.b')+'$').test('axb'));
assert.equal(solve('hello'),'hello'); assert.equal(solve(''),'');
const slash=String.fromCharCode(92); assert.ok(new RegExp('^'+solve(slash)+'$').test(slash));`);
add(93, 'normalize-posix', 'Normalize an absolute virtual path',
  'Accept a string beginning with / or throw TypeError. Collapse repeated / and dot segments; .. removes one component but cannot go above root. Remove trailing slash except for root. No filesystem access, URL decoding, or backslash interpretation.',
  'Process segments using a stack; this is a virtual POSIX path only.', 'normalizePath(text)',
`function normalizePath(text) {
  if(typeof text!=='string'||!text.startsWith('/'))throw new TypeError('Absolute path required');
  const stack=[];
  for(const part of text.split('/')) { if(!part||part==='.')continue; if(part==='..')stack.pop();else stack.push(part); }
  return '/'+stack.join('/');
}`,
`assert.equal(solve('/a//b/../c/.'),'/a/c');
assert.equal(solve('/../../'),'/'); assert.equal(solve('/a/'),'/a');
assert.throws(()=>solve('a/b'),TypeError); assert.equal(solve('/a/%2e%2e'),'/a/%2e%2e');`);
add(94, 'version-compare', 'Compare numeric version components',
  'Accept nonempty dot-separated digit components, otherwise throw TypeError. Return -1, 0, or 1. Ignore leading zeros and trailing zero components. Components can exceed Number precision; no prerelease/build notation.',
  'BigInt avoids rounding version components.', 'compareVersions(a, b)',
`function compareVersions(a,b) {
  const parse=s=>{if(typeof s!=='string'||!/^\\d+(\\.\\d+)*$/.test(s))throw new TypeError('Invalid version');return s.split('.').map(BigInt);};
  const x=parse(a),y=parse(b);
  for(let i=0;i<Math.max(x.length,y.length);i++){const p=x[i]??0n,q=y[i]??0n;if(p!==q)return p<q?-1:1;}
  return 0;
}`,
`assert.equal(solve('1.02.0','1.2'),0);
assert.equal(solve('2.0','1.99'),1); assert.equal(solve('1.2','1.2.1'),-1);
assert.equal(solve('9007199254740993','9007199254740992'),1);
assert.throws(()=>solve('1..2','1'),TypeError);`);
add(95, 'extended-gcd', 'Bezout coefficients with BigInt',
  'Given nonnegative BigInts a,b, return {gcd,x,y} with a*x+b*y=gcd. gcd must be nonnegative. For (0n,0n), use {gcd:0n,x:1n,y:0n}. Coefficients are not otherwise unique.',
  'Track coefficient pairs alongside Euclidean remainders.', 'extendedGcd(a, b)',
`function extendedGcd(a,b) {
  let r0=a,r1=b,x0=1n,x1=0n,y0=0n,y1=1n;
  while(r1!==0n){const q=r0/r1;[r0,r1]=[r1,r0-q*r1];[x0,x1]=[x1,x0-q*x1];[y0,y1]=[y1,y0-q*y1];}
  return {gcd:r0,x:x0,y:y0};
}`,
`for(const [a,b,g] of [[30n,18n,6n],[17n,5n,1n],[0n,9n,9n],[0n,0n,0n]]){
const r=solve(a,b);assert.equal(r.gcd,g);assert.equal(a*r.x+b*r.y,g);}
assert.deepEqual(solve(0n,0n),{gcd:0n,x:1n,y:0n});`);
add(96, 'fraction-normalize', 'Normalize a rational number',
  'Given BigInt numerator and denominator, return [numerator,denominator] reduced to lowest terms, with positive denominator. Zero normalizes to [0n,1n]. A zero denominator throws RangeError.',
  'Normalize the sign, then divide both values by their greatest common divisor.', 'normalizeFraction(numerator, denominator)',
`function normalizeFraction(n,d) {
  if(d===0n)throw new RangeError('Zero denominator');
  if(d<0n){n=-n;d=-d;}
  let a=n<0n?-n:n,b=d;while(b!==0n)[a,b]=[b,a%b];
  return [n/a,d/a];
}`,
`assert.deepEqual(solve(8n,12n),[2n,3n]);
assert.deepEqual(solve(2n,-6n),[-1n,3n]);assert.deepEqual(solve(0n,-5n),[0n,1n]);
assert.throws(()=>solve(1n,0n),RangeError);assert.deepEqual(solve(-9n,-3n),[3n,1n]);`);
add(97, 'base-encode', 'Encode BigInt without toString(radix)',
  'Return the base-2-through-36 lowercase representation of a nonnegative BigInt. Reject invalid bases with RangeError and negative values with RangeError. Do not use toString(radix). Zero returns "0".',
  'Collect remainder digits in reverse order.', 'encodeBase(value, base)',
`function encodeBase(value,base) {
  if(!Number.isInteger(base)||base<2||base>36||value<0n)throw new RangeError('Invalid input');
  if(value===0n)return '0';
  const digits='0123456789abcdefghijklmnopqrstuvwxyz',radix=BigInt(base);let out='';
  while(value>0n){out=digits[Number(value%radix)]+out;value/=radix;}return out;
}`,
`assert.equal(solve(255n,16),'ff');assert.equal(solve(10n,2),'1010');assert.equal(solve(0n,36),'0');
assert.equal(solve(35n,36),'z');assert.throws(()=>solve(2n,1),RangeError);
assert.throws(()=>solve(-1n,10),RangeError);`);
add(98, 'matrix-transpose', 'Transpose a rectangular matrix',
  'Return a fresh transpose of a dense rectangular array of rows; [] and rows with zero columns return []. Throw RangeError for unequal row lengths. Do not mutate input rows. Cell objects retain identity.',
  'The result has one row per original column.', 'transpose(matrix)',
`function transpose(matrix) {
  if(!matrix.length)return [];
  const width=matrix[0].length;if(matrix.some(row=>row.length!==width))throw new RangeError('Ragged matrix');
  return Array.from({length:width},(_,c)=>matrix.map(row=>row[c]));
}`,
`assert.deepEqual(solve([[1,2,3],[4,5,6]]),[[1,4],[2,5],[3,6]]);
assert.deepEqual(solve([]),[]);assert.deepEqual(solve([[],[]]),[]);
assert.throws(()=>solve([[1],[2,3]]),RangeError);
const item={};assert.equal(solve([[item]])[0][0],item);`);
add(99, 'spiral-traversal', 'Walk a matrix clockwise',
  'Return rectangular matrix values in clockwise spiral order starting at top-left. Empty rows/matrix return []. Inputs are rectangular; do not mutate them. Handle single rows and columns without duplicates.',
  'Shrink top, bottom, left and right boundaries; guard the last two edges.', 'spiral(matrix)',
`function spiral(matrix) {
  const out=[];let top=0,bottom=matrix.length-1,left=0,right=(matrix[0]?.length??0)-1;
  while(top<=bottom&&left<=right){
    for(let c=left;c<=right;c++)out.push(matrix[top][c]);top++;
    for(let r=top;r<=bottom;r++)out.push(matrix[r][right]);right--;
    if(top<=bottom){for(let c=right;c>=left;c--)out.push(matrix[bottom][c]);bottom--;}
    if(left<=right){for(let r=bottom;r>=top;r--)out.push(matrix[r][left]);left++;}
  }return out;
}`,
`assert.deepEqual(solve([[1,2,3],[4,5,6],[7,8,9]]),[1,2,3,6,9,8,7,4,5]);
assert.deepEqual(solve([[1,2,3]]),[1,2,3]);assert.deepEqual(solve([[1],[2],[3]]),[1,2,3]);
assert.deepEqual(solve([]),[]);assert.deepEqual(solve([[]]),[]);`);
add(100, 'increasing-subsequence', 'Length of a strictly increasing subsequence',
  'Return the longest strictly increasing subsequence length of finite numbers (not necessarily contiguous). Equal values do not extend a sequence. Empty input returns 0. Target O(n log n).',
  'Track the smallest possible tail for each subsequence length using lower-bound search.', 'lisLength(nums)',
`function lisLength(nums) {
  const tails=[];
  for(const n of nums){let lo=0,hi=tails.length;while(lo<hi){const mid=Math.floor((lo+hi)/2);if(tails[mid]<n)lo=mid+1;else hi=mid;}tails[lo]=n;}
  return tails.length;
}`,
`assert.equal(solve([10,9,2,5,3,7,101,18]),4);
assert.equal(solve([2,2,2]),1);assert.equal(solve([]),0);assert.equal(solve([5,4,3]),1);
assert.equal(solve([-3,-2,-1]),3);`);
add(101, 'edit-distance', 'Levenshtein edit distance',
  'For ASCII strings, return the minimum number of single-character insertions, deletions and substitutions to change a into b. Each costs 1. Use a rolling DP row rather than storing the full matrix.',
  'Save the old diagonal before overwriting each DP cell.', 'editDistance(a, b)',
`function editDistance(a,b) {
  const row=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++){let diagonal=row[0];row[0]=i;
    for(let j=1;j<=b.length;j++){const old=row[j];row[j]=Math.min(row[j]+1,row[j-1]+1,diagonal+(a[i-1]===b[j-1]?0:1));diagonal=old;}}
  return row[b.length];
}`,
`assert.equal(solve('kitten','sitting'),3);assert.equal(solve('','abc'),3);
assert.equal(solve('same','same'),0);assert.equal(solve('ab','ba'),2);assert.equal(solve('abc',''),3);`);
add(102, 'choose-sum', 'Fixed-size combinations reaching a target',
  'Given distinct integers in input order, a nonnegative integer k and integer target, return all k-element combinations whose sum equals target. Use each position at most once; keep index order within combinations and lexicographic index order across results. Negative values are allowed. k=0,target=0 returns [[]].',
  'Backtrack with a start index; do not prune solely because a partial sum exceeds the target.', 'chooseSum(nums, k, target)',
`function chooseSum(nums,k,target) {
  const out=[],chosen=[];
  function visit(start,sum){
    if(chosen.length===k){if(sum===target)out.push([...chosen]);return;}
    for(let i=start;i<=nums.length-(k-chosen.length);i++){chosen.push(nums[i]);visit(i+1,sum+nums[i]);chosen.pop();}
  }visit(0,0);return out;
}`,
`assert.deepEqual(solve([1,2,3,4,5],2,6),[[1,5],[2,4]]);
assert.deepEqual(solve([5,-4,2],2,1),[[5,-4]]);
assert.deepEqual(solve([],0,0),[[]]);assert.deepEqual(solve([1],2,1),[]);
assert.deepEqual(solve([1,2],0,3),[]);`);
add(103, 'graph-reachability', 'Breadth-first reachable labels',
  'A directed graph is a Map<label,label[]> of string labels. Return all labels reachable from start in BFS discovery order, including start. Missing keys are leaves; duplicate edges and cycles must not duplicate results. Do not mutate graph arrays.',
  'Mark visited when enqueueing, not when dequeueing. Use a queue index rather than shift.', 'reachable(graph, start)',
`function reachable(graph,start) {
  const queue=[start],seen=new Set(queue);
  for(let i=0;i<queue.length;i++)for(const next of graph.get(queue[i])??[]){if(!seen.has(next)){seen.add(next);queue.push(next);}}
  return queue;
}`,
`const graph=new Map([['a',['b','c','b']],['b',['d']],['c',['d','a']]]);
assert.deepEqual(solve(graph,'a'),['a','b','c','d']);
assert.deepEqual(solve(graph,'z'),['z']);
assert.deepEqual(solve(new Map([['x',['x']]]),'x'),['x']);
assert.deepEqual(graph.get('a'),['b','c','b']);`);

if(catalog.length!==20 || catalog.some((item,index)=>item.id!==84+index))throw new Error('Catalog must cover 84–103 exactly');
// Never overwrite learner work or existing deliverables on a rerun.
if(fs.existsSync(base))throw new Error('Batch directory already exists. Review it before regenerating.');
for(const folder of ['starters','solutions','tests'])fs.mkdirSync(path.join(base,folder),{recursive:true});
const manifest=[];
for(const item of catalog){
  const name=String(item.id).padStart(3,'0')+'-'+item.slug+'.cjs';
  const api=item.signature.slice(0,item.signature.indexOf('('));
  const header=`// ${item.id}: ${item.title}\n// ${item.spec}\n// Hint: ${item.hint}\n// Test starter: node js/batch-084-103/verify.cjs --starters --id=${item.id}\n`;
  const starter=header+`'use strict';\nfunction ${item.signature} {\n  throw new Error('TODO: ${api}');\n}\nmodule.exports = ${api};\n`;
  const solution=header+`'use strict';\n${item.implementation}\nmodule.exports = ${api};\n`;
  const test=`'use strict';\nconst assert = require('node:assert/strict');\nmodule.exports = function check(solve) {\n${item.checks}\n};\n`;
  fs.writeFileSync(path.join(base,'starters',name),starter);
  fs.writeFileSync(path.join(base,'solutions',name),solution);
  fs.writeFileSync(path.join(base,'tests',name),test);
  manifest.push({id:item.id,title:item.title,api,starter:'starters/'+name,solution:'solutions/'+name,test:'tests/'+name});
}
fs.writeFileSync(path.join(base,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync(path.join(base,'verify.cjs'),`'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const manifest=require('./manifest.json');
assert.deepEqual(manifest.map(x=>x.id),Array.from({length:20},(_,i)=>84+i));
const args=process.argv.slice(2);
for(const arg of args)if(arg!=='--starters'&&!/^--id=\\d+$/.test(arg))throw new Error('Unknown argument: '+arg);
const selected=args.find(a=>a.startsWith('--id='));
const entries=selected?manifest.filter(x=>x.id===Number(selected.slice(5))):manifest;
if(!entries.length)throw new Error('Unknown exercise id');
const mode=args.includes('--starters')?'starter':'solution';
let passed=0,failed=0;
for(const entry of entries){
 try {
  for(const field of ['starter','solution','test'])new vm.Script(fs.readFileSync(path.join(__dirname,entry[field]),'utf8'),{filename:entry[field]});
  const solve=require('./'+entry[mode]);
  assert.equal(typeof solve,'function');
  require('./'+entry.test)(solve);
  passed++;console.log('PASS '+entry.id+' '+entry.title);
 }catch(error){failed++;console.error('FAIL '+entry.id+': '+error.stack);}
}
console.log(mode+' checks: '+passed+' passed, '+failed+' failed; '+entries.length+' exercises.');
console.log('Blank starters are intentional; syntax checking is not correctness verification.');
process.exitCode=failed?1:0;
`);
fs.writeFileSync(path.join(base,'GUIDE.txt'),`UNIONBOOT: JAVASCRIPT 084–103\n\n20 distinct intermediate exercises. Node 22, no dependencies.\n\nFrom Desktop/unionboot:\n  node js/batch-084-103/verify.cjs\n  node js/batch-084-103/verify.cjs --starters --id=84\n\nEdit only starters/ while practising. Tests/ contains worked input/output examples\nand edge cases. Solutions/ contains complete reference implementations.\nThe same checks grade starter and solution exports; blank starters fail by design.\nReference verification checks syntax of all three files and then executes assertions.\nDo not rerun the generator over this folder: it refuses to overwrite your work.\n\n`+catalog.map(x=>`${x.id} ${x.title}\n  ${x.spec}\n  Hint: ${x.hint}\n`).join('\n'));
console.log('Created 20 starters, 20 reference solutions, 20 test files, manifest, guide and runner in '+base);
