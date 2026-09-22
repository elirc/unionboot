'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const s = require('./solutions/round2-39-50.cjs');
for (let id = 39; id <= 50; id++) {
  const prefix = `${id}-`;
  const files = fs.readdirSync(__dirname).filter(n => n.startsWith(prefix) && n.endsWith('.js'));
  assert.equal(files.length, 1, `Exactly one starter for ${id}`);
  const file = path.join(__dirname, files[0]);
  const syntax = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8', timeout: 10000 });
  assert.equal(syntax.status, 0, syntax.stderr);
  const run = spawnSync(process.execPath, [file], { encoding: 'utf8', timeout: 5000 });
  console.log(`Starter ${id}: syntax OK; ${run.status === 0 ? 'runs, output NOT graded' : 'runtime incomplete/error (expected for blank starter)'}`);
}
test('39 compression', () => {
  for (const [input, out] of [['aaabbc','a3b2c1'], ['aab','aab'], ['abc','abc'], ['aaaaaaaaaa','a10'], ['',''], ['aa','a2']]) assert.equal(s.compress(input),out);
});
test('40 sliding window', () => {
  for (const [input,out] of [['abcabcbb',3],['bbbbb',1],['pwwkew',3],['',0],['abba',2],['dvdf',3]]) assert.equal(s.lengthOfLongestSubstring(input),out);
});
test('41 prefix', () => {
  assert.equal(s.longestCommonPrefix(['flower','flow','flight']),'fl');
  assert.equal(s.longestCommonPrefix(['dog','racecar','car']),'');
  assert.equal(s.longestCommonPrefix(['interspecies','interstellar','interstate']),'inters');
  assert.equal(s.longestCommonPrefix(['solo']),'solo');
  assert.equal(s.longestCommonPrefix([]),'');
});
test('42 merge', () => {
  assert.deepEqual(s.mergeSorted([1,3,5],[2,4,6]),[1,2,3,4,5,6]);
  assert.deepEqual(s.mergeSorted([1,1,2],[1,3]),[1,1,1,2,3]);
  assert.deepEqual(s.mergeSorted([],[]),[]);
  const a = Object.freeze([1,2,3]); assert.deepEqual(s.mergeSorted(a,[]),a);
});
test('43 primes', () => { for (const [n,out] of [[10,4],[0,0],[1,0],[100,25],[2,0],[3,1]]) assert.equal(s.countPrimes(n),out); });
test('44 subsets', () => {
  const got=s.subsets([1,2,3]).map(JSON.stringify).sort();
  assert.deepEqual(got,[[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]].map(JSON.stringify).sort());
  assert.deepEqual(s.subsets([]),[[]]); assert.deepEqual(s.subsets([5]),[[],[5]]);
});
test('45 permutations', () => {
  assert.deepEqual(s.permutations([1,2,3]).map(JSON.stringify).sort(), [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]].map(JSON.stringify).sort());
  assert.deepEqual(s.permutations([]),[[]]); assert.deepEqual(s.permutations(['a']),[['a']]);
});
test('46 rotate', () => {
  for (const [a,k,out] of [[[1,2,3,4,5,6,7],3,[5,6,7,1,2,3,4]],[[1,2],5,[2,1]],[[],9,[]],[[1,2],0,[1,2]]]) { s.rotate(a,k); assert.deepEqual(a,out); }
});
function clock() {
  let now=0, id=0; const jobs=new Map();
  return { now:()=>now, setTimeout:(fn,ms)=>{jobs.set(++id,{fn,time:now+ms});return id;}, clearTimeout:key=>jobs.delete(key), advance(to) {
    while (true) { const next=[...jobs].filter(([,v])=>v.time<=to).sort((a,b)=>a[1].time-b[1].time)[0]; if(!next) break; jobs.delete(next[0]); now=next[1].time; next[1].fn(); }
    now=to;
  }};
}
test('47 debounce latest args and receiver', () => {
  const c=clock(), logs=[]; const owner={name:'search',run:s.debounce(function(q){logs.push(this.name+': '+q);},200,c)};
  owner.run('a'); c.advance(50); owner.run('ab'); c.advance(120); owner.run('abc'); c.advance(319); assert.deepEqual(logs,[]);
  c.advance(320); assert.deepEqual(logs,['search: abc']); c.advance(500); assert.equal(logs.length,1);
});
test('48 throttle boundary', () => {
  const c=clock(),logs=[]; const f=s.throttle(n=>logs.push(n),200,c.now);
  f(1); f(2); c.advance(100);f(3); c.advance(250);f(4);c.advance(300);f(5);assert.deepEqual(logs,[1,4]);
  c.advance(450); f(6);assert.deepEqual(logs,[1,4,6]);
});
test('49 fibonacci results and calls', () => {
  const f=s.fibonacciSuite();assert.equal(f.fibNaive(30),832040);assert.equal(f.fibMemo(30),832040);assert.equal(f.fibIter(30),832040);
  assert.deepEqual(f.counts(),{naiveCalls:2692537,memoCalls:59});assert.equal(f.fibIter(0),0);assert.equal(f.fibIter(1),1);
});
test('50 clone dates, aliases, cycles and sparse arrays', () => {
  const date=new Date('2026-01-01T00:00:00Z'); const original={a:1,b:{c:[1,2,{d:date}]}}, copy=s.deepClone(original);
  assert.deepEqual(copy,original);assert.notEqual(copy,original);assert.notEqual(copy.b.c[2].d,date);assert.equal(copy.b.c[2].d.getUTCFullYear(),2026);
  const cyc={name:'loop'};cyc.self=cyc;const cloned=s.deepClone(cyc);assert.notEqual(cloned,cyc);assert.equal(cloned.self,cloned);
  const pair=s.deepClone({a:date,b:date});assert.equal(pair.a,pair.b);assert.notEqual(pair.a,date);
  assert.equal(s.deepClone(42),42);assert.equal(s.deepClone(null),null);assert.equal(s.deepClone(new Array(3)).length,3);
});
