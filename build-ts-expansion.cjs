'use strict';
// 39 API families x 15 openly labelled regression scenarios, NOT 585 algorithms.
// Owns ONLY ts-more/, ts-final/, and this authoring file. Never overwrite learner work.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = __dirname;
const families = [];
function family(name, topic, create) { families.push({ name, topic, create }); }
const q = JSON.stringify;
const scenarioNames = ['empty collection', 'singleton', 'ordered positives', 'duplicates', 'negative values', 'zero boundaries', 'descending input', 'alternating signs', 'repeated extremes', 'sparse magnitudes', 'all equal', 'longer sequence', 'mixed duplicates', 'large integers', 'fractional values'];
const data = [[], [7], [1,2,3], [2,2,3,2], [-8,-3,-1], [0,1,0,-1], [9,6,3], [-2,4,-6,8], [-9,9,-9,9], [1,100,1000], [5,5,5], [1,2,3,4,5,6,7], [3,1,3,2,1], [10000,20000,30000], [0.5,1.5,-2.5]];
function task(prelude, signature, body, prompt, tests, positive, negative) {
  return { prelude, signature, body, prompt, tests, positive, negative };
}
// Each API has real input/output relationships. There is no artificial policy token.
family('Stable generic partition', 'generics; readonly inputs; callback variance', v => task('',
  '<T>(items: readonly T[], predicate: (item: T, index: number) => boolean): [T[], T[]]',
  'const yes: T[] = [], no: T[] = []; items.forEach((item, index) => (predicate(item, index) ? yes : no).push(item)); return [yes, no];',
  'Return [accepted,rejected], preserving order and references. Call predicate exactly once per element with its zero-based index. Empty input gives two empty arrays; do not mutate input.',
  `const xs=Object.freeze(${q(data[v])}); const seen=[]; const out=solve(xs,(x,i)=>{seen.push(i);return x>=0;}); assert.deepEqual(out,[xs.filter(x=>x>=0),xs.filter(x=>x<0)]); assert.deepEqual(seen,xs.map((_,i)=>i)); assert.deepEqual(solve([],()=>true),[[],[]]); const obj={id:'a'}; assert.equal(solve([obj],()=>true)[0][0],obj); assert.deepEqual(solve(['a','bb'],x=>x.length===1),[['a'],['bb']]);`,
  `const out = solve([1,2] as const, n => n > 1); const exact: (1|2)[] = out[0]; const objects: {id:string}[] = solve([{id:'x'}], x => x.id.length > 0)[0]; void exact; void objects;`,
  [`solve([1,2], (x: string) => x.length > 0);`, `solve(3, () => true);`, `const wrong: string[] = solve([1], () => true)[0];`, `solve([1], () => 'yes');`]));
family('Generic chunk boundaries', 'generics; indexed access; validation', v => task('',
  '<T>(items: readonly T[], size: number): T[][]',
  `if (!Number.isSafeInteger(size) || size < 1) throw new Error('Invalid size'); const out: T[][] = []; for (let i=0;i<items.length;i+=size) out.push(items.slice(i,i+size)); return out;`,
  'Split into consecutive nonempty chunks of size, except possibly the last. Validate positive safe-integer size even for an empty input. Invalid size throws Error("Invalid size"). Return fresh arrays, preserving element references.',
  `const xs=Object.freeze(${q(data[v])}), size=${v%4+1}; const result=solve(xs,size); assert.deepEqual(result.flat(),xs); assert.ok(result.every(a=>a.length>0&&a.length<=size)); assert.equal(result.length,Math.ceil(xs.length/size)); assert.deepEqual(solve([],2),[]); for(const bad of [0,-1,1.5,NaN,Infinity]) assert.throws(()=>solve([],bad),/Invalid size/); const obj={x:1}; const out=solve([obj],1); assert.equal(out[0][0],obj); assert.deepEqual(solve(['a','b','c'],2),[['a','b'],['c']]);`,
  `const out: ('a'|'b')[][] = solve(['a','b'] as const, 1); const other: boolean[][] = solve([true,false], 2); void out; void other;`,
  [`solve([1], '2');`, `solve(null, 2);`, `const bad: string[][] = solve([1],2);`, `solve([1], true);`]));
family('Shortest typed zip', 'two type parameters; tuples; readonly', v => task('',
  '<A, B>(left: readonly A[], right: readonly B[]): [A, B][]',
  'const result: [A,B][] = []; for(let i=0;i<Math.min(left.length,right.length);i++) result.push([left[i]!,right[i]!]); return result;',
  'Zip by index, stopping at the shorter input. Preserve independent element types and tuple position types. Return fresh mutable two-element tuples, without mutating either input.',
  `const xs=Object.freeze(${q(data[v])}), ys=Object.freeze(xs.map((_,i)=>'r'+i).slice(0,${v%5})); assert.deepEqual(solve(xs,ys),ys.map((s,i)=>[xs[i],s])); assert.deepEqual(solve([],[1]),[]); assert.deepEqual(solve([1],[]),[]); assert.deepEqual(solve([1,2],['a']),[[1,'a']]); const x={x:1}; assert.equal(solve([x],[true])[0][0],x);`,
  `const out: [number,string][] = solve([1],['x']); const literal: [1,true][] = solve([1] as const,[true] as const); void out; void literal;`,
  [`solve([1], 'text');`, `const bad: [string,number][] = solve([1],['x']);`, `const bad: [number,string,boolean][] = solve([1],['x']);`, `solve(undefined,[]);`]));
family('Key-safe property projection', 'keyof; indexed access; generic constraints', v => task('',
  '<T, K extends keyof T>(items: readonly T[], key: K): T[K][]',
  'return items.map(item => item[key]);',
  'Project a property from each record in order. The key must belong to the record type; preserve the selected property type including undefined for optional fields. Readonly arrays and symbol keys are supported.',
  `const rows=Object.freeze(${q(data[v])}.map((score,i)=>Object.freeze({score,name:'n'+i}))); assert.deepEqual(solve(rows,'score'),${q(data[v])}); assert.deepEqual(solve(rows,'name'),rows.map(r=>r.name)); assert.deepEqual(solve([],'anything'),[]); const key=Symbol('x'); assert.deepEqual(solve([{[key]:7}],key),[7]); assert.deepEqual(solve([{x:undefined},{x:2}],'x'),[undefined,2]);`,
  `const nums: number[] = solve([{id:1,name:'a'}], 'id'); const labels: string[] = solve([{id:1,name:'a'}], 'name'); const rows: readonly {optional?:number}[] = [{}]; const maybe: (number|undefined)[] = solve(rows,'optional'); void nums; void labels; void maybe;`,
  [`solve([{id:1}], 'missing');`, `const bad: string[] = solve([{id:1}], 'id');`, `const bad: number[] = solve([{}] as {x?:number}[], 'x');`, `solve(1, 'toString');`]));
family('Stable unique by key', 'generic keys; Map/Set equality; readonly', v => task('',
  '<T, K>(items: readonly T[], keyOf: (item: T) => K): T[]',
  'const seen = new Set<K>(); const out: T[] = []; for(const item of items) { const key=keyOf(item); if(!seen.has(key)) { seen.add(key); out.push(item); } } return out;',
  'Keep the first record for each extracted key, preserving order and references. Use SameValueZero key equality (NaN equals NaN, object keys by identity). Invoke keyOf once per input.',
  `const xs=Object.freeze(${q(data[v])}); let calls=0; assert.deepEqual(solve(xs,x=>{calls++;return x;}),[...new Set(xs)]); assert.equal(calls,xs.length); assert.deepEqual(solve([],x=>x),[]); const a={id:1},b={id:1}; assert.equal(solve([a,b],r=>r.id)[0],a); assert.equal(solve([a,b],r=>r).length,2); assert.deepEqual(solve([NaN,NaN,0,-0],x=>x),[NaN,0]);`,
  `const rows: {id:number}[] = solve([{id:1}], row => row.id); const words: string[] = solve(['a'], word => word.length); void rows; void words;`,
  [`solve([1], (x: string) => x);`, `const bad: string[] = solve([1], x => x);`, `solve([1], 2);`, `solve('abc', x => x);`]));
family('Group into typed Map', 'generic Map keys; bucket types', v => task('',
  '<T, K>(items: readonly T[], keyOf: (item: T) => K): Map<K, T[]>',
  'const out=new Map<K,T[]>(); for(const item of items) { const key=keyOf(item); const bucket=out.get(key); if(bucket) bucket.push(item); else out.set(key,[item]); } return out;',
  'Group elements by extractor key. Preserve first-key insertion order, item order, and element references. Support object, symbol and prototype-looking string keys without collisions.',
  `const xs=Object.freeze(${q(data[v])}); const out=solve(xs,x=>x<0?'negative':'other'); assert.deepEqual([...out.values()].flat().sort((a,b)=>a-b),[...xs].sort((a,b)=>a-b)); for(const [k,rows] of out) assert.ok(rows.every(x=>(x<0?'negative':'other')===k)); assert.equal(solve([],x=>x).size,0); const obj={}; const r=solve([1,2],()=>obj); assert.deepEqual(r.get(obj),[1,2]); assert.deepEqual(solve(['__proto__','__proto__'],x=>x).get('__proto__'),['__proto__','__proto__']);`,
  `const bySize: Map<number,string[]> = solve(['a'], x => x.length); const byObj: Map<{key:number},number[]> = solve([1], key => ({key})); void bySize; void byObj;`,
  [`const bad: Map<string,number[]> = solve([1],x=>x);`, `const bad: Map<number,string[]> = solve([1],x=>x);`, `solve([1], (x: string) => x);`, `solve({}, x=>x);`]));
family('Nullish compaction', 'NonNullable; type guards; unions', v => task('',
  '<T>(items: readonly T[]): NonNullable<T>[]',
  'return items.filter((item): item is NonNullable<T> => item !== null && item !== undefined);',
  'Remove only null and undefined. Keep falsy but present values (0, false, empty string, NaN). Return a NonNullable element array without asserting that every falsy value is absent.',
  `const xs=Object.freeze([null,...${q(data[v])},undefined]); assert.deepEqual(solve(xs),${q(data[v])}); assert.deepEqual(solve([0,false,'',null,undefined,NaN]),[0,false,'',NaN]); assert.deepEqual(solve([null,undefined]),[]); assert.deepEqual(solve([]),[]); const obj={}; assert.equal(solve([null,obj])[0],obj);`,
  `const values: number[] = solve([1,null,undefined]); const falsy: (0|false|'')[] = solve([0,false,'',null] as const); const empty: never[] = solve([null,undefined]); void values; void falsy; void empty;`,
  [`const bad: string[] = solve([1,null]);`, `const bad: null[] = solve([1,null]);`, `solve(null);`, `const bad: number[] = solve(['x',undefined]);`]));
family('Predicate-directed extraction', 'user-defined type guards; generic subtypes', v => task('',
  '<T, S extends T>(items: readonly T[], guard: (item: T) => item is S): S[]',
  'return items.filter(guard);',
  'Filter with a user-defined type predicate. Preserve the narrowed subtype in the return type rather than returning the original union. Do not mutate the input.',
  `const xs=Object.freeze([...${q(data[v])},'label',null]); assert.deepEqual(solve(xs,x=>typeof x==='number'),${q(data[v])}); assert.deepEqual(solve(xs,x=>typeof x==='string'),['label']); assert.deepEqual(solve([],()=>false),[]); const row={kind:'yes',value:1}; assert.equal(solve([row,{kind:'no'}],x=>x.kind==='yes')[0],row);`,
  `const xs: readonly (string|number)[] = [1,'x']; const out: string[] = solve(xs,(x): x is string => typeof x === 'string'); const nums: number[] = solve(xs,(x): x is number => typeof x === 'number'); void out; void nums;`,
  [`solve([1,'x'], (x): x is boolean => typeof x === 'boolean');`, `const bad: number[] = solve([1,'x'],(x): x is string => typeof x === 'string');`, `solve([1], (x: string): x is string => true);`, `solve(null, (x: unknown): x is string => typeof x === 'string');`]));
family('First typed search result', 'discriminated unions; generic payloads', v => task(
  `export type SearchResult<T> = {found:true; value:T; index:number} | {found:false};`,
  '<T>(items: readonly T[], predicate: (item:T) => boolean): SearchResult<T>',
  'for(let index=0;index<items.length;index++) { const value=items[index]!; if(predicate(value)) return {found:true,value,index}; } return {found:false};',
  'Return the first matching value and index using a found discriminant. A present undefined value is still a match. Stop calling the predicate after success. Missing result contains only found:false.',
  `const xs=Object.freeze(${q(data[v])}); const i=xs.findIndex(x=>x>0); assert.deepEqual(solve(xs,x=>x>0),i<0?{found:false}:{found:true,value:xs[i],index:i}); assert.deepEqual(solve([],()=>true),{found:false}); assert.deepEqual(solve([undefined],()=>true),{found:true,value:undefined,index:0}); let calls=0; solve([1,2,3],()=>{calls++;return true;}); assert.equal(calls,1); assert.deepEqual(solve([1],()=>false),{found:false});`,
  `const result = solve(['a'],x=>x.length>0); if(result.found) { const s: string = result.value; const n:number=result.index; void s; void n; } else { const missing: {found:false}=result; void missing; }`,
  [`solve([1], (x: string) => true);`, `const r=solve([1],()=>true); r.value;`, `const r=solve([1],()=>true); if(!r.found) r.index;`, `const r=solve([1],()=>true); if(r.found) { const bad:string=r.value; }`]));
family('Typed Result mapping', 'generic success/error unions; callback contracts', v => task(
  `export type Result<T,E> = {ok:true; value:T} | {ok:false; error:E};`,
  '<T, E, U>(result: Result<T,E>, map: (value:T) => U): Result<U,E>',
  'return result.ok ? {ok:true,value:map(result.value)} : result;',
  'Map only a successful Result payload. Preserve the error type and return the exact failure object without invoking the mapper. Propagate mapper exceptions. Success returns a fresh Result.',
  `const xs=${q(data[v])}; assert.deepEqual(solve({ok:true,value:xs},a=>a.length),{ok:true,value:xs.length}); const fail=Object.freeze({ok:false,error:{code:'offline'}}); let calls=0; assert.equal(solve(fail,()=>{calls++;}),fail); assert.equal(calls,0); assert.deepEqual(solve({ok:true,value:0},String),{ok:true,value:'0'}); assert.throws(()=>solve({ok:true,value:1},()=>{throw Error('mapper');}),/mapper/);`,
  `const input: Result<number,'offline'> = {ok:true,value:1}; const result=solve<number,'offline',string>(input,String); if(result.ok) {const s:string=result.value;void s;} else {const e:'offline'=result.error;void e;}`,
  [`solve({ok:true,value:1}, (x:string)=>x);`, `solve({ok:'yes',value:1}, x=>x);`, `solve({ok:false}, x=>x);`, `const r=solve({ok:true,value:1},String); if(r.ok) {const bad:number=r.value;}`]));
family('Collect successful Results', 'union narrowing; error accumulation; tuples', v => task(
  `export type Result<T,E> = {ok:true; value:T} | {ok:false; error:E};`,
  '<T, E>(results: readonly Result<T,E>[]): {values:T[]; errors:E[]}',
  'const values:T[]=[],errors:E[]=[]; for(const result of results) { if(result.ok) values.push(result.value); else errors.push(result.error); } return {values,errors};',
  'Partition successful payloads and errors in arrival order, discarding neither. Empty returns two empty arrays. Preserve payload/error references and narrow on ok, not on truthiness of payload.',
  `const xs=${q(data[v])}; const rows=xs.map(value=>({ok:true,value})); rows.splice(1,0,{ok:false,error:'network'}); assert.deepEqual(solve(rows),{values:xs,errors:['network']}); assert.deepEqual(solve([]),{values:[],errors:[]}); assert.deepEqual(solve([{ok:true,value:0},{ok:false,error:''},{ok:true,value:undefined}]),{values:[0,undefined],errors:['']}); const error={code:2}; assert.equal(solve([{ok:false,error}]).errors[0],error);`,
  `const rows: Result<number,string>[]=[{ok:true,value:1},{ok:false,error:'x'}]; const result=solve(rows); const values:number[]=result.values; const errors:string[]=result.errors; void values;void errors;`,
  [`solve([{ok:true}]);`, `solve([{ok:false,value:1}]);`, `const r=solve<number,string>([{ok:true,value:1}]); const bad:string[]=r.values;`, `solve<number,string>([{ok:false,error:42}]);`]));
family('Generic immutable tree map', 'recursive types; readonly; generic transformation', v => task(
  `export type Tree<T> = {readonly value:T; readonly children: readonly Tree<T>[]};`,
  '<T, U>(tree: Tree<T>, map: (value:T) => U): Tree<U>',
  'return {value:map(tree.value),children:tree.children.map(child=>solve(child,map))};',
  'Recursively transform each node value while preserving child order and shape. Call mapper in preorder. Build fresh nodes/children arrays, never mutate input. Inputs are finite acyclic trees of moderate depth.',
  `const values=${q(data[v])}; const tree=Object.freeze({value:${v},children:Object.freeze(values.map(value=>Object.freeze({value,children:Object.freeze([])})))}); const seen=[]; const out=solve(tree,x=>{seen.push(x);return String(x);}); assert.deepEqual(seen,[${v},...values]); assert.equal(out.value,'${v}'); assert.deepEqual(out.children.map(x=>x.value),values.map(String)); assert.notEqual(out,tree); assert.notEqual(out.children,tree.children); assert.deepEqual(solve({value:null,children:[]},()=>false),{value:false,children:[]});`,
  `const tree:Tree<number>={value:1,children:[]}; const result:Tree<string>=solve(tree,String); const label:string=result.value; void label;`,
  [`solve({value:1},String);`, `solve({value:1,children:[]},(x:string)=>x);`, `const bad:Tree<number>=solve({value:1,children:[]},String);`, `const out=solve({value:1,children:[]},String); out.children.push({value:'x',children:[]});`]));
family('Unknown finite number decoder', 'unknown boundaries; typeof narrowing; Result', v => task(
  `export type Decode = {ok:true; value:number} | {ok:false; error:'not-number'|'not-finite'};`,
  '(input: unknown): Decode',
  `if(typeof input !== 'number') return {ok:false,error:'not-number'}; if(!Number.isFinite(input)) return {ok:false,error:'not-finite'}; return {ok:true,value:input};`,
  'Decode unknown without coercion. Only finite primitive numbers succeed, including zero and negative zero. Wrong type reports not-number, NaN/infinities report not-finite. Return a discriminated result; do not throw on ordinary invalid input.',
  `for(const x of ${q(data[v])}) assert.deepEqual(solve(x),{ok:true,value:x}); for(const x of ['1',null,undefined,{},[],true,new Number(1)]) assert.deepEqual(solve(x),{ok:false,error:'not-number'}); for(const x of [NaN,Infinity,-Infinity]) assert.deepEqual(solve(x),{ok:false,error:'not-finite'}); assert.ok(Object.is(solve(-0).value,-0)); assert.deepEqual(solve(0),{ok:true,value:0});`,
  `const input:unknown={}; const result=solve(input); if(result.ok){const n:number=result.value;void n;} else {const error:'not-number'|'not-finite'=result.error;void error;} solve(Symbol());`,
  [`const result=solve(1); result.value;`, `const result=solve(1); if(result.ok){const wrong:string=result.value;}`, `const result=solve(1); if(!result.ok) result.value;`, `const wrong:number=solve(1);`]));
family('Unknown record decoder', 'unknown object narrowing; exact optional properties', v => task(
  `export type Person = {name:string; age?:number};\nexport type Decode = {ok:true; value:Person} | {ok:false; error:'record'|'name'|'age'};`,
  '(input: unknown): Decode',
  `if(typeof input!=='object'||input===null||Array.isArray(input)) return {ok:false,error:'record'}; if(!Object.hasOwn(input,'name')||!('name' in input)||typeof input.name!=='string'||input.name.trim()==='') return {ok:false,error:'name'}; const value:Person={name:input.name.trim()}; if(Object.hasOwn(input,'age')) { if(!('age' in input)||typeof input.age!=='number'||!Number.isSafeInteger(input.age)||input.age<0) return {ok:false,error:'age'}; value.age=input.age; } return {ok:true,value};`,
  'Decode a plain data-shaped unknown object: own nonblank string name, optional own nonnegative safe-integer age. Trim name and strip extra properties. An own age:undefined is invalid; absent age stays absent. Arrays/null/nonobjects fail record. Validation order: record,name,age. Ignore inherited fields. Assume no throwing getters/proxies.',
  `assert.deepEqual(solve({name:'  User ${v}  ',age:${v},extra:true}),{ok:true,value:{name:'User ${v}',age:${v}}}); assert.deepEqual(solve({name:'Ada'}),{ok:true,value:{name:'Ada'}}); assert.deepEqual(solve({name:' ' ,age:-1}),{ok:false,error:'name'}); for(const age of [undefined,-1,1.2,NaN,Infinity,'1']) assert.deepEqual(solve({name:'A',age}),{ok:false,error:'age'}); for(const x of [null,[],1]) assert.deepEqual(solve(x),{ok:false,error:'record'}); assert.deepEqual(solve(Object.create({name:'inherited'})),{ok:false,error:'name'});`,
  `const result=solve({name:'a'} as unknown); if(result.ok){const name:string=result.value.name;const age:number|undefined=result.value.age;void name;void age;} const p:Person={name:'A'};void p;`,
  [`const bad:Person={name:'A',age:undefined};`, `const bad:Person={name:1};`, `const r=solve({}); r.value;`, `const r=solve({}); if(r.ok){const age:number=r.value.age;}`]));
family('Unknown string array guard', 'type predicates; unknown; readonly arrays', v => task('',
  '(input: unknown): input is readonly string[]',
  `return Array.isArray(input) && Array.from(input).every(item => typeof item === 'string');`,
  'Return a type predicate recognizing arrays whose every element is a primitive string. Empty arrays pass. Sparse holes count as undefined and must fail. Do not coerce elements; do not mutate the input. Successful narrowing exposes a readonly string array.',
  `assert.equal(solve(${q(data[v].map(String))}),true); assert.equal(solve(Object.freeze(['a',''])),true); assert.equal(solve([]),true); for(const x of [null,'abc',{},[1],['a',undefined],new Array(2)]) assert.equal(solve(x),false); assert.equal(solve(['a',new String('x')]),false);`,
  `const input:unknown=['a']; if(solve(input)){const first:string|undefined=input[0];const rows:readonly string[]=input;void first;void rows;}`,
  [`const input:unknown=[]; if(solve(input)){input.push('a');}`, `const input:unknown=[]; if(solve(input)){const bad:number|undefined=input[0];}`, `const output:string=solve([]);`, `const input:unknown=[]; input[0];`]));
family('Tagged shape measurement', 'exhaustive discriminated unions; never', v => task(
  `export type Shape = {kind:'circle'; radius:number} | {kind:'rectangle'; width:number; height:number} | {kind:'triangle'; base:number; height:number};`,
  '(shape: Shape): number',
  `switch(shape.kind){case 'circle': return Math.PI*shape.radius**2; case 'rectangle': return shape.width*shape.height; case 'triangle':return shape.base*shape.height/2; default:{const exhaustive:never=shape;return exhaustive;}}`,
  'Compute area from a circle, rectangle or triangle discriminated union. Dimensions are finite nonnegative numbers. Narrow by kind and exhaust every case with never, rather than reading properties shared by only some variants.',
  `const n=${v+1}; assert.equal(solve({kind:'circle',radius:n}),Math.PI*n**2); assert.equal(solve({kind:'rectangle',width:n,height:2}),n*2); assert.equal(solve({kind:'triangle',base:n,height:3}),n*1.5); assert.equal(solve({kind:'circle',radius:0}),0); assert.equal(solve({kind:'rectangle',width:0,height:9}),0); const shape=Object.freeze({kind:'triangle',base:4,height:2}); assert.equal(solve(shape),4);`,
  `const n:number=solve({kind:'circle',radius:2}); const shapes:readonly Shape[]=[{kind:'rectangle',width:1,height:2}]; shapes.map(solve);void n;`,
  [`solve({kind:'circle',width:2});`, `solve({kind:'square',width:2});`, `solve({kind:'triangle',base:2});`, `solve({kind:'rectangle',width:'2',height:3});`]));
family('Exhaustive counter reducer', 'tagged actions; immutable state; readonly', v => task(
  `export type State = {readonly value:number; readonly history:readonly number[]};\nexport type Action = {type:'add'; amount:number}|{type:'multiply';factor:number}|{type:'reset'};`,
  '(state: State, action: Action): State',
  `let value:number; switch(action.type){case 'add':value=state.value+action.amount;break;case 'multiply':value=state.value*action.factor;break;case 'reset':value=0;break;default:{const exhaustive:never=action;return exhaustive;}} return {value,history:[...state.history,value]};`,
  'Apply add, multiply or reset. Every action appends the resulting value to history, including no-op arithmetic/reset. Return fresh state and history; leave previous state untouched. Inputs and arithmetic are finite.',
  `const state=Object.freeze({value:${v},history:Object.freeze([${v}])}); assert.deepEqual(solve(state,{type:'add',amount:2}),{value:${v+2},history:[${v},${v+2}]}); assert.deepEqual(solve(state,{type:'multiply',factor:-1}),{value:-${v},history:[${v},-${v}]}); assert.deepEqual(solve(state,{type:'reset'}),{value:0,history:[${v},0]}); assert.deepEqual(state,{value:${v},history:[${v}]}); const result=solve(state,{type:'add',amount:0}); assert.notEqual(result,state);assert.notEqual(result.history,state.history);`,
  `const s:State=solve({value:1,history:[]},{type:'add',amount:2});const value:number=s.value;void value;`,
  [`solve({value:0,history:[]},{type:'add'});`, `solve({value:0,history:[]},{type:'reset',amount:2});`, `solve({value:0,history:[]},{type:'divide',factor:2});`, `const s=solve({value:0,history:[]},{type:'reset'}); s.history.push(1);`]));
family('Own-property typed pick', 'Pick; keyof; symbol keys; mapped results', v => task('',
  '<T extends object, K extends keyof T>(input: T, keys: readonly K[]): Pick<T,K>',
  `const out = {} as Pick<T,K>; for(const key of keys){if(!Object.hasOwn(input,key)) throw new Error('Missing own key'); Object.defineProperty(out,key,{value:input[key],enumerable:true,writable:true,configurable:true});} return out;`,
  'Copy the requested own keys into a fresh object, preserving key-specific value types and optional/readonly modifiers statically. Duplicate requested keys are harmless. Missing own keys throw Error("Missing own key") even if inherited. Support symbols and __proto__ safely. A localized assertion while constructing Pick is acceptable.',
  `const input=Object.freeze({id:${v},name:'user',active:true}); assert.deepEqual(solve(input,['id','name']),{id:${v},name:'user'}); assert.deepEqual(solve(input,[]),{}); assert.deepEqual(solve(input,['id','id']),{id:${v}}); const key=Symbol(); assert.equal(solve({[key]:4},[key])[key],4); const tricky=JSON.parse('{"__proto__":5}');assert.equal(Object.getOwnPropertyDescriptor(solve(tricky,['__proto__']),'__proto__').value,5);assert.throws(()=>solve(Object.create({id:1}),['id']),/Missing own key/);`,
  `const result=solve({id:1,name:'A'},['id']); const id:number=result.id; const readonly=solve({id:1} as const,['id']); const exact:1=readonly.id;void id;void exact;`,
  [`solve({id:1},['missing']);`, `const r=solve({id:1,name:'A'},['id']);r.name;`, `const r=solve({id:1},['id']);const bad:string=r.id;`, `const r=solve({id:1} as const,['id']);r.id=2;`]));
family('Immutable typed property replacement', 'keyof; indexed assignment; NoInfer', v => task('',
  '<T extends object, K extends keyof T>(input: T, key: K, value: NoInfer<Required<T>[K]>): T',
  'return {...input,[key]:value};',
  'Return a shallow copy with one existing property replaced. Key must belong to T; value must match Required<T>[K] (the present-property type) without widening inferred T to accept an invalid value. Preserve other properties and references. Works with symbols. NoInfer is available in TS 5.9.3.',
  `const nested={x:1};const input=Object.freeze({count:${v},name:'a',nested});const out=solve(input,'count',${v+1});assert.deepEqual(out,{count:${v+1},name:'a',nested});assert.notEqual(out,input);assert.equal(out.nested,nested);assert.equal(input.count,${v});const key=Symbol();assert.equal(solve({[key]:1},key,2)[key],2);assert.deepEqual(solve({x:null},'x',null),{x:null});`,
  `const r=solve({id:1,name:'A'},'id',2); const n:number=r.id; const s:string=r.name; const optional:{name?:string}={};solve(optional,'name','present');void n;void s;`,
  [`solve({id:1},'missing',2);`, `solve({id:1},'id','2');`, `solve({id:1,name:'A'},'name',2);`, `solve({id:1} as const,'id',2);`]));
family('Typed object value mapping', 'mapped types; own string keys; generic callbacks', v => task(
  `export type StringMap<T,R> = {[K in keyof T as K extends string ? K : never]:R};`,
  '<T extends object, R>(input:T, map:(value:T[Extract<keyof T,string>], key:Extract<keyof T,string>)=>R): StringMap<T,R>',
  `const out={} as StringMap<T,R>; for(const key of Object.keys(input) as Extract<keyof T,string>[]) Object.defineProperty(out,key,{value:map(input[key],key),enumerable:true,writable:true,configurable:true});return out;`,
  'Transform each own enumerable string-keyed value with a callback. Preserve string key names in the result type, drop symbol keys; numeric-only key declarations are outside the domain. Map in Object.keys order. Handle __proto__ as an ordinary own property. Localized assertions to bridge Object.keys are permitted.',
  `const input=Object.freeze({a:${v},b:${v+1}});const seen=[];assert.deepEqual(solve(input,(value,key)=>{seen.push(key);return value*2;}),{a:${v*2},b:${(v+1)*2}});assert.deepEqual(seen,['a','b']);assert.deepEqual(solve({},String),{});const key=Symbol();assert.deepEqual(solve({a:1,[key]:2},String),{a:'1'});const out=solve(JSON.parse('{"__proto__":3}'),x=>x+1);assert.equal(Object.getOwnPropertyDescriptor(out,'__proto__').value,4);`,
  `const r=solve({a:1,b:2},(value,key)=>key+value);const a:string=r.a;const b:string=r.b;void a;void b;`,
  [`const r=solve({a:1},String);r.missing;`, `const r=solve({a:1},String);const bad:number=r.a;`, `solve({a:1},(value:string)=>value);`, `solve(null,String);`]));
family('Exact optional settings patch', 'Partial; exactOptionalPropertyTypes; immutable merge', v => task(
  `export type Settings = {readonly name:string; readonly retries:number; readonly enabled:boolean};\nexport type Patch = Partial<Settings>;`,
  '(settings:Settings, patch:Patch): Settings',
  'return {...settings,...patch};',
  'Apply an optional subset of settings name/retries/enabled to a fresh object. Absent patch keys retain old values; false, zero and empty string are real replacements. Explicit undefined is forbidden by exactOptionalPropertyTypes. Leave both arguments unchanged.',
  `const settings=Object.freeze({name:'v${v}',retries:${v},enabled:true});const patch=Object.freeze({retries:0,enabled:false});assert.deepEqual(solve(settings,patch),{name:'v${v}',retries:0,enabled:false});assert.deepEqual(solve(settings,{name:''}),{name:'',retries:${v},enabled:true});const out=solve(settings,{});assert.deepEqual(out,settings);assert.notEqual(out,settings);assert.deepEqual(patch,{retries:0,enabled:false});assert.deepEqual(settings,{name:'v${v}',retries:${v},enabled:true});`,
  `const settings:Settings={name:'a',retries:2,enabled:true};const patch:Patch={enabled:false};const out:Settings=solve(settings,patch);solve(settings,{});void out;`,
  [`const p:Patch={name:undefined};`, `solve({name:'a',retries:2,enabled:true},{retries:'3'});`, `solve({name:'a',retries:2,enabled:true},{missing:1});`, `const r=solve({name:'a',retries:2,enabled:true},{});r.enabled=false;`]));
family('Runtime-frozen readonly snapshot', 'Readonly mapped type; shallow copy semantics', v => task('',
  '<T extends object>(input:T): Readonly<T>',
  'return Object.freeze({...input});',
  'Return a fresh shallow-frozen object snapshot. The return type forbids top-level assignment; nested values retain their original types and references (not a deep freeze). Copy enumerable own properties including symbols; do not freeze or mutate the input.',
  `const nested={value:1};const input={count:${v},nested};const out=solve(input);assert.notEqual(out,input);assert.deepEqual(out,input);assert.ok(Object.isFrozen(out));assert.ok(!Object.isFrozen(input));assert.equal(out.nested,nested);assert.ok(!Object.isFrozen(nested));assert.throws(()=>Object.defineProperty(out,'count',{value:${v+100}}),TypeError);const key=Symbol();assert.equal(solve({[key]:2})[key],2);`,
  `const result=solve({id:1,nested:{value:2}});const id:number=result.id;result.nested.value=3;const copy:Readonly<{id:number}>=result;void id;void copy;`,
  [`const r=solve({id:1});r.id=2;`, `const r=solve({id:1});r.other=2;`, `solve(null);`, `const r=solve({id:1});const bad:string=r.id;`]));
family('Minimum nonempty tuple', 'nonempty tuples; generic comparison; safe indexing', v => task('',
  '<T>(items: readonly [T,...T[]], compare:(a:T,b:T)=>number): T',
  'let best=items[0];for(const item of items.slice(1)) if(compare(item,best)<0) best=item;return best;',
  'Return the smallest element of a statically nonempty tuple according to compare. Keep the first on ties and preserve its reference. Empty arrays must be rejected by the compiler; do not add an undefined return for impossible typed emptiness.',
  `const xs=Object.freeze([${v},...${q(data[v])}]);assert.equal(solve(xs,(a,b)=>a-b),Math.min(...xs));const a={score:1},b={score:1};assert.equal(solve([a,b],(x,y)=>x.score-y.score),a);assert.equal(solve(['z','a'],(a,b)=>a.localeCompare(b)),'a');let calls=0;assert.equal(solve([42],()=>{calls++;return 0;}),42);assert.equal(calls,0);`,
  `const n:number=solve([1,2],(a,b)=>a-b);const literal:1|2=solve([1,2] as const,(a,b)=>a-b);const word:string=solve(['a'],(a,b)=>a.localeCompare(b));void n;void literal;void word;`,
  [`solve([], (a:number,b:number)=>a-b);`, `const xs:number[]=[1];solve(xs,(a,b)=>a-b);`, `solve([1],(a:string,b:string)=>a.localeCompare(b));`, `const bad:undefined=solve([1],(a,b)=>a-b);`]));
family('Literal pair constructor', 'const type parameters; readonly tuples; inference', v => task('',
  '<const A, const B>(first:A, second:B): readonly [A,B]',
  'return [first,second] as const;',
  'Construct a readonly pair preserving literal inference for both independent arguments. Return their exact references in order, not copies. Readonly is a compile-time tuple contract; no runtime freeze is required.',
  `const a={values:${q(data[v])}},b={label:'${v}'};const result=solve(a,b);assert.equal(result[0],a);assert.equal(result[1],b);assert.equal(result.length,2);assert.deepEqual(solve(0,false),[0,false]);assert.deepEqual(solve(null,undefined),[null,undefined]);assert.deepEqual(solve('a',${v}),['a',${v}]);`,
  `const pair=solve('ready',3);const exact:readonly ['ready',3]=pair;const obj=solve({name:'A'},[1,2]);const name:'A'=obj[0].name;const values:readonly [1,2]=obj[1];void exact;void name;void values;`,
  [`const p=solve('a',1);p[0]='a';`, `const p=solve('a',1);const bad:readonly [1,'a']=p;`, `solve(1);`, `const p=solve('a',1);const bad:2=p[1];`]));
family('Two-stage typed composition', 'higher-order generics; inference; callback variance', v => task('',
  '<A,B,C>(first:(input:A)=>B, second:(input:B)=>C): (input:A)=>C',
  'return input=>second(first(input));',
  'Compose first then second into a unary function. Preserve initial input and final output types; reject incompatible intermediate types. Do not invoke either callback until the returned function is called. Propagate exceptions.',
  `let calls=[];const f=solve(x=>{calls.push('first');return x+${v};},n=>{calls.push('second');return String(n);});assert.deepEqual(calls,[]);assert.equal(f(2),'${v+2}');assert.deepEqual(calls,['first','second']);assert.equal(f(0),'${v}');assert.throws(()=>solve(()=>{throw Error('first');},()=>{throw Error('second');})(0),/first/);assert.equal(solve(x=>x.length,n=>n>0)(''),false);`,
  `const run=solve((n:number)=>String(n),(s:string)=>s.length);const out:number=run(1);const other:(s:string)=>boolean=solve((s:string)=>s.length,n=>n>0);void out;void other;`,
  [`solve((n:number)=>String(n),(n:number)=>n+1);`, `const f=solve((n:number)=>String(n),s=>s.length);f('1');`, `const f=solve((n:number)=>String(n),s=>s.length);const bad:string=f(1);`, `solve(1,(n:number)=>n);`]));
family('Nullish fallback without falsy loss', 'generic inference; nullish unions; NoInfer', v => task('',
  '<T>(value:T|null|undefined, fallback:NoInfer<T>): T',
  'return value ?? fallback;',
  'Use fallback only when value is null or undefined. Preserve false, zero, empty string and NaN. The fallback must match the explicitly supplied/inferred T rather than broadening it. Pass a type argument when the only value available is null.',
  `assert.equal(solve(${v},99),${v});assert.equal(solve(null,99),99);assert.equal(solve(undefined,99),99);assert.equal(solve(0,99),0);assert.equal(solve(false,true),false);assert.equal(solve('','fallback'),'');assert.ok(Number.isNaN(solve(NaN,1)));const obj={};assert.equal(solve(null,obj),obj);`,
  `const n:number=solve<number>(null,1);const word:string=solve<string>('','fallback');const obj:{id:number}=solve<{id:number}>(undefined,{id:1});void n;void word;void obj;`,
  [`solve<number>(null,'1');`, `solve<boolean>(undefined,0);`, `const bad:string=solve<number>(null,1);`, `solve<{id:number}>(null,{});`]));
family('Flatten readonly generic layers', 'nested readonly; generic element preservation', v => task('',
  '<T>(groups: readonly (readonly T[])[]): T[]',
  'const out:T[]=[];for(const group of groups) out.push(...group);return out;',
  'Flatten exactly one array level, preserving element order, duplicates and references. Readonly inner and outer arrays are accepted. Deeper arrays remain values, not recursively flattened. Return a fresh mutable array.',
  `const xs=${q(data[v])};const groups=Object.freeze([Object.freeze(xs.slice(0,2)),Object.freeze([]),Object.freeze(xs.slice(2))]);assert.deepEqual(solve(groups),xs);assert.deepEqual(solve([]),[]);assert.deepEqual(solve([[],[]]),[]);const obj={};assert.equal(solve([[obj]])[0],obj);const nested=[1,2];assert.equal(solve([[nested]])[0],nested);assert.deepEqual(solve([['a'],['b','b']]),['a','b','b']);`,
  `const n:number[]=solve([[1],[2]] as const);const lit:(1|2)[]=solve([[1],[2]] as const);const deeper:number[][]=solve([[[1,2]]]);void n;void lit;void deeper;`,
  [`solve([1,2]);`, `const bad:string[]=solve([[1]]);`, `const bad:number[]=solve([[[1,2]]]);`, `solve(null);`]));
family('Generic frequency map', 'generic Map keys; SameValueZero; readonly', v => task('',
  '<T>(items:readonly T[]): Map<T,number>',
  'const out=new Map<T,number>();for(const item of items)out.set(item,(out.get(item)??0)+1);return out;',
  'Count occurrences by SameValueZero equality, preserving first occurrence order of keys. Object keys use identity; NaN equals NaN. Return a fresh Map with the original key types and positive integer counts. Never mutate input.',
  `const xs=Object.freeze(${q(data[v])});const out=solve(xs);assert.equal([...out.values()].reduce((a,b)=>a+b,0),xs.length);for(const key of new Set(xs))assert.equal(out.get(key),xs.filter(x=>Object.is(x,key)).length);assert.deepEqual([...solve([])],[]);assert.deepEqual([...solve(['a','b','a'])],[['a',2],['b',1]]);const a={},b={};const objects=solve([a,b,a]);assert.equal(objects.get(a),2);assert.equal(objects.get(b),1);assert.equal(solve([NaN,NaN]).get(NaN),2);assert.equal(solve([0,-0]).get(0),2);`,
  `const counts:Map<'a'|'b',number>=solve(['a','b'] as const);const objects:Map<{id:number},number>=solve([{id:1}]);void counts;void objects;`,
  [`solve(1);`, `const bad:Map<string,number>=solve([1]);`, `const bad:Map<number,string>=solve([1]);`, `const counts=solve(['a'] as const);counts.get('b');`]));
// Final track: more advanced contracts and asynchronous composition.
family('Variadic call forwarding', 'variadic tuple inference; Parameters; ReturnType', v => task('',
  '<Args extends unknown[], R>(fn:(...args:Args)=>R, ...args:Args): R',
  'return fn(...args);',
  'Call a function once with its typed positional arguments, preserving tuple arity, optional parameters and return type. Return its exact result/reference; propagate exceptions. No implicit this binding is supplied.',
  `let calls=0;assert.equal(solve((a,b)=>{calls++;return a+b;},${v},2),${v+2});assert.equal(calls,1);assert.equal(solve(()=>42),42);assert.equal(solve((a,b=3)=>a+b,2),5);const obj={};assert.equal(solve(x=>x,obj),obj);assert.throws(()=>solve(()=>{throw Error('callback');}),/callback/);`,
  `const n:number=solve((a:number,b:string)=>a+b.length,1,'x');const s:string=solve(()=> 'x');solve((a:number,b?:string)=>a,1);void n;void s;`,
  [`solve((a:number,b:string)=>a,1);`, `solve((a:number)=>a,'1');`, `solve(()=>1,2);`, `const bad:string=solve((n:number)=>n,1);`]));
family('Typed asynchronous Result capture', 'Promise; unknown catch values; generic Awaited', v => task(
  `export type Result<T> = {ok:true;value:T}|{ok:false;error:unknown};`,
  '<T>(work:()=>T|PromiseLike<T>): Promise<Result<Awaited<T>>>',
  'return (async()=>{try{return {ok:true,value:await work()};}catch(error:unknown){return {ok:false,error};}})();',
  'Invoke a sync or async thunk once and await its result. Convert throws/rejections into an error:unknown result, preserving the original thrown value. Successful results use Awaited<T>. Never assume thrown values are Error objects.',
  `assert.deepEqual(await solve(()=>${v}),{ok:true,value:${v}});assert.deepEqual(await solve(()=>Promise.resolve('x')),{ok:true,value:'x'});const error={code:2};assert.equal((await solve(()=>{throw error;})).error,error);assert.deepEqual(await solve(()=>Promise.reject('offline')),{ok:false,error:'offline'});let calls=0;await solve(()=>{calls++;return undefined;});assert.equal(calls,1);assert.deepEqual(await solve(()=>null),{ok:true,value:null});`,
  `const pending:Promise<Result<number>>=solve(async()=>1);const plain:Promise<Result<string>>=solve(()=> 'x');async function check(){const r=await solve(()=>1);if(r.ok){const n:number=r.value;void n;}else{const e:unknown=r.error;void e;}}void pending;void plain;void check;`,
  [`solve(1);`, `const bad:Promise<Result<string>>=solve(()=>1);`, `async function bad(){const r=await solve(()=>1);if(!r.ok) r.error.message;}`, `async function bad(){const r=await solve(()=>1);r.value;}`]));
family('Sequential typed async mapping', 'async generics; readonly inputs; sequencing', v => task('',
  '<T,U>(items:readonly T[], map:(item:T,index:number)=>U|PromiseLike<U>): Promise<Awaited<U>[]>',
  'return (async()=>{const out:Awaited<U>[]=[];for(let i=0;i<items.length;i++)out.push(await map(items[i]!,i));return out;})();',
  'Map items sequentially: await each result before starting the next. Preserve output order and inferred awaited element type. Stop on the first thrown/rejected callback and propagate its value. Empty resolves [].',
  `const xs=Object.freeze(${q(data[v])});let active=0,max=0;const seen=[];const out=await solve(xs,async(x,i)=>{active++;max=Math.max(max,active);seen.push(i);await Promise.resolve();active--;return String(x);});assert.deepEqual(out,xs.map(String));assert.deepEqual(seen,xs.map((_,i)=>i));assert.ok(max<=1);assert.deepEqual(await solve([],x=>x),[]);const visits=[];await assert.rejects(()=>solve([1,2,3],async x=>{visits.push(x);if(x===2)throw Error('stop');return x;}),/stop/);assert.deepEqual(visits,[1,2]);assert.deepEqual(await solve(['a'],x=>x.length),[1]);`,
  `const a:Promise<string[]>=solve([1,2],async n=>String(n));const b:Promise<number[]>=solve(['a'],s=>s.length);void a;void b;`,
  [`solve([1],(s:string)=>s);`, `const bad:Promise<string[]>=solve([1],n=>n);`, `solve(null,x=>x);`, `const bad:number[]=solve([1],n=>n);`]));
family('Exact tuple Promise resolution', 'mapped tuples; Awaited; readonly removal', v => task('',
  '<const T extends readonly unknown[]>(items:T): Promise<{ -readonly [K in keyof T]: Awaited<T[K]> }>',
  'return Promise.all(items);',
  'Resolve a heterogeneous tuple concurrently using Promise.all semantics. Preserve each tuple position and recursively awaited type; return a mutable result tuple. Reject when any input rejects. Accept raw values and PromiseLike values.',
  `assert.deepEqual(await solve([Promise.resolve(${v}),'x',true]),[${v},'x',true]);assert.deepEqual(await solve([]),[]);const obj={};assert.equal((await solve([obj]))[0],obj);await assert.rejects(()=>solve([Promise.reject(Error('failed')),1]),/failed/);assert.deepEqual(await solve([{then:resolve=>resolve(3)},null]),[3,null]);`,
  `const out:Promise<[number,'a',true]>=solve([Promise.resolve(1),'a',true] as const);async function check(){const r=await solve([Promise.resolve(1),'x'] as const);r[0]=2;const word:'x'=r[1];void word;}void out;void check;`,
  [`solve(1);`, `const bad:Promise<[string,number]>=solve([Promise.resolve(1),'x'] as const);`, `async function bad(){const r=await solve([1,'x'] as const);r[2];}`, `async function bad(){const r=await solve([Promise.resolve(1),'x'] as const);r[0]='x';}`]));
family('Key-correlated event publisher', 'keyof event maps; NoInfer payloads; callbacks', v => task(
  `export type Events={saved:{id:string}; progress:{completed:number;total:number}; closed:undefined};`,
  '<K extends keyof Events>(event:K, payload:NoInfer<Events[K]>, send:(event:K,payload:Events[K])=>void): void',
  'send(event,payload);',
  'Publish exactly once to the supplied transport callback. Event names constrain their payload shape; a closed event still requires the explicit undefined argument. Preserve payload reference. No external effects except invoking send; propagate send errors.',
  `const payload={id:'r${v}'};const calls=[];assert.equal(solve('saved',payload,(...args)=>calls.push(args)),undefined);assert.equal(calls.length,1);assert.equal(calls[0][0],'saved');assert.equal(calls[0][1],payload);solve('progress',{completed:${v},total:20},(event,p)=>{assert.equal(event,'progress');assert.equal(p.completed,${v});});solve('closed',undefined,(event,p)=>{assert.equal(event,'closed');assert.equal(p,undefined);});assert.throws(()=>solve('closed',undefined,()=>{throw Error('send');}),/send/);`,
  `solve('saved',{id:'a'},(event,payload)=>{const e:'saved'=event;const id:string=payload.id;void e;void id;});solve('closed',undefined,()=>{});solve('progress',{completed:1,total:2},(_,p)=>{const n:number=p.total;void n;});`,
  [`solve('saved',{completed:1,total:2},()=>{});`, `solve('missing',undefined,()=>{});`, `solve('closed',{},()=>{});`, `solve('progress',{completed:1},()=>{});`]));
family('Discriminant-selected union extraction', 'Extract; indexed access; generic unions', v => task('',
  "<T extends {kind:string}, K extends T['kind']>(items:readonly T[], kind:K): Extract<T,{kind:K}>[]",
  'return items.filter((item):item is Extract<T,{kind:K}>=>item.kind===kind);',
  'Select records with a matching kind. Given a discriminated union, the returned array contains only the selected union member type via Extract. Preserve order and object identity. K must be a member of the input kind union.',
  `const a={kind:'text',value:'v${v}'},b={kind:'count',value:${v}};const input=Object.freeze([a,b,a]);assert.deepEqual(solve(input,'text'),[a,a]);assert.equal(solve(input,'count')[0],b);assert.deepEqual(solve([],'text'),[]);assert.deepEqual(solve([a],'count'),[]);assert.equal(input.length,3);`,
  `type Event={kind:'text';text:string}|{kind:'count';count:number};const rows:Event[]=[{kind:'text',text:'a'},{kind:'count',count:1}];const out=solve(rows,'text');const exact:{kind:'text';text:string}[]=out;void exact;`,
  [`type E={kind:'a';a:number}|{kind:'b';b:string};solve([] as E[],'c');`, `const r=solve([{kind:'a' as const,a:1}],'a');r[0]!.b;`, `const r=solve([{kind:'a' as const,a:1}],'a');const bad:string=r[0]!.a;`, `solve([1],'a');`]));
family('Result-producing flatMap', 'generic union composition; error unions', v => task(
  `export type Result<T,E>={ok:true;value:T}|{ok:false;error:E};`,
  '<T,E,U,F>(input:Result<T,E>, next:(value:T)=>Result<U,F>): Result<U,E|F>',
  'return input.ok ? next(input.value) : input;',
  'Chain a Result-returning function without nesting Results. Successful input invokes next once; failure returns the same input object without invoking next. Output combines the original and next error types. Propagate callback exceptions.',
  `assert.deepEqual(solve({ok:true,value:${v}},n=>({ok:true,value:String(n)})),{ok:true,value:'${v}'});assert.deepEqual(solve({ok:true,value:0},()=>({ok:false,error:'empty'})),{ok:false,error:'empty'});const fail={ok:false,error:{code:1}};let calls=0;assert.equal(solve(fail,()=>{calls++;}),fail);assert.equal(calls,0);const out={ok:true,value:null};assert.equal(solve({ok:true,value:1},()=>out),out);assert.throws(()=>solve({ok:true,value:1},()=>{throw Error('next');}),/next/);`,
  `const input:Result<number,'first'>={ok:true,value:1};const out=solve<number,'first',string,'second'>(input,n=>({ok:true,value:String(n)}));if(out.ok){const s:string=out.value;void s;}else{const e:'first'|'second'=out.error;void e;}`,
  [`solve({ok:true,value:1},(s:string)=>({ok:true as const,value:s}));`, `solve({ok:true,value:1},n=>n);`, `solve({ok:false},n=>({ok:true as const,value:n}));`, `const r=solve({ok:true,value:1},n=>({ok:true as const,value:String(n)}));if(r.ok){const bad:number=r.value;}`]));
family('Branded identifier validation', 'unique symbol branding; unknown validation; nominal types', v => task(
  `declare const idBrand:unique symbol;\nexport type UserId=string & {readonly [idBrand]:'UserId'};\nexport type Decode={ok:true;value:UserId}|{ok:false;error:'invalid-id'};`,
  '(input:unknown): Decode',
  `return typeof input==='string' && /^usr_[1-9][0-9]*$/.test(input) && !input.includes('\\n') && !input.includes('\\r') ? {ok:true,value:input as UserId} : {ok:false,error:'invalid-id'};`,
  'Validate usr_ followed by a positive decimal integer with no leading zero. Successful strings are branded UserId; invalid unknown inputs return invalid-id without coercion or trimming. Keep the original string. A single cast after validation creates the brand; arbitrary plain strings must not assign to UserId.',
  `assert.deepEqual(solve('usr_${v+1}'),{ok:true,value:'usr_${v+1}'});assert.deepEqual(solve('usr_99999999999999999999'),{ok:true,value:'usr_99999999999999999999'});for(const value of ['usr_0','usr_01','usr_-1','usr_1.2',' usr_1','usr_1\\n','item_1',null,1,{}])assert.deepEqual(solve(value),{ok:false,error:'invalid-id'});`,
  `const r=solve('usr_1');if(r.ok){const id:UserId=r.value;const text:string=id;void text;}function consume(id:UserId){return id;}void consume;`,
  [`const id:UserId='usr_1';`, `const r=solve('usr_1');r.value;`, `const r=solve('usr_1');if(r.ok){const bad:number=r.value;}`, `function consume(id:UserId){} consume('usr_1');`]));
family('Typed leaf path lookup', 'nested keyof; indexed access; optional values', v => task('',
  '<T, K1 extends keyof T, K2 extends keyof NonNullable<T[K1]>>(input:T, path:readonly [K1,K2]): NonNullable<T[K1]>[K2] | undefined',
  'const parent=input[path[0]]; if(parent===null||parent===undefined)return undefined;return parent[path[1]];',
  'Read a two-key path. First key belongs to T; second belongs to the non-nullable parent type. Missing/nullish parent returns undefined. Preserve leaf type and never coerce keys. Exactly two path positions; readonly tuples accepted.',
  `assert.equal(solve({user:{name:'v${v}',age:${v}}},['user','age']),${v});assert.equal(solve({user:null},['user','name']),undefined);assert.equal(solve({},['user','name']),undefined);assert.equal(solve({user:{name:''}},['user','name']),'');assert.equal(solve({user:{enabled:false}},['user','enabled']),false);const key=Symbol();assert.equal(solve({user:{[key]:3}},['user',key]),3);`,
  `const input:{user?:{name:string;age:number}}={};const name:string|undefined=solve(input,['user','name']);const age:number|undefined=solve(input,['user','age'] as const);void name;void age;`,
  [`solve({user:{name:'a'}},['missing','name']);`, `solve({user:{name:'a'}},['user','age']);`, `const bad:number|undefined=solve({user:{name:'a'}},['user','name']);`, `solve({user:{name:'a'}},['user']);`]));
family('Template-literal field events', 'template literal types; mapped keys; keyof', v => task(
  `export type Field={name:string;age:number;enabled:boolean};\nexport type Change<K extends keyof Field>={event:\`\${K}Changed\`;value:Field[K]};`,
  '<K extends keyof Field>(key:K, value:NoInfer<Field[K]>): Change<K>',
  'return {event:`${key}Changed`,value};',
  'Create a field change envelope with event `${key}Changed` and the corresponding field value. Preserve the specific event literal and payload type in the return. Reject unknown fields and mismatched payloads instead of widening the key.',
  `assert.deepEqual(solve('age',${v}),{event:'ageChanged',value:${v}});assert.deepEqual(solve('name','v${v}'),{event:'nameChanged',value:'v${v}'});assert.deepEqual(solve('enabled',false),{event:'enabledChanged',value:false});assert.deepEqual(solve('name',''),{event:'nameChanged',value:''});assert.deepEqual(solve('age',0),{event:'ageChanged',value:0});`,
  `const r=solve('age',1);const event:'ageChanged'=r.event;const value:number=r.value;const word:string=solve('name','a').value;void event;void value;void word;`,
  [`solve('age','1');`, `solve('name',1);`, `solve('missing',true);`, `const bad:'nameChanged'=solve('age',1).event;`]));
family('Typed function memoization', 'generic closures; Map cache; undefined results', v => task('',
  '<A,R>(fn:(input:A)=>R): (input:A)=>R',
  'const cache=new Map<A,R>();return input=>{if(cache.has(input))return cache.get(input)!;const result=fn(input);cache.set(input,result);return result;};',
  'Memoize a unary function using SameValueZero input keys. Cache falsy and undefined results, preserve object identity keys, and do not cache thrown errors. Each constructed memoizer has an independent cache. Returned function preserves input/output types; no eviction or serialization.',
  `let calls=0;const memo=solve(x=>{calls++;return x*2;});assert.equal(memo(${v}),${v*2});assert.equal(memo(${v}),${v*2});assert.equal(calls,1);let emptyCalls=0;const empty=solve(()=>{emptyCalls++;return undefined;});assert.equal(empty(1),undefined);assert.equal(empty(1),undefined);assert.equal(emptyCalls,1);const a={},b={};let objects=0;const obj=solve(()=>++objects);assert.equal(obj(a),1);assert.equal(obj(b),2);assert.equal(obj(a),1);let errors=0;const bad=solve(()=>{errors++;throw Error('retry');});assert.throws(()=>bad(1),/retry/);assert.throws(()=>bad(1),/retry/);assert.equal(errors,2);let nanCalls=0;const nan=solve(()=>++nanCalls);assert.equal(nan(NaN),1);assert.equal(nan(NaN),1);`,
  `const run:(n:number)=>string=solve((n:number)=>String(n));const out:string=run(1);const id=solve((x:{id:number})=>x.id);const n:number=id({id:1});void out;void n;`,
  [`const run=solve((n:number)=>String(n));run('1');`, `const run=solve((n:number)=>String(n));const bad:number=run(1);`, `solve(1);`, `const run=solve((x:{id:number})=>x.id);run({id:'1'});`]));

assert.equal(families.length,39,'39 distinct API families');
const options={target:'ES2022',module:'CommonJS',moduleResolution:'Node',strict:true,noUncheckedIndexedAccess:true,exactOptionalPropertyTypes:true,useUnknownInCatchVariables:true,noImplicitReturns:true,noFallthroughCasesInSwitch:true,skipLibCheck:true,types:[],noEmitOnError:true,forceConsistentCasingInFileNames:true};
const typeHelpers=`type Assert<T extends true> = T;\ntype NotAny<T> = 0 extends (1 & T) ? false : true;\ntype SafeFunction = Assert<NotAny<typeof solve>>;\n`;
const verifier = (count,start,end) => `'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const manifest=require('./manifest.json');
const args=process.argv.slice(2);let id=null,starter=false;
for(let i=0;i<args.length;i++){
 const arg=args[i];if(arg==='--starters')starter=true;
 else if(arg==='--id'){const next=args[++i];if(!next||!/^\\d+$/.test(next))throw Error('--id needs an integer');id=Number(next);}
 else if(/^--id=\\d+$/.test(arg))id=Number(arg.slice(5));
 else throw Error('Unknown argument: '+arg);
}
assert.equal(manifest.length,${count});assert.deepEqual(manifest.map(r=>r.id),Array.from({length:${count}},(_,i)=>${start}+i));
const selected=id===null?manifest:manifest.filter(r=>r.id===id);if(!selected.length)throw Error('Unknown id: '+id);
const version=require('typescript/package.json').version;assert.equal(version,'5.9.3','Use the existing pinned TypeScript 5.9.3 compiler');
const mode=starter?'starter':'solution';
// Bind BOTH positive and negative fixture imports to the candidate being graded.
// Unique workspace prevents concurrent --id/whole-track checks from clobbering output.
const workRoot=path.join(__dirname,'.verify');fs.mkdirSync(workRoot,{recursive:true});
const work=fs.mkdtempSync(path.join(workRoot,'run-'));const build=path.join(work,'build');
async function main(){
 let passed=0,failed=0;
 try{
  const files=[];
  for(const row of selected){
   for(const field of ['starter','solution','test','positive','negative'])assert.ok(fs.existsSync(path.join(__dirname,row[field])),'Missing '+field+' '+row.id);
   files.push(path.join(__dirname,row[mode]));
   for(const field of ['positive','negative']){
    const source=fs.readFileSync(path.join(__dirname,row[field]),'utf8');
    const fixture=path.join(work,path.basename(row[field]));
    // work sits at track/.verify/run-xxx; two parent hops reach the track.
    fs.writeFileSync(fixture,source.replace("'../solutions/"+row.id+"'",JSON.stringify('../../'+row[mode].replace(/\\.ts$/,''))));
    files.push(fixture);
   }
  }
  const base=require('./tsconfig.json');const config=path.join(work,'tsconfig.json');
  fs.writeFileSync(config,JSON.stringify({compilerOptions:{...base.compilerOptions,rootDir:__dirname,outDir:build},files}));
  const compiled=spawnSync(process.execPath,[require.resolve('typescript/lib/tsc.js'),'-p',config],{encoding:'utf8',timeout:180000,maxBuffer:16*1024*1024});
  if(compiled.status!==0){console.error('TypeScript compiler gate: FAILED; runtime tests NOT RUN.');process.stdout.write(compiled.stdout||'');process.stderr.write(compiled.stderr||'');if(compiled.error)console.error(compiled.error);process.exitCode=2;return;}
  console.log('TypeScript compiler gate: PASSED (5.9.3; '+selected.length+' '+mode+' APIs; positive + negative strict fixtures).');
  for(const row of selected){try{
   const candidate=require(path.join(build,row[mode].replace(/\\.ts$/,'.js')));
   assert.equal(typeof candidate.solve,'function');
   await require(path.join(__dirname,row.test))(candidate.solve);passed++;console.log('PASS '+row.id+' '+row.title);
  }catch(error){failed++;console.error('FAIL '+row.id+' '+(error&&error.stack||String(error)));}}
  console.log(mode+': '+passed+' passed, '+failed+' failed. TypeScript compiler gate: passed before runtime.');process.exitCode=failed?1:0;
 }finally{fs.rmSync(work,{recursive:true,force:true});}
}
main().catch(error=>{console.error(error);process.exitCode=2;});
`;
function emitTrack(name, firstFamily, familyCount, start){
 const dir=path.join(root,name);
 for(const part of ['starters','solutions','tests','types','prompts'])fs.mkdirSync(path.join(dir,part),{recursive:true});
 const rows=[];
 for(let f=firstFamily;f<firstFamily+familyCount;f++)for(let v=0;v<15;v++){
  const id=start+(f-firstFamily)*15+v, definition=families[f], t=definition.create(v);
  const title=definition.name+' / scenario '+String(v+1).padStart(2,'0');
  const narrative=`${id}: ${title}\n\nContract focus: ${definition.topic}.\n${t.prompt}\n\nThis is scenario ${v+1}/15 of this API family, not a new algorithm. Collection-oriented exercises emphasize ${scenarioNames[v]}; scalar/state exercises use deterministic case seed ${v}. All scenarios also cover shared edge contracts. There is no scenario/policy argument to add.\n\nImplement the supplied public signature in starters/${id}.ts. Keep exported types. Do not import the reference solution, use any, or silence errors with ts-ignore. Localized assertions are allowed only where the prompt explains the runtime invariant.\n\nExamples and edge assertions: tests/${id}.cjs. Positive strict fixtures: types/${id}.positive.ts. Negative strict fixtures: types/${id}.negative.ts. Negative calls are compiled but never executed.\nFrom unionboot:\n  node ${name}/verify.cjs --starters --id=${id}\nReference check:\n  node ${name}/verify.cjs --id=${id}\n\n`;
  const header=`// ${id}: ${title}\n// ${definition.topic}\n// ${t.prompt}\n// Scenario family repetition is intentional; see prompts/${id}.txt and tests/${id}.cjs.\n`;
  const prelude=t.prelude?t.prelude+'\n':'';
  fs.writeFileSync(path.join(dir,'solutions',id+'.ts'),header+prelude+`export function solve${t.signature} {\n  ${t.body}\n}\n`);
  fs.writeFileSync(path.join(dir,'starters',id+'.ts'),header+prelude+`export function solve${t.signature} {\n  // Your implementation here.\n  throw new Error('TODO exercise ${id}');\n}\n`);
  fs.writeFileSync(path.join(dir,'tests',id+'.cjs'),`'use strict';\nconst assert=require('node:assert/strict');\nmodule.exports=async function(solve){\n${t.tests}\n};\n`);
  const exports=[...t.prelude.matchAll(/export type (\w+)/g)].map(m=>m[1]);
  const imports=`import {solve${exports.length?', '+exports.join(', '):''}} from '../solutions/${id}';\n`;
  fs.writeFileSync(path.join(dir,'types',id+'.positive.ts'),imports+typeHelpers+t.positive+'\n');
  fs.writeFileSync(path.join(dir,'types',id+'.negative.ts'),imports+t.negative.map((line,i)=>`// @ts-expect-error Contract must reject case ${i+1}: incompatible shape, key, value, or unsafe access\n{ ${line} }`).join('\n')+'\n');
  fs.writeFileSync(path.join(dir,'prompts',id+'.txt'),narrative);
  rows.push({id,tech:'ts',title,family:definition.name,scenario:v+1,topic:definition.topic,starter:`starters/${id}.ts`,solution:`solutions/${id}.ts`,test:`tests/${id}.cjs`,positive:`types/${id}.positive.ts`,negative:`types/${id}.negative.ts`,prompt:`prompts/${id}.txt`});
 }
 fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(rows,null,2)+'\n');
 fs.writeFileSync(path.join(dir,'tsconfig.json'),JSON.stringify({compilerOptions:{...options,outDir:'.build',rootDir:'.'},include:['solutions/**/*.ts','starters/**/*.ts','types/**/*.ts']},null,2)+'\n');
 fs.writeFileSync(path.join(dir,'verify.cjs'),verifier(rows.length,start,start+rows.length-1));
 fs.writeFileSync(path.join(dir,'GUIDE.txt'),`${name.toUpperCase()} - STRICT TYPESCRIPT CONTRACT PRACTICE\n\n${rows.length} exercises; IDs ${start}-${start+rows.length-1}. ${familyCount} API families, each with 15 explicitly labelled regression scenarios. This is repeated contract practice, NOT ${rows.length} unrelated algorithms. Signatures and implementations repeat within a family; scenario inputs and deterministic seeds vary. Boundary tests remain shared deliberately. No artificial policy tokens.\n\nWorkflow\n1. Read prompts/<id>.txt and inspect the public signature in starters/<id>.ts.\n2. Implement the blank body without importing solutions.\n3. Inspect tests/<id>.cjs for concrete runtime examples and types/<id>.*.ts for compile contracts.\n4. Run node ${name}/verify.cjs --starters --id=${start}. (--id ${start} also works.)\n5. Run node ${name}/verify.cjs for all references, or --starters for all your work.\n\nThe verifier invokes the existing TypeScript 5.9.3 tsc CLI before any runtime test. Strict, exactOptionalPropertyTypes, noUncheckedIndexedAccess, useUnknownInCatchVariables and noImplicitReturns are enabled. Positive and @ts-expect-error negative fixtures are rebound to the selected STARTER in practice mode; solution types cannot mask a broken starter API. Fixtures are never executed. The exported solve symbol has an any guard, supplemented by concrete typed assignments and negative return-use checks; fixtures are regression coverage, not a complete proof against deliberate type escapes.\n\nExit codes: 0 all pass; 1 runtime failures; 2 compiler/setup failures. Unknown flags/IDs fail. Untouched starters compile successfully but every test fails with TODO exercise <id>; compiler failure is NOT a successful blank-starter control. Temporary compiler outputs live under .verify/ and are cleaned after each run. Readonly contracts do not imply runtime deep freeze unless the prompt says so.\n\nAuthoring source: ../build-ts-expansion.cjs. It refuses to overwrite either existing track so a rerun cannot destroy learner work. Root package, index and master verifier are intentionally not edited by this generator.\n\nFamilies\n`+families.slice(firstFamily,firstFamily+familyCount).map((f,i)=>`${start+i*15}-${start+i*15+14}: ${f.name} (${f.topic})`).join('\n')+'\n');
 console.log(`Created ${name}: ${rows.length} TypeScript scenarios (${familyCount} families).`);
}
// Preflight both before writing either track; never partially overwrite a learner tree.
for(const name of ['ts-more','ts-final'])if(fs.existsSync(path.join(root,name)))throw Error('Refusing existing track: '+name);
emitTrack('ts-more',0,28,784);
emitTrack('ts-final',28,11,1204);
