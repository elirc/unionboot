'use strict';
// Owns only this file and ts-next/. Does not install, integrate, or overwrite a track.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const root = __dirname, destination = path.join(root, 'ts-next');
const q = JSON.stringify, families = [];
function family(name, topic, create) { families.push({ name, topic, create }); }
function task(semanticKey, prelude, signature, body, prompt, tests, positive, negative) {
  assert.equal(negative.length, 4);
  return { semanticKey, prelude, signature, body, prompt, tests, positive, negative };
}
const tuple = (parts, readonly = true) => (readonly ? 'readonly ' : '') + '[' + parts.join(', ') + ']';
const numbers = n => Array.from({length:n}, (_, i) => i + 1);
const fields = [
  {key:'name', type:'string', value:'Ada'}, {key:'count', type:'number', value:3},
  {key:'active', type:'boolean', value:true}, {key:'tags', type:'readonly string[]', value:['a','b']}
];
const selectedFields = v => fields.filter((_, i) => ((v + 1) & (1 << i)) !== 0);
const shape = (xs, modifier = '') => '{ ' + xs.map(f => `${modifier}${f.key}: ${f.type}`).join('; ') + ' }';
const valueOf = xs => Object.fromEntries(xs.map(f => [f.key,f.value]));
const masks = v => selectedFields(v).map(f=>f.key).join('+');
const wrong = f => f.type === 'number' ? '"bad"' : f.type === 'boolean' ? '0' : '42';
// Each scenario changes required fields, tuple arity, recursion fuel, or protocol capability.
function depthType(n, leaf, readonly=false) { return n ? `{${readonly?'readonly ':''}next:${depthType(n-1,leaf,readonly)}}` : leaf; }
function depthValue(n, leaf) { return n ? {next:depthValue(n-1,leaf)} : leaf; }
function deepAccess(n) { return '.next'.repeat(n); }
// Added at emit time: tuple APIs reject widened arrays, whose finite shape cannot be proved.
function enforceTupleDomain(t) {
 if(t.signature.includes('input:T') && t.prelude.match(/export type (Take|Drop|Pad|Rotate|Windows|Insert)</))
   t.signature=t.signature.replace('input:T','input:T & (number extends T[\'length\']?never:unknown)');
 return t;
}
function fixedTuple(n, prelude, output, body, explanation, expected, extraTests='') {
  const input = tuple(Array(n).fill('number'));
  const xs = numbers(n);
  return task(`input-arity=${n}`, `export type Input = ${input};\n${prelude}\nexport type Output = ${output};`, '(input: Input): Output', body,
    explanation + ` This version accepts exactly ${n} numeric positions; readonly tuple inputs are supported. Output is readonly statically, not frozen unless stated.`,
    `const input=Object.freeze(${q(xs)}); const out=solve(input); assert.deepEqual(out,${q(expected)}); assert.deepEqual(input,${q(xs)}); assert.notEqual(out,input); ${extraTests}`,
    `const r=solve(${q(xs)}); const expected:api.Output=r; type Precise=Assert<Equal<typeof r,api.Output>>; void expected;`,
    [`solve(${q(xs.slice(1))});`, `solve(["bad"${n>1?','+xs.slice(1).join(','):''}]);`, `const bad:string=solve(${q(xs)});`, `solve(undefined);`]);
}

family('Bounded infer-chain box peeling', 'conditional infer chains; recursion fuel; terminal values', v => {
  const n=v+1, wrap=(k,x)=>k?'{ value: '+wrap(k-1,x)+' }':x;
  const data=k=>k?{value:data(k-1)}:7;
  return task(`peel-budget=${n}`, `export type Peel<T, Fuel extends unknown[] = ${tuple(Array(n).fill('unknown'),false)}> = Fuel extends [unknown,...infer Rest] ? T extends {readonly value:infer V} ? Peel<V,Rest> : T : T;`,
    '<const T>(input: T): Peel<T>',
    `let current: unknown=input; for(let i=0;i<${n};i++){if(typeof current!=='object'||current===null||!Object.hasOwn(current,'value')) break; current=(current as {value:unknown}).value;} return current as Peel<T>;`,
    `Peel at most ${n} own value boxes. Stop early at any unboxed value. Inputs are plain data objects (no inherited value properties, getters, or cycles). The conditional infer chain must stop at the same budget as runtime. The final assertion bridges the verified loop and conditional type.`,
    `assert.equal(solve(${q(data(n))}),7); const deep=${q(data(n+1))}; assert.equal(solve(deep),${'deep.value'.replace(/\.value$/,'')+'.value'.repeat(n)}); assert.equal(solve(null),null); assert.equal(solve(false),false); const bare={other:1}; assert.equal(solve(bare),bare); assert.equal(solve({value:undefined}),undefined);`,
    `const r=solve(${q(data(n))}); const exact:7=r; const d=solve(${q(data(n+1))}); const box:{readonly value:7}=d; type Chain=Assert<Equal<api.Peel<${wrap(n,'string')}>,string>>; void exact;void box;`,
    [`const bad:string=solve(${q(data(n))});`, `const bad:number=solve(${q(data(n+1))});`, `solve(${q(data(n))}).missing;`, `const bad:api.Peel<${wrap(n,'boolean')}>=1;`]);
});
family('Saturating tuple prefix algebra', 'tuple infer; bounded take; literal length', v => {
  const n=v+1, xs=numbers(18);
  return task(`take=${n}`, `export type Take<T extends readonly unknown[], A extends unknown[]=[]>=A['length'] extends ${n}?readonly [...A]:T extends readonly [infer H,...infer R]?Take<R,[...A,H]>:readonly [...A];`,
    '<const T extends readonly unknown[]>(input:T): Take<T>', `return input.slice(0,${n}) as unknown as Take<T>;`,
    `Return a fresh prefix of at most ${n} positions. Preserve tuple position types and saturate at input length. This API accepts finite tuples, not widened arrays; the signature enforces a known length. The slice result assertion follows its bounds.`,
    `assert.deepEqual(solve(Object.freeze(${q(xs)})),${q(xs.slice(0,n))}); assert.deepEqual(solve([]),[]); const a={};assert.equal(solve([a])[0],a);assert.deepEqual(solve([1]),[1]);`,
    `const r=solve(${q(xs)});const exact:${tuple(xs.slice(0,n).map(String))}=r;const empty:readonly []=solve([]);void exact;void empty;`,
    [`solve(1);`,`const bad:readonly []=solve(${q(xs)});`,`solve(${q(xs)}).push(1);`,`const bad:string=solve(${q(xs)})[0];`]);
});
family('Saturating tuple suffix algebra', 'variadic rest inference; bounded drop', v => {
 const n=v+1,xs=numbers(18);
 return task(`drop=${n}`,`export type Drop<T extends readonly unknown[], A extends unknown[]=[]>=A['length'] extends ${n}?readonly [...T]:T extends readonly [unknown,...infer R]?Drop<R,[...A,unknown]>:readonly [];`,
 '<const T extends readonly unknown[]>(input:T): Drop<T>',`return input.slice(${n}) as unknown as Drop<T>;`,
 `Drop up to ${n} leading positions and return a fresh readonly-typed suffix. Dropping beyond a tuple yields []. Preserve exact remaining position types. Inputs are finite tuples.`,
 `const xs=Object.freeze(${q(xs)});assert.deepEqual(solve(xs),${q(xs.slice(n))});assert.deepEqual(solve([]),[]);assert.deepEqual(solve([1]),[]);const obj={};const out=solve([...Array(${n}).fill(0),obj]);assert.equal(out[0],obj);`,
 `const r=solve(${q(xs)});const exact:${tuple(xs.slice(n).map(String))}=r;const empty:readonly []=solve([]);void exact;void empty;`,
 [`solve(null);`,`const bad:readonly []=solve(${q(xs)});`,`solve(${q(xs)}).push(1);`,`const bad:string=solve(${q(xs)})[0];`]);
});
family('Minimum-width tuple padding', 'recursive tuple construction; padding unions', v => {
 const n=v+1;
 return task(`minimum-width=${n}`,`export type Pad<T extends readonly unknown[],F,A extends unknown[]=[]>=A['length'] extends ${n}?readonly [...A,...T]:T extends readonly [infer H,...infer R]?Pad<R,F,[...A,H]>:Pad<[],F,[...A,F]>;`,
 '<const T extends readonly unknown[],const F>(input:T,fill:F): Pad<T,F>',
 `const out:unknown[]=[...input];while(out.length<${n})out.push(fill);/* Preserve every input position, then append only fill until the target width: exactly Pad<T,F>. */ return out as unknown as Pad<T,F>;`,
 `Pad short tuples on the right to width ${n}, repeating the same fill reference. Never truncate longer tuples. Inputs must have statically known tuple length. The recursive counter stops at the target width without enumerating all possible long tuple lengths.`,
 `assert.deepEqual(solve([],0),${q(Array(n).fill(0))});const input=Object.freeze([1]);assert.deepEqual(solve(input,2),${q([1,...Array(Math.max(0,n-1)).fill(2)])});const long=Array(17).fill(8);assert.deepEqual(solve(long,0),long);const obj={};assert.equal(solve([],obj)[0],obj);`,
 `const r=solve([],false);const exact:${tuple(Array(n).fill('false'))}=r;const long=solve(${q(numbers(17))},null);const length:17=long.length;void exact;void length;`,
 [`solve(1,0);`,`solve([],0).push(0);`,`const bad:string=solve([],0)[0];`,`solve([],0,1);`]);
});
family('Tuple left-rotation proofs', 'tuple concatenation; repeated rotations; exact positions', v => {
 const n=v+1,xs=numbers(17),out=[...xs.slice(n),...xs.slice(0,n)];
 return task(`rotate-left=${n}`,`export type Rotate<T extends readonly unknown[], C extends unknown[]=[]>=C['length'] extends ${n}?readonly [...T]:T extends readonly [infer H,...infer R]?Rotate<[...R,H],[...C,unknown]>:readonly [];`,
 '<const T extends readonly unknown[]>(input:T): Rotate<T>',`if(input.length===0)return [] as unknown as Rotate<T>;const count=${n}%input.length;/* Moving the prefix after the suffix by n modulo length equals n recursive single-step rotations. */ return [...input.slice(count),...input.slice(0,count)] as unknown as Rotate<T>;`,
 `Rotate a tuple left by ${n} positions modulo its length. Empty stays empty. Build a new array; preserve references and exact literals at every resulting index.`,
 `const input=Object.freeze(${q(xs)});assert.deepEqual(solve(input),${q(out)});assert.deepEqual(solve([]),[]);assert.deepEqual(solve([9]),[9]);const a={};assert.equal(solve([a])[0],a);`,
 `const r=solve(${q(xs)});const exact:${tuple(out.map(String))}=r;const empty:readonly []=solve([]);void exact;void empty;`,
 [`solve(false);`,`const bad:1=solve(${q(xs)})[0];`,`solve(${q(xs)}).push(1);`,`const bad:string=solve([1])[0];`]);
});
family('Literal tuple replication', 'const inference; fixed-size tuple construction', v => {
 const n=v+1;
 return task(`copies=${n}`,`export type Copies<T,A extends T[]=[]>=A['length'] extends ${n}?readonly [...A]:Copies<T,[...A,T]>;`,
 '<const T>(value:T): Copies<T>',`/* Array.from invokes the callback exactly ${n} times, placing the identical T reference in every position. */ return Array.from({length:${n}},()=>value) as unknown as Copies<T>;`,
 `Return exactly ${n} copies of the same value reference in a new readonly-typed tuple. Preserve literal and nested readonly inference through a const type parameter. Do not clone the value.`,
 `assert.deepEqual(solve(0),${q(Array(n).fill(0))});const obj={x:1};const out=solve(obj);assert.equal(out.length,${n});assert.ok(out.every(x=>x===obj));assert.deepEqual(solve(undefined),Array(${n}).fill(undefined));assert.notEqual(solve(1),solve(1));`,
 `const r=solve('x');const exact:${tuple(Array(n).fill("'x'"))}=r;const len:${n}=r.length;const obj=solve({enabled:true});const yes:true=obj[0].enabled;void exact;void len;void yes;`,
 [`solve();`,`solve('x')[0]='x';`,`const bad:number=solve('x')[0];`,`solve(1)[${n}];`]);
});
family('Overlapping tuple window types', 'recursive tuple windows; saturated boundaries', v => {
 const n=v+1,xs=numbers(17),expected=Array.from({length:18-n},(_,i)=>xs.slice(i,i+n));
 const types=`type Prefix<T extends readonly unknown[],A extends unknown[]=[]>=A['length'] extends ${n}?readonly [...A]:T extends readonly [infer H,...infer R]?Prefix<R,[...A,H]>:never;\nexport type Windows<T extends readonly unknown[]> = T extends readonly [unknown,...infer Rest] ? [Prefix<T>] extends [never] ? readonly [] : readonly [Prefix<T>,...Windows<Rest>] : readonly [];`;
 return task(`window-width=${n}`,types,'<const T extends readonly unknown[]>(input:T): Windows<T>',`const out:unknown[][]=[];for(let i=0;i+${n}<=input.length;i++)out.push(input.slice(i,i+${n}));return out as unknown as Windows<T>;`,
 `Create every overlapping full window of width ${n}, advancing one position. Do not include partial windows. Return fresh outer and inner arrays with exact readonly tuple position contracts.`,
 `assert.deepEqual(solve(Object.freeze(${q(xs)})),${q(expected)});assert.deepEqual(solve([]),[]);assert.deepEqual(solve(Array(${n-1}).fill(1)),[]);const obj={};const input=Array(${n}).fill(obj);const out=solve(input);assert.equal(out.length,1);assert.equal(out[0][0],obj);assert.notEqual(out[0],input);`,
 `const r=solve(${q(xs)});const exact:${tuple(expected.map(a=>tuple(a.map(String))))}=r;const empty:readonly []=solve([]);void exact;void empty;`,
 [`solve(1);`,`solve(${q(xs)})[0].push(1);`,`const bad:string=solve(${q(xs)})[0][0];`,`const bad:readonly []=solve(${q(xs)});`]);
});
family('Position-labelled tuple enumeration', 'mapped tuple indexes; numeric template inference', v=>{
 const n=v+1,xs=numbers(n);
 return fixedTuple(n,'type Numeric<S>=string extends S?never:S extends `${infer N extends number}`?N:never;',
 tuple(xs.map((_,i)=>`{readonly index:${i};readonly value:number}`)),
 `return input.map((value,index)=>({index,value})) as unknown as Output;`,
 'Enumerate all input positions as index/value records. Each index in the output type is its exact numeric literal, not number. Preserve order and do not mutate the input.',xs.map((value,index)=>({index,value})),
 'assert.notEqual(out[0],solve(input)[0]);');
});
family('Positional reverse tuple contracts', 'tuple right inference; reversed position correspondence', v=>{
 const n=v+1,types=Array.from({length:n},(_,i)=>i%3===0?'number':i%3===1?'string':'boolean');
 const xs=types.map((t,i)=>t==='number'?i+1:t==='string'?'v'+i:i%2===0);
 return task(`heterogeneous-arity=${n}`,`export type Input=${tuple(types)};\nexport type Reverse<T extends readonly unknown[]>=T extends readonly [infer H,...infer R]?readonly [...Reverse<R>,H]:readonly [];\nexport type Output=Reverse<Input>;`,
 '(input:Input): Output','return [...input].reverse() as unknown as Output;',
 `Reverse exactly ${n} heterogeneous positions. The source cycles number/string/boolean position contracts, so reversing changes more than array order. Return a fresh array; readonly is static only.`,
 `const input=Object.freeze(${q(xs)});assert.deepEqual(solve(input),${q([...xs].reverse())});assert.deepEqual(input,${q(xs)});assert.notEqual(solve(input),input);const alternate=input.map(x=>typeof x==='number'?-x:typeof x==='string'?'':!x);assert.deepEqual(solve(alternate),[...alternate].reverse());`,
 `const r=solve(${q(xs)});const exact:${tuple([...types].reverse())}=r;type Precise=Assert<Equal<typeof r,api.Output>>;void exact;`,
 [`solve(${q(xs.slice(1))});`,`solve([null${n>1?','+xs.slice(1).map(q).join(','):''}]);`,`solve(${q(xs)})[0]=${q(xs.at(-1))};`,`const bad:string=solve(${q(xs)});`]);
});
family('Tuple insertion boundary inference', 'tuple rest decomposition; insertion position algebra',v=>{
 const n=v+1,xs=numbers(17),expected=[...xs.slice(0,n),'insert',...xs.slice(n)];
 return task(`insert-index=${n}`,`export type Insert<T extends readonly unknown[],V,A extends unknown[]=[]>=A['length'] extends ${n}?readonly [...A,V,...T]:T extends readonly [infer H,...infer R]?Insert<R,V,[...A,H]>:readonly [...A,V];`,
 '<const T extends readonly unknown[],const V>(input:T,value:V): Insert<T,V>',`const index=Math.min(${n},input.length);/* The clamped index partitions T; concatenate its prefix, one V, and its unchanged suffix as Insert<T,V>. */ return [...input.slice(0,index),value,...input.slice(index)] as unknown as Insert<T,V>;`,
 `Insert one value at zero-based index ${n}, clamped to the tuple end. Preserve every position type and value reference, returning a new tuple without changing input.`,
 `assert.deepEqual(solve(Object.freeze(${q(xs)}),'insert'),${q(expected)});assert.deepEqual(solve([],1),[1]);assert.deepEqual(solve([1],2),[1,2]);const obj={};assert.equal(solve([],obj)[0],obj);`,
 `const r=solve(${q(xs)},'insert');const exact:${tuple(expected.map(q))}=r;const empty:readonly [true]=solve([],true);void exact;void empty;`,
 [`solve(null,1);`,`solve([],1).push(1);`,`const bad:number=solve(${q(xs)},'insert')[${n}];`,`solve([]);`]);
});

family('Route-template parameter binding', 'template literal parsing; inferred parameter records',v=>{
 const n=v+1,route='/users/'+numbers(n).map(i=>':p'+i).join('/'),params=Object.fromEntries(numbers(n).map(i=>['p'+i,'v '+i]));
 const result='/users/'+numbers(n).map(i=>'v%20'+i).join('/');
 return task(`route-parameters=${n}`,`export type Route=${q(route)};\nexport type Params<S extends string>=S extends \`${'${string}:${infer K}/${infer R}'}\`?{[P in K|keyof Params<R>]:string}:S extends \`${'${string}:${infer K}'}\`?{[P in K]:string}:{};\nexport type Input=Params<Route>;`.replaceAll('\`','`'),
 '(params:Input): string',`const route:Route=${q(route)};return route.replace(/:([A-Za-z0-9]+)/g,(_,key:string)=>encodeURIComponent(params[key as keyof Input]));`,
 `Bind the ${n} required route parameters in ${route}. URI-encode each complete segment with encodeURIComponent (spaces become %20, embedded / becomes %2F). Leave literal segments unchanged. Derive the parameter record with a template-literal infer parser; no optional parameters.`,
 `const p=Object.freeze(${q(params)});assert.equal(solve(p),${q(result)});assert.deepEqual(p,${q(params)});assert.equal(solve({...p,p1:'/a?b'}).split('/')[2],'%2Fa%3Fb');assert.equal(solve({...p,p1:''}).split('/')[2],'');`,
 `const p:api.Input=${q(params)};const text:string=solve(p);type Keys=Assert<Equal<keyof api.Input,${numbers(n).map(i=>q('p'+i)).join('|')}>>;void text;`,
 [`solve({});`,`solve({...${q(params)},p1:1});`,`solve({...${q(params)},unknown:'x'});`,`const bad:number=solve(${q(params)});`]);
});
family('Positional printf-token inference', 'template literal token parser; heterogeneous rest tuples',v=>{
 const n=v+1,tokens=numbers(n).map((_,i)=>['%s','%d','%b'][i%3]),format=tokens.join(' | '),vals=tokens.map((t,i)=>t==='%s'?'item'+i:t==='%d'?i+1:i%2===0),types=tokens.map(t=>t==='%s'?'string':t==='%d'?'number':'boolean');
 return task(`format-token-arity=${n}`,`export type Format=${q(format)};\nexport type Args<S extends string>=S extends \`${'${string}%${infer C}${infer R}'}\`?C extends 's'? [string,...Args<R>]:C extends 'd'?[number,...Args<R>]:C extends 'b'?[boolean,...Args<R>]:Args<R>:[];`.replaceAll('\`','`'),
 '(...args:Args<Format>): string',`let index=0;return ${q(format)}.replace(/%[sdb]/g,()=>String(args[index++]));`,
 `Format the fixed template ${format}. %s consumes string, %d number, %b boolean. Parse the rest-argument tuple from the template; reject missing, extra, and incorrectly ordered values. Use String conversion, without padding or locale formatting.`,
 `assert.equal(solve(...${q(vals)}),${q(vals.map(String).join(' | '))});assert.equal(solve(...${q(vals.map(x=>typeof x==='string'?'':typeof x==='number'?0:false))}),${q(vals.map(x=>typeof x==='string'?'':typeof x==='number'?'0':'false').join(' | '))});assert.equal(solve(...${q(vals)}),solve(...${q(vals)}));`,
 `const args:api.Args<api.Format>=${q(vals)};const text:string=solve(...args);type Positions=Assert<Equal<api.Args<api.Format>,${tuple(types,false)}>>;void text;`,
 [`solve(...${q(vals.slice(1))});`,`solve(null${n>1?','+vals.slice(1).map(q).join(','):''});`,`solve(...${q(vals)},'extra');`,`const bad:number=solve(...${q(vals)});`]);
});
family('Budgeted delimited literal parsing', 'template-literal split inference; trailing empty positions',v=>{
 const n=v+1,word=numbers(18).join('|'),expected=[...numbers(n).map(String),numbers(18).slice(n).join('|')];
 return task(`maximum-splits=${n}`,`export type Split<S extends string,A extends string[]=[]>=A['length'] extends ${n}?readonly [...A,S]:S extends \`${'${infer H}|${infer R}'}\`?Split<R,[...A,H]>:readonly [...A,S];`.replaceAll('\`','`'),
 '<const S extends string>(text:S): Split<S>',`const out:string[]=[];let rest:string=text;for(let i=0;i<${n};i++){const at=rest.indexOf('|');if(at<0)break;out.push(rest.slice(0,at));rest=rest.slice(at+1);}out.push(rest);/* Each iteration consumes the first delimiter; append the untouched remainder after the same budget as Split<S>. */ return out as unknown as Split<S>;`,
 `Split at most ${n} pipe delimiters. The unsplit suffix is the final item; consecutive and trailing delimiters preserve empty strings. A template-literal parser must infer exact output positions from literal input.`,
 `assert.deepEqual(solve(${q(word)}),${q(expected)});assert.deepEqual(solve(''),['']);assert.deepEqual(solve('|'),['','']);assert.deepEqual(solve('a'),['a']);assert.deepEqual(solve('||'),${q(n===1?['','|']:['','',''])});`,
 `const r=solve(${q(word)});const exact:${tuple(expected.map(q))}=r;const empty:readonly ['']=solve('');void exact;void empty;`,
 [`solve(1);`,`solve('a').push('b');`,`const bad:number=solve('a')[0];`,`const bad:readonly ['a','b']=solve('a');`]);
});
family('Bounded leading-slash normalization', 'recursive template consumption; normalization budgets',v=>{
 const n=v+1,text='/'.repeat(17)+'docs',out='/'.repeat(17-n)+'docs';
 return task(`slash-budget=${n}`,`export type Strip<S extends string,C extends unknown[]=[]>=C['length'] extends ${n}?S:S extends \`/${'${infer R}'}\`?Strip<R,[...C,unknown]>:S;`.replaceAll('\`','`'),
 '<const S extends string>(text:S): Strip<S>',`let rest:string=text;for(let i=0;i<${n}&&rest.startsWith('/');i++)rest=rest.slice(1);return rest as Strip<S>;`,
 `Remove up to ${n} leading / characters. Never touch interior or trailing slashes, backslashes, or whitespace. Preserve the exact transformed string literal type. This is bounded consumption, not general path resolution.`,
 `assert.equal(solve(${q(text)}),${q(out)});assert.equal(solve('/a/b/'),'a/b/');assert.equal(solve(''),'');assert.equal(solve(' a/'),' a/');assert.equal(solve('a/../b'),'a/../b');`,
 `const r=solve(${q(text)});const exact:${q(out)}=r;const untouched:'a/b'=solve('a/b');void exact;void untouched;`,
 [`solve(null);`,`const bad:${q(text)}=solve(${q(text)});`,`const bad:number=solve('/a');`,`solve('a',1);`]);
});
family('Bounded ASCII whitespace trimming', 'template union matching; asymmetric literal transforms',v=>{
 const n=v+1,text=' '.repeat(17)+'x ',out=' '.repeat(17-n)+'x ';
 return task(`leading-whitespace-budget=${n}`,`export type Trim<S extends string,C extends unknown[]=[]>=C['length'] extends ${n}?S:S extends \`${'${" "|"\\n"|"\\t"|"\\r"}${infer R}'}\`?Trim<R,[...C,unknown]>:S;`.replaceAll('\`','`'),
 '<const S extends string>(text:S): Trim<S>',`let out:string=text;for(let i=0;i<${n}&&/^[ \\t\\r\\n]/.test(out);i++)out=out.slice(1);return out as Trim<S>;`,
 `Trim at most ${n} leading ASCII whitespace characters (space, tab, CR, LF). Keep trailing whitespace and non-ASCII spaces. Infer the exact result for literals; do not use trimStart, which has a larger character domain.`,
 `assert.equal(solve(${q(text)}),${q(out)});assert.equal(solve('\tx '),'x ');assert.equal(solve('\u00a0x'),'\u00a0x');assert.equal(solve(''),'');assert.equal(solve(${q('x\n')}),${q('x\n')});`,
 `const r=solve(${q(text)});const exact:${q(out)}=r;const tab:'x'=solve('\tx');void exact;void tab;`,
 [`solve(1);`,`const bad:${q(text)}=solve(${q(text)});`,`const bad:number=solve(' x');`,`solve('x',true);`]);
});
family('Budgeted kebab-to-camel literal transforms', 'Capitalize intrinsic; recursive infer composition',v=>{
 const n=v+1,text='a'+ '-b'.repeat(17),out='a'+'B'.repeat(n)+'-b'.repeat(17-n);
 return task(`hyphen-conversions=${n}`,`export type Camel<S extends string,C extends unknown[]=[]>=C['length'] extends ${n}?S:S extends \`${'${infer H}-${infer R}'}\`?R extends \`${'${infer First}${infer Tail}'}\`?\`${'${H}${Uppercase<First>}${Camel<Tail,[...C,unknown]>}'}\`:H:S;`.replaceAll('\`','`'),
 '<const S extends string>(text:S): Camel<S>',`let out='',rest:string=text;for(let i=0;i<${n};i++){const at=rest.indexOf('-');if(at<0)break;out+=rest.slice(0,at);rest=rest.slice(at+1);if(rest.length){out+=rest[0]!.toUpperCase();rest=rest.slice(1);}}return (out+rest) as Camel<S>;`,
 `Convert at most ${n} hyphens to capitalization of the immediately following ASCII character. A final hyphen disappears. A consecutive hyphen is a character (uppercasing leaves it unchanged). Input domain: ASCII text only, so first-character intrinsic and runtime slicing agree.`,
 `assert.equal(solve(${q(text)}),${q(out)});assert.equal(solve('hello-world'),'helloWorld');assert.equal(solve('end-'),'end');assert.equal(solve(''),'');assert.equal(solve('a--b'),'a-b');`,
 `const r=solve(${q(text)});const exact:${q(out)}=r;const basic:'helloWorld'=solve('hello-world');void exact;void basic;`,
 [`solve(1);`,`const bad:${q(text)}=solve(${q(text)});`,`const bad:number=solve('a-b');`,`solve('x',false);`]);
});
family('Suffix-selected asset descriptors', 'template suffix unions; discriminated metadata',v=>{
 const kinds=[{ext:'png',type:'image',property:'channels',val:4},{ext:'mp3',type:'audio',property:'sampleRate',val:44100},{ext:'txt',type:'text',property:'encoding',val:'utf8'},{ext:'json',type:'data',property:'structured',val:true}].filter((_,i)=>((v+1)&1<<i)!==0);
 const outputs=kinds.map(k=>`{readonly kind:${q(k.type)};readonly extension:${q(k.ext)};readonly ${k.property}:${q(k.val)}}`),file='asset.'+kinds[0].ext;
 return task(`asset-kinds=${kinds.map(k=>k.ext).join('+')}`,`export type File=${kinds.map(k=>'`${string}.'+k.ext+'`').join('|')};\nexport type Descriptor<S extends File>=${kinds.map((k,i)=>`S extends \`${'${string}'}${'.'+k.ext}\`?${outputs[i]}:`).join('')}never;`.replaceAll('\`','`'),
 '<const S extends File>(filename:S): Descriptor<S>',`const ext=filename.slice(filename.lastIndexOf('.')+1);switch(ext){${kinds.map(k=>`case ${q(k.ext)}:return ${q({kind:k.type,extension:k.ext,[k.property]:k.val})} as Descriptor<S>;`).join('')}default:throw new Error('Unsupported suffix');}`,
 `Classify only ${kinds.map(k=>'.'+k.ext).join(', ')} assets by case-sensitive final suffix. Return kind-specific readonly metadata; infer the member from the literal filename. No filesystem access. Reject unsupported suffixes at runtime when called from JavaScript.`,
 kinds.map(k=>`assert.deepEqual(solve('a.b.${k.ext}'),${q({kind:k.type,extension:k.ext,[k.property]:k.val})});`).join('')+`assert.throws(()=>solve('a.exe'),/Unsupported suffix/);assert.throws(()=>solve(${q(file.toUpperCase())}),/Unsupported suffix/);`,
 `const r=solve(${q(file)});const kind:${q(kinds[0].type)}=r.kind;const detail:${q(kinds[0].val)}=r.${kinds[0].property};void kind;void detail;`,
 [`solve('a.exe');`,`solve(1);`,`solve(${q(file)}).kind=${q(kinds[0].type)};`,`const bad:number=solve(${q(file)}).extension;`]);
});
family('Query-template placeholder interpolation', 'template infer records; URLSearchParams value encoding',v=>{
 const n=v+1,template=numbers(n).map(i=>'k'+i+'={v'+i+'}').join('&'),values=Object.fromEntries(numbers(n).map(i=>['v'+i,'a b'+i]));
 return task(`query-placeholder-arity=${n}`,`export type Template=${q(template)};\nexport type Variables<S extends string>=S extends \`${'${string}{${infer K}}${infer Rest}'}\`?{[P in K|keyof Variables<Rest>]:string}:{};\nexport type Input=Variables<Template>;`.replaceAll('\`','`'),
 '(values:Input): string',`return ${q(template)}.replace(/\{([^}]+)\}/g,(_,key:string)=>encodeURIComponent(values[key as keyof Input]));`,
 `Interpolate every braced value placeholder in ${template}, percent-encoding values with encodeURIComponent. Preserve query key order. This is a query template, not arbitrary object serialization; all ${n} variables are required and may be empty.`,
 `const input=Object.freeze(${q(values)});assert.equal(solve(input),${q(numbers(n).map(i=>'k'+i+'=a%20b'+i).join('&'))});assert.equal(solve({...input,v1:'=&?'}).split('&')[0],'k1=%3D%26%3F');assert.equal(solve({...input,v1:''}).split('&')[0],'k1=');assert.deepEqual(input,${q(values)});`,
 `const r:string=solve(${q(values)});type Keys=Assert<Equal<keyof api.Input,${numbers(n).map(i=>q('v'+i)).join('|')}>>;void r;`,
 [`solve({});`,`solve({...${q(values)},v1:1});`,`solve({...${q(values)},unknown:'x'});`,`const bad:number=solve(${q(values)});`]);
});
family('Fixed-width binary-word decoding', 'recursive template validation; intersection input constraints',v=>{
 const n=v+1,word='1'.repeat(n);
 return task(`binary-width=${n}`,`export type Valid<S extends string,C extends unknown[]=[]>=S extends \`${'${infer H}${infer R}'}\`?H extends '0'|'1'?Valid<R,[...C,unknown]>:false:C['length'] extends ${n}?true:false;`,
 '<const S extends string>(word:S & (Valid<S> extends true?unknown:never)): number',
 `if(!new RegExp('^[01]{${n}}$').test(word))throw new Error('Invalid binary word');return Number.parseInt(word,2);`,
 `Decode an unsigned binary literal of exactly ${n} bits. Recursive template validation must reject wrong characters and wrong width, not enumerate 2^width strings. Widened strings must be validated elsewhere. JavaScript callers get Invalid binary word on invalid input.`,
 `assert.equal(solve(${q(word)}),${2**n-1});assert.equal(solve(${q('0'.repeat(n))}),0);assert.equal(solve(${q('0'.repeat(n-1)+'1')}),1);assert.throws(()=>solve('2'),/Invalid binary word/);assert.throws(()=>solve(${q(word+'0')}),/Invalid binary word/);`,
 `const r:number=solve(${q(word)});type Good=Assert<Equal<api.Valid<${q(word)}>,true>>;type Short=Assert<Equal<api.Valid<${q(word.slice(1))}>,false>>;void r;`,
 [`solve(${q(word+'0')});`,`solve(${q('2'+word.slice(1))});`,`const s:string=${q(word)};solve(s);`,`const bad:string=solve(${q(word)});`]);
});
family('Balanced literal envelope construction', 'recursive template wrapping; branded-free literal proofs',v=>{
 const n=v+1;
 return task(`bracket-depth=${n}`,`export type Envelope<S extends string,C extends unknown[]=[]>=C['length'] extends ${n}?S:Envelope<\`[${'${S}'}]\`,[...C,unknown]>;`.replaceAll('\`','`'),
 '<const S extends string>(text:S): Envelope<S>',`return ('['.repeat(${n})+text+']'.repeat(${n})) as Envelope<S>;`,
 `Wrap text in exactly ${n} balanced square-bracket layers. Preserve the complete resulting string literal using recursive template construction. Existing brackets in text are opaque; do not parse or escape them.`,
 `assert.equal(solve('x'),${q('['.repeat(n)+'x'+']'.repeat(n))});assert.equal(solve(''),${q('['.repeat(n)+']'.repeat(n))});assert.equal(solve(']['),${q('['.repeat(n)+']['+']'.repeat(n))});assert.equal(solve(${q('\n')}),${q('['.repeat(n)+'\n'+']'.repeat(n))});`,
 `const exact:${q('['.repeat(n)+'x'+']'.repeat(n))}=solve('x');const empty:${q('['.repeat(n)+']'.repeat(n))}=solve('');void exact;void empty;`,
 [`solve(1);`,`const bad:'x'=solve('x');`,`const bad:number=solve('');`,`solve('x','y');`]);
});

family('Getter-key remapping surfaces', 'mapped as clauses; Capitalize; lazy callbacks',v=>{
 const xs=selectedFields(v),input=valueOf(xs),outputKeys=xs.map(f=>'get'+f.key[0].toUpperCase()+f.key.slice(1));
 return task(`getter-fields=${masks(v)}`,`export type Input=${shape(xs)};\nexport type Getters<T>={[K in keyof T as K extends string?\`get\${Capitalize<K>}\`:never]:()=>T[K]};`,
 '(input:Input): Getters<Input>',`const out:Record<string,()=>unknown>={};for(const key of Object.keys(input) as (keyof Input)[])out['get'+key[0]!.toUpperCase()+key.slice(1)]=()=>input[key];return out as Getters<Input>;`,
 `Create lazy zero-argument getters for ${xs.map(f=>f.key).join(', ')}. Remap each key to get+CapitalizedKey and retain its specific return type. Read the current source value on every call; do not snapshot. Return a fresh getter record.`,
 `const input=${q(input)};const out=solve(input);assert.deepEqual(Object.keys(out),${q(outputKeys)});${xs.map((f,i)=>`assert.equal(out.${outputKeys[i]}(),input.${f.key});`).join('')}assert.notEqual(out,solve(input));input.${xs[0].key}=${q(xs[0].value)};assert.equal(out.${outputKeys[0]}(),input.${xs[0].key});`,
 `const r=solve(${q(input)});const value:${xs[0].type}=r.${outputKeys[0]}();type Keys=Assert<Equal<keyof typeof r,${outputKeys.map(q).join('|')}>>;void value;`,
 [`solve({});`,`solve({...${q(input)},${xs[0].key}:${wrong(xs[0])}});`,`solve(${q(input)}).missing();`,`solve(${q(input)}).${outputKeys[0]}(1);`]);
});
family('Setter-key remapping surfaces', 'mapped as clauses; callback parameter correlation',v=>{
 const xs=selectedFields(v),input=valueOf(xs),keys=xs.map(f=>'set'+f.key[0].toUpperCase()+f.key.slice(1));
 return task(`setter-fields=${masks(v)}`,`export type Input=${shape(xs)};\nexport type Setters<T>={[K in keyof T as K extends string?\`set\${Capitalize<K>}\`:never]:(value:T[K])=>void};`,
 '(input:Input): Setters<Input>',`const out:Record<string,(value:unknown)=>void>={};for(const key of Object.keys(input) as (keyof Input)[]){out['set'+key[0]!.toUpperCase()+key.slice(1)]=(value:unknown)=>{Reflect.set(input,key,value);};}return out as Setters<Input>;`,
 `Create setter closures for ${xs.map(f=>f.key).join(', ')}. Each remapped setter accepts only its corresponding field type and mutates that field on the original input. Other fields must remain untouched. Construction itself has no mutation.`,
 `const input=${q(input)};const out=solve(input);assert.deepEqual(input,${q(input)});assert.deepEqual(Object.keys(out),${q(keys)});${xs.map((f,i)=>`assert.equal(out.${keys[i]}(${q(f.value)}),undefined);assert.deepEqual(input.${f.key},${q(f.value)});`).join('')}assert.notEqual(out,solve(input));`,
 `const r=solve(${q(input)});${xs.map((f,i)=>`r.${keys[i]}(${q(f.value)});`).join('')}type Keys=Assert<Equal<keyof typeof r,${keys.map(q).join('|')}>>;`,
 [`solve({});`,`solve(${q(input)}).${keys[0]}(${wrong(xs[0])});`,`solve(${q(input)}).missing(1);`,`solve(${q(input)}).${keys[0]}();`]);
});
family('Null-omitting optional property contracts', 'optional mapped modifiers; null exclusion; own-key omission',v=>{
 const xs=selectedFields(v),base=valueOf(xs),nullable='{'+xs.map(f=>`${f.key}:${f.type}|null`).join(';')+'}';
 return task(`omittable-fields=${masks(v)}`,`export type Input=${nullable};\nexport type Present<T>={[K in keyof T]?:Exclude<T[K],null>};`,
 '(input:Input): Present<Input>',`const out:Record<string,unknown>={};for(const [key,value] of Object.entries(input))if(value!==null)Object.defineProperty(out,key,{value,enumerable:true,writable:true,configurable:true});return out as Present<Input>;`,
 `Copy non-null fields and omit null-valued keys entirely. Every output key is optional but explicitly undefined is not allowed. Keep false, zero, empty strings and arrays. This contract differs from array compaction: absence is represented in mapped object modifiers.`,
 `const input=Object.freeze(${q(base)});assert.deepEqual(solve(input),input);assert.notEqual(solve(input),input);const nulled=${q(Object.fromEntries(xs.map(f=>[f.key,null])))};assert.deepEqual(solve(nulled),{});assert.equal(Object.hasOwn(solve({...input,${xs[0].key}:null}),${q(xs[0].key)}),false);`,
 `const r=solve(${q(base)});const maybe:${xs[0].type}|undefined=r.${xs[0].key};const empty:api.Present<api.Input>={};void maybe;void empty;`,
 [`solve({});`,`const bad:api.Present<api.Input>={${xs[0].key}:undefined};`,`const bad:api.Present<api.Input>={${xs[0].key}:null};`,`const bad:${xs[0].type}=solve(${q(base)}).${xs[0].key};`]);
});
family('Optional-property default materialization', 'mapped required modifiers; exact absence semantics',v=>{
 const xs=selectedFields(v),base=valueOf(xs);
 return task(`required-default-fields=${masks(v)}`,`export type Input={${xs.map(f=>f.key+'?:'+f.type).join(';')}};\nexport type Output={-readonly [K in keyof Input]-?:Input[K]};`,
 '(input:Input): Output',`return {...${q(base)},...input};`,
 `Materialize absent optional fields from the documented defaults ${q(base)}. Output requires every field and preserves its individual value type. Explicit undefined is forbidden; supplied false, zero and empty values override defaults. Return a fresh mutable record.`,
 `assert.deepEqual(solve({}),${q(base)});const supplied=Object.freeze(${q(base)});const r=solve(supplied);assert.deepEqual(r,supplied);assert.notEqual(r,supplied);assert.deepEqual(solve({${xs[0].key}:${q(xs[0].value)}}),${q(base)});`,
 `const r=solve({});const value:${xs[0].type}=r.${xs[0].key};r.${xs[0].key}=${q(xs[0].value)};type RequiredKeys=Assert<Equal<Required<api.Output>,api.Output>>;void value;`,
 [`solve({${xs[0].key}:undefined});`,`solve({${xs[0].key}:${wrong(xs[0])}});`,`const bad:api.Output={};`,`solve({missing:1});`]);
});
family('Key-value entry union serialization', 'indexed mapped unions; entry tuple correlations',v=>{
 const xs=selectedFields(v),base=valueOf(xs),first=xs[0];
 return task(`entry-union-fields=${masks(v)}`,`export type Input=${shape(xs)};\nexport type Entry<T>={[K in keyof T]-?:readonly [K,T[K]]}[keyof T];`,
 '(input:Input): readonly Entry<Input>[]',`return Object.entries(input) as Entry<Input>[];`,
 `Serialize the declared own enumerable string fields in Object.keys order into fresh [key,value] pairs. The return element type is a union of correlated tuples, not a cross-product of keys and values. Input contains exactly its declared own fields. Preserve array value references.`,
 `const input=Object.freeze(${q(base)});const out=solve(input);assert.deepEqual(out,${q(xs.map(f=>[f.key,f.value]))});assert.notEqual(out,solve(input));assert.equal(out[0][1],input.${first.key});assert.deepEqual(input,${q(base)});`,
 `const r=solve(${q(base)});for(const entry of r){if(entry[0]===${q(first.key)}){const value:${first.type}=entry[1];void value;}}const pair:api.Entry<api.Input>=[${q(first.key)},${q(first.value)}];void pair;`,
 [`solve({});`,`const e:api.Entry<api.Input>=[${q(first.key)},${wrong(first)}];`,`const e:api.Entry<api.Input>=['missing',1];`,`solve(${q(base)}).push([${q(first.key)},${q(first.value)}]);`]);
});
family('Schema-literal value inference', 'satisfies contracts; indexed discriminant inference',v=>{
 const xs=selectedFields(v),schema=Object.fromEntries(xs.map(f=>[f.key,{kind:f.type==='number'?'number':f.type==='boolean'?'boolean':f.type==='string'?'string':'strings'}])),base=valueOf(xs);
 return task(`schema-fields=${masks(v)}`,`export type Descriptor={kind:'number'|'string'|'boolean'|'strings'};\nexport const schema=${q(schema)} as const satisfies Record<string,Descriptor>;\nexport type Infer<S>={[K in keyof S]:S[K] extends {kind:'number'}?number:S[K] extends {kind:'boolean'}?boolean:S[K] extends {kind:'strings'}?readonly string[]:string};\nexport type Output=Infer<typeof schema>;`,
 '(input:unknown): Output',`if(typeof input!=='object'||input===null||Array.isArray(input))throw new Error('Invalid record');const record=input as Record<string,unknown>;${xs.map(f=>`if(!Object.hasOwn(record,${q(f.key)})||${f.type==='readonly string[]'?`!Array.isArray(record.${f.key})||!Array.from(record.${f.key} as unknown[]).every(x=>typeof x==='string')`:`typeof record.${f.key}!==${q(f.type)}`})throw new Error('Invalid ${f.key}');`).join('')}return {${xs.map(f=>`${f.key}:record.${f.key}`).join(',')}} as Output;`,
 `Decode unknown using the fixed satisfies-checked schema. Every declared own field is required with exact primitive type (strings means dense string arrays). Reject arrays/null/nonrecords, inherited-only fields, and wrong field values. Strip extra keys. Infer the output shape from schema literals rather than widening kinds.`,
 `const input=Object.freeze(${q(base)});assert.deepEqual(solve(input),input);assert.notEqual(solve(input),input);assert.deepEqual(solve({...input,extra:1}),input);assert.throws(()=>solve({}),/Invalid/);assert.throws(()=>solve(null),/Invalid/);assert.throws(()=>solve(Object.create(input)),/Invalid/);assert.throws(()=>solve({...input,${xs[0].key}:null}),/Invalid/);`,
 `const r=solve({});const value:${xs[0].type}=r.${xs[0].key};const s:api.Descriptor={kind:'string'};void value;void s;`,
 [`const bad:api.Descriptor={kind:'date'};`,`const bad:api.Output={};`,`const r=solve({});r.missing;`,`const bad:api.Output={...${q(base)},${xs[0].key}:${wrong(xs[0])}};`]);
});
family('Phantom capability authorization plans', 'phantom records; structural capabilities; input authority',v=>{
 const xs=selectedFields(v),keys=xs.map(f=>f.key),caps=Object.fromEntries(keys.map(k=>[k,true]));
 return task(`required-capabilities=${masks(v)}`,`declare const permit:unique symbol;\nexport type Permit<K extends string>={readonly [permit]:K;readonly capabilities:{readonly [P in K]:true}};\nexport type Needed=${keys.map(q).join('|')};\nexport type Plan={readonly allowed:readonly Needed[]};`,
 '(authority:Permit<Needed>): Plan',`const needed:Needed[]=${q(keys)};for(const key of needed)if(authority.capabilities[key]!==true)throw new Error('Missing capability');return {allowed:needed};`,
 `Build a plan requiring ${keys.join(', ')} capabilities. A Permit is minted by an external authorization layer, not by this exercise. The unique-symbol phantom marker prevents arbitrary plain records from being accepted. At runtime check all required true flags; return only required names in declaration order.`,
 `const authority={capabilities:${q(caps)}};assert.deepEqual(solve(authority),{allowed:${q(keys)}});assert.deepEqual(solve({capabilities:{...authority.capabilities,extra:true}}),{allowed:${q(keys)}});assert.throws(()=>solve({capabilities:{}}),/Missing capability/);assert.deepEqual(authority.capabilities,${q(caps)});`,
 `declare const authority:api.Permit<api.Needed>;const plan=solve(authority);const keys:readonly api.Needed[]=plan.allowed;declare const stronger:api.Permit<api.Needed|'extra'>;void stronger;void keys;`,
 [`solve({capabilities:${q(caps)}});`,`declare const wrong:api.Permit<'other'>;solve(wrong);`,`declare const p:api.Plan;p.allowed.push(${q(keys[0])});`,`declare const p:api.Plan;const bad:number=p.allowed[0];`]);
});
family('Exhaustive handler-table dispatch', 'mapped handler tables; complete coverage; return correlations',v=>{
 const xs=selectedFields(v),first=xs[0];
 return task(`handled-variants=${masks(v)}`,`export type Payloads=${shape(xs)};\nexport type Handlers={[K in keyof Payloads]:(value:Payloads[K])=>string};\nexport type Message={[K in keyof Payloads]:{kind:K;value:Payloads[K]}}[keyof Payloads];`,
 '(message:Message,handlers:Handlers): string',`const kind=message.kind;switch(kind){${xs.map(f=>`case ${q(f.key)}:return handlers.${f.key}(message.value);`).join('')}default:{const impossible:never=kind;return impossible;}}`,
 `Dispatch a ${xs.map(f=>f.key).join('/')} message through a complete typed handler table. Narrow before indexing so handler parameter types remain correlated. Invoke exactly one handler, return its result, and propagate its exceptions.`,
 `const seen=[];const handlers={${xs.map(f=>`${f.key}:value=>{seen.push(${q(f.key)});return JSON.stringify(value);}`).join(',')}};${xs.map(f=>`assert.equal(solve({kind:${q(f.key)},value:${q(f.value)}},handlers),${q(JSON.stringify(f.value))});`).join('')}assert.deepEqual(seen,${q(xs.map(f=>f.key))});assert.throws(()=>solve({kind:${q(first.key)},value:${q(first.value)}},{...handlers,${first.key}:()=>{throw Error('handler');}}),/handler/);`,
 `const handlers:api.Handlers={${xs.map(f=>`${f.key}:(value:${f.type})=>String(value)`).join(',')}};const s:string=solve({kind:${q(first.key)},value:${q(first.value)}},handlers);void s;`,
 [`const h:api.Handlers={};`,`const m:api.Message={kind:${q(first.key)},value:${wrong(first)}};`,`const m:api.Message={kind:'missing',value:1};`,`const h:api.Handlers={${xs.map(f=>`${f.key}:()=>1`).join(',')}};`]);
});
family('Readonly-key release maps', 'minus-readonly modifiers; selected mutable capability',v=>{
 const xs=selectedFields(v),base=valueOf(fields),first=xs[0],keys=xs.map(f=>f.key);
 return task(`released-readonly-fields=${masks(v)}`,`export type Input=${shape(fields,'readonly ')};\nexport type Released=${keys.map(q).join('|')};\nexport type Output=Omit<Input,Released>&{-readonly [K in Released]:Input[K]};`,
 '(input:Input): Output','return {...input};',
 `Copy a readonly record and release assignment capability only for ${keys.join(', ')}. Other fields stay readonly in the public result type. This is shallow: nested arrays keep their original readonly type and reference. Runtime creates a fresh ordinary object without freezing either object.`,
 `const input=Object.freeze(${q(base)});const out=solve(input);assert.deepEqual(out,input);assert.notEqual(out,input);assert.equal(out.tags,input.tags);assert.ok(!Object.isFrozen(out));out.${first.key}=${q(first.value)};assert.deepEqual(input,${q(base)});`,
 `const r=solve(${q(base)});${xs.map(f=>`r.${f.key}=${q(f.value)};`).join('')}const val:${first.type}=r.${first.key};void val;`,
 [`solve({});`,`solve(${q(base)}).${first.key}=${wrong(first)};`,`solve(${q(base)}).tags.push('x');`, fields.some(f=>!keys.includes(f.key))?`solve(${q(base)}).${fields.find(f=>!keys.includes(f.key)).key}=${q(fields.find(f=>!keys.includes(f.key)).value)};`:`solve(${q(base)}).missing=1;`]);
});
family('Exclusive option-set encodings', 'never forbidden properties; XOR-shaped unions',v=>{
 const xs=selectedFields(v),first=xs[0];
 const type=xs.map(f=>'{'+fields.map(g=>g.key===f.key?`${g.key}:${g.type}`:`${g.key}?:never`).join(';')+'}').join('|');
 return task(`exclusive-options=${masks(v)}`,`export type Options=${type};`,
 '(options:Options): string',`const keys=${q(xs.map(f=>f.key))};const present=keys.filter(key=>Object.hasOwn(options,key));if(present.length!==1)throw new Error('Choose exactly one');const key=present[0]!;return key+'='+JSON.stringify(Reflect.get(options,key));`,
 `Accept exactly one of ${xs.map(f=>f.key).join(', ')} options. Forbid all other option keys using optional never, including explicit undefined. Encode as key=JSON.stringify(value). From JavaScript, reject zero or multiple recognized options; inputs contain only declared keys.`,
 xs.map(f=>`assert.equal(solve({${f.key}:${q(f.value)}}),${q(f.key+'='+JSON.stringify(f.value))});`).join('')+`assert.throws(()=>solve({}),/Choose exactly one/);`+(xs.length>1?`assert.throws(()=>solve(${q(valueOf(xs))}),/Choose exactly one/);`:'')+`const input=Object.freeze({${first.key}:${q(first.value)}});assert.equal(solve(input),${q(first.key+'='+JSON.stringify(first.value))});`,
 `const s:string=solve({${first.key}:${q(first.value)}});${xs.map(f=>`const ${f.key}:api.Options={${f.key}:${q(f.value)}};void ${f.key};`).join('')}void s;`,
 [`solve({});`,`solve({${first.key}:${wrong(first)}});`,`solve({${first.key}:undefined});`,xs.length>1?`solve({${xs[0].key}:${q(xs[0].value)},${xs[1].key}:${q(xs[1].value)}});`:`solve({${first.key}:${q(first.value)},${fields.find(f=>f.key!==first.key).key}:undefined});`]);
});

family('Depth-limited readonly graph copies', 'recursive mapped readonly; bounded ownership',v=>{
 const n=v+1,example=depthValue(n,{leaf:7});
 return task(`readonly-depth=${n}`,`export type Deep<T,C extends unknown[]=[]>=C['length'] extends ${n}?T:T extends object?{readonly [K in keyof T]:Deep<T[K],[...C,unknown]>}:T;`,
 '<T>(input:T): Deep<T>',`function visit(value:unknown,depth:number):unknown{if(depth===${n}||value===null||typeof value!=='object')return value;const out:Record<string,unknown>|unknown[]=Array.isArray(value)?[]:{};for(const key of Object.keys(value))Object.defineProperty(out,key,{value:visit(Reflect.get(value,key),depth+1),enumerable:true});return Object.freeze(out);}return visit(input,0) as Deep<T>;`,
 `Clone and freeze exactly the first ${n} object levels, leaving values at the boundary by reference with their original mutable types. Inputs are acyclic plain records/dense arrays with enumerable string keys only. Preserve primitives. Depth 0 is the root.`,
 `const input=${q(example)};const out=solve(input);let a=input,b=out;for(let i=0;i<${n};i++){assert.notEqual(a,b);assert.ok(Object.isFrozen(b));assert.ok(!Object.isFrozen(a));a=a.next;b=b.next;}assert.equal(a,b);assert.ok(!Object.isFrozen(b));assert.equal(solve(null),null);assert.equal(solve(3),3);`,
 `const r=solve(${q(example)});r${deepAccess(n)}.leaf=8;const value:number=r${deepAccess(n)}.leaf;type Boundary=Assert<Equal<api.Deep<${depthType(n,'{leaf:number}')}>,${depthType(n,'{leaf:number}',true)}>>;void value;`,
 [`const r=solve(${q(example)});r.next=r.next;`,`const r=solve(${q(example)});r${deepAccess(n-1)}.next=r${deepAccess(n)};`,`const bad:string=solve(${q(example)})${deepAccess(n)}.leaf;`,`solve(${q(example)}).missing;`]);
});
family('Depth-limited patch materialization', 'recursive Partial; exact optional boundaries',v=>{
 const n=v+1,full=depthValue(n,{leaf:7});
 return task(`patch-depth=${n}`,`export type Model=${depthType(n,'{leaf:number}')};\nexport type Patch<T,C extends unknown[]=[]>=C['length'] extends ${n}?T:T extends object?{[K in keyof T]?:Patch<T[K],[...C,unknown]>}:T;`,
 '(patch:Patch<Model>): Model',`function merge(base:unknown,change:unknown,depth:number):unknown{if(depth===${n}||typeof base!=='object'||base===null)return change===undefined?base:change;const out:Record<string,unknown>={};for(const key of Object.keys(base)){const next=change!==null&&typeof change==='object'&&Object.hasOwn(change,key)?Reflect.get(change,key):undefined;out[key]=merge(Reflect.get(base,key),next,depth+1);}return out;}return merge(${q(full)},patch,0) as Model;`,
 `Materialize a nested patch over defaults ${q(full)}. Make properties optional only through depth ${n}; at the boundary the whole leaf object must be present if supplied. Missing fields use defaults, explicit undefined is forbidden. Boundary objects supplied by the caller retain their reference.`,
 `assert.deepEqual(solve({}),${q(full)});const supplied=${q(depthValue(n,{leaf:99}))};assert.deepEqual(solve(supplied),supplied);assert.equal(solve(supplied)${deepAccess(n)},supplied${deepAccess(n)});const out=solve({});assert.notEqual(out,solve({}));assert.deepEqual(supplied,${q(depthValue(n,{leaf:99}))});`,
 `const r:api.Model=solve({});const patch:api.Patch<api.Model>=${q(full)};solve(patch);const value:number=r${deepAccess(n)}.leaf;void value;`,
 [`solve({next:undefined});`,`solve(${q(depthValue(n,{}))});`,`solve(${q(depthValue(n,{leaf:'bad'}))});`,`const bad:string=solve({})${deepAccess(n)}.leaf;`]);
});
family('Nested promise-container inference', 'Awaited within recursive records; promise identity boundaries',v=>{
 const n=v+1,types=depthType(n,'Promise<number>');
 return task(`async-container-depth=${n}`,`export type Input=${types};\nexport type Resolved<T>=T extends PromiseLike<infer U>?Awaited<U>:T extends {next:infer N}?{next:Resolved<N>}:T;`,
 '(input:Input): Promise<Resolved<Input>>',`return (async()=>{let current:unknown=input;for(let i=0;i<${n};i++)current=(current as {next:unknown}).next;let out:unknown=await current;for(let i=0;i<${n};i++)out={next:out};return out as Resolved<Input>;})();`,
 `Resolve the promise at the leaf of exactly ${n} next containers. Return a Promise of newly built containers with a numeric leaf. Awaited applies to the leaf, not the surrounding record. Preserve rejection values and never mutate input.`,
 `const input=${'{next:'.repeat(n)}Promise.resolve(7)${'}'.repeat(n)};const out=await solve(input);assert.deepEqual(out,${q(depthValue(n,7))});assert.notEqual(out,input);const reason=Error('leaf');await assert.rejects(solve(${'{next:'.repeat(n)}Promise.reject(reason)${'}'.repeat(n)}),e=>e===reason);assert.deepEqual(await solve(${'{next:'.repeat(n)}Promise.resolve(0)${'}'.repeat(n)}),${q(depthValue(n,0))});`,
 `declare const input:api.Input;const result:Promise<${depthType(n,'number')}>=solve(input);async function check(){const r=await solve(input);const leaf:number=r${deepAccess(n)};void leaf;}void result;void check;`,
 [`solve(${q(depthValue(n,1))});`,`solve({});`,`declare const input:api.Input;const bad:string=solve(input);`,`declare const input:api.Input;async function bad(){const r=await solve(input);const p:Promise<number>=r${deepAccess(n)};}`]);
});
family('Finite protocol transition tables', 'state-dependent events; indexed transition return types',v=>{
 const n=v+1,states=numbers(n+1).map((_,i)=>'s'+i),pairs=states.slice(0,-1).map((s,i)=>[s,states[i+1]]);
 return task(`protocol-steps=${n}`,`export type State=${states.map(q).join('|')};\nexport type Next={${pairs.map(([s,t])=>`${s}:${q(t)}`).join(';')}};\nexport type Live=keyof Next;`,
 '<S extends Live>(state:S,event:"advance"): Next[S]',`if(event!=='advance')throw new Error('Invalid event');const table:Next=${q(Object.fromEntries(pairs))};if(!Object.hasOwn(table,state))throw new Error('Terminal state');return table[state];`,
 `Advance a linear ${n}-step protocol from s0 to terminal s${n}. Only nonterminal states accept advance; the return type must be the exact successor of the input state. This is not a generic counter reducer: legal transitions are statically indexed by state.`,
 pairs.map(([s,t])=>`assert.equal(solve(${q(s)},'advance'),${q(t)});`).join('')+`assert.throws(()=>solve(${q(states.at(-1))},'advance'),/Terminal state/);assert.throws(()=>solve('s0','reset'),/Invalid event/);`,
 `const next:'s1'=solve('s0','advance');const last:${q(states.at(-1))}=solve(${q(states.at(-2))},'advance');void next;void last;`,
 [`solve(${q(states.at(-1))},'advance');`,`solve('s0','reset');`,`const bad:'s0'=solve('s0','advance');`,`solve('s0');`]);
});
family('Completion-gated immutable builders', 'phantom missing-key sets; conditional method availability',v=>{
 const xs=selectedFields(v),base=valueOf(xs),first=xs[0],chain=xs.map(f=>`.set(${q(f.key)},${q(f.value)})`).join('');
 return task(`builder-required-fields=${masks(v)}`,`export type Model=${shape(xs)};\nexport type Builder<Missing extends keyof Model>={set:<K extends Missing>(key:K,value:Model[K])=>Builder<Exclude<Missing,K>>}&([Missing] extends [never]?{build:()=>Model}:{});`,
 '(): Builder<keyof Model>',`function make(data:Partial<Model>):unknown{return {set:(key:keyof Model,value:Model[keyof Model])=>make({...data,[key]:value}),build:()=>{for(const key of ${q(xs.map(f=>f.key))})if(!Object.hasOwn(data,key))throw new Error('Incomplete builder');return {...data};}};}return make({}) as Builder<keyof Model>;`,
 `Construct a persistent builder requiring ${xs.map(f=>f.key).join(', ')}. Each set removes exactly one missing key; already-set fields cannot be set again. build is visible only after all required fields are supplied. Each branch owns its snapshot, and build returns a fresh record.`,
 `const blank=solve();assert.throws(()=>blank.build(),/Incomplete builder/);const done=blank${chain};const a=done.build();assert.deepEqual(a,${q(base)});assert.notEqual(done.build(),a);assert.throws(()=>blank.build(),/Incomplete builder/);const other=solve()${chain};assert.deepEqual(other.build(),a);`,
 `const done=solve()${chain};const result:api.Model=done.build();const value:${first.type}=result.${first.key};void value;`,
 [`solve().build();`,`solve().set(${q(first.key)},${wrong(first)});`,`solve().set('missing',1);`,`solve()${chain}.set(${q(first.key)},${q(first.value)});`]);
});
family('Covariant producer widening', 'out variance annotations; readonly production contracts',v=>{
 const xs=selectedFields(v),base=valueOf(xs),first=xs[0];
 return task(`producer-output-fields=${masks(v)}`,`export type Model=${shape(xs)};\nexport interface Producer<out T>{readonly get:()=>T;}\nexport type View=Producer<Model>;`,
 '(producer:View): Producer<Partial<Model>>','return {get:()=>producer.get()};',
 `Adapt a producer of all ${xs.map(f=>f.key).join(', ')} fields to a producer whose public result is Partial<Model>. Preserve lazy reads and returned reference. Explicit out variance permits output widening but must reject narrowing a partial producer to a complete one.`,
 `let calls=0;const obj=${q(base)};const p=solve({get:()=>{calls++;return obj;}});assert.equal(calls,0);assert.equal(p.get(),obj);assert.equal(p.get(),obj);assert.equal(calls,2);assert.throws(()=>solve({get:()=>{throw Error('get');}}).get(),/get/);`,
 `const full:api.Producer<api.Model>={get:()=>(${q(base)})};const partial:api.Producer<Partial<api.Model>>=full;const out=solve(full);const value:${first.type}|undefined=out.get().${first.key};void partial;void value;`,
 [`const p:api.Producer<Partial<api.Model>>={get:()=>({})};const bad:api.Producer<api.Model>=p;`,`solve({get:()=>({})});`,`solve({get:()=>({...${q(base)},${first.key}:${wrong(first)}})});`,`const bad:${first.type}=solve({get:()=>(${q(base)})}).get().${first.key};`]);
});
family('Contravariant consumer narrowing', 'in variance annotations; callback substitution',v=>{
 const xs=selectedFields(v),base=valueOf(xs),first=xs[0];
 return task(`consumer-input-fields=${masks(v)}`,`export type Model=${shape(xs)};\nexport interface Consumer<in T>{readonly accept:(value:T)=>void;}`,
 '(consumer:Consumer<Partial<Model>>): Consumer<Model>','return {accept:value=>{consumer.accept(value);}};',
 `Adapt a consumer capable of handling any Partial<Model> to one publicly accepting complete Model records. This direction is safe by contravariance; the reverse is not. Construction must not call accept. Forward each reference exactly once, discard any callback return value so the adapter returns undefined, and propagate exceptions. A void callback type permits a value-returning function; it does not erase that value at runtime.`,
 `const seen=[];const c=solve({accept:value=>seen.push(value)});assert.equal(seen.length,0);const obj=${q(base)};assert.equal(c.accept(obj),undefined);assert.equal(seen[0],obj);assert.equal(seen.length,1);assert.throws(()=>solve({accept:()=>{throw Error('accept');}}).accept(obj),/accept/);`,
 `const broad:api.Consumer<Partial<api.Model>>={accept:value=>{void value;}};const narrow:api.Consumer<api.Model>=broad;const out=solve(broad);out.accept(${q(base)});void narrow;`,
 [`const narrow:api.Consumer<api.Model>={accept:value=>{void value;}};const bad:api.Consumer<Partial<api.Model>>=narrow;`,`solve({accept:(value:api.Model)=>{void value;}});`,`solve({accept:()=>{}}).accept({});`,`solve({accept:()=>{}}).accept({...${q(base)},${first.key}:${wrong(first)}});`]);
});
family('Invariant read-write cell copies', 'in out variance annotations; isolated mutable state',v=>{
 const xs=selectedFields(v),base=valueOf(xs),first=xs[0];
 return task(`cell-value-fields=${masks(v)}`,`export type Model=${shape(xs)};\nexport interface Cell<in out T>{get:()=>T;set:(value:T)=>void;}`,
 '(initial:Model): Cell<Model>','let current=initial;return {get:()=>current,set:value=>{current=value;}};',
 `Create an invariant cell of Model. Read/write capability makes both widening and narrowing unsafe. Preserve initial and replacement references, with independent state per cell. set returns undefined; do not mutate the values themselves.`,
 `const initial=${q(base)};const a=solve(initial),b=solve(initial);assert.equal(a.get(),initial);const next={...initial};assert.equal(a.set(next),undefined);assert.equal(a.get(),next);assert.equal(b.get(),initial);assert.deepEqual(initial,${q(base)});`,
 `const cell:api.Cell<api.Model>=solve(${q(base)});cell.set(${q(base)});const value:${first.type}=cell.get().${first.key};void value;`,
 [`const bad:api.Cell<Partial<api.Model>>=solve(${q(base)});`,`solve(${q(base)}).set({});`,`solve({...${q(base)},${first.key}:${wrong(first)}});`,`const bad:string=solve(${q(base)}).get();`]);
});
family('Explicit-this record methods', 'this parameters; call binding; receiver constraints',v=>{
 const xs=selectedFields(v),base=valueOf(xs),first=xs[0];
 return task(`this-receiver-fields=${masks(v)}`,`export type Receiver=${shape(xs)};\nexport type Method=(this:Receiver,prefix:string)=>string;`,
 '(): Method',`return function(this:Receiver,prefix:string):string{return prefix+${q(xs.map(f=>f.key))}.map(key=>String(Reflect.get(this,key))).join('|');};`,
 `Return a method requiring an explicit receiver with ${xs.map(f=>f.key).join(', ')}. Format prefix plus receiver values in declaration order, joined by | with String conversion. The function must use call-time this, not a captured object. Unbound calls are statically invalid.`,
 `const fn=solve();const obj=${q(base)};assert.equal(fn.call(obj,'>'),${q('>'+xs.map(f=>String(f.value)).join('|'))});assert.equal(fn.call(obj,''),${q(xs.map(f=>String(f.value)).join('|'))});const alt={...obj,${first.key}:${q(first.value)}};assert.equal(fn.call(alt,'!'),${q('!'+xs.map(f=>String(f.value)).join('|'))});assert.deepEqual(obj,${q(base)});`,
 `const fn:api.Method=solve();const s:string=fn.call(${q(base)},'>');const bound:(prefix:string)=>string=fn.bind(${q(base)});bound('x');void s;`,
 [`solve()('x');`,`solve().call({},'x');`,`solve().call(${q(base)},1);`,`solve().bind({...${q(base)},${first.key}:${wrong(first)}});`]);
});
family('Abstract renderer specialization', 'abstract classes; implements contracts; polymorphic calls',v=>{
 const xs=selectedFields(v),base=valueOf(xs),first=xs[0];
 return task(`abstract-render-fields=${masks(v)}`,`export type Model=${shape(xs)};\nexport abstract class Renderer {abstract render(value:Model):string;renderAll(values:readonly Model[]):string[]{return values.map(value=>this.render(value));}}`,
 '(): Renderer',`return new class extends Renderer {render(value:Model):string{return ${q(xs.map(f=>f.key))}.map(key=>JSON.stringify(Reflect.get(value,key))).join(',');}};`,
 `Implement the abstract Renderer for the selected ${xs.map(f=>f.key).join(', ')} model. render produces comma-joined JSON.stringify field values in declaration order. Inherited renderAll must dispatch to the override. No mutable renderer state and no constructor arguments.`,
 `const renderer=solve(),row=Object.freeze(${q(base)});assert.equal(renderer.render(row),${q(xs.map(f=>JSON.stringify(f.value)).join(','))});assert.deepEqual(renderer.renderAll([row,row]),${q(Array(2).fill(xs.map(f=>JSON.stringify(f.value)).join(',')))});assert.deepEqual(renderer.renderAll([]),[]);assert.notEqual(renderer,solve());`,
 `const renderer:api.Renderer=solve();const text:string=renderer.render(${q(base)});const all:string[]=renderer.renderAll([]);void text;void all;`,
 [`new api.Renderer();`,`class Broken extends api.Renderer {}` ,`solve().render({});`,`solve().render({...${q(base)},${first.key}:${wrong(first)}});`]);
});
family('Capability-composed audit mixins', 'intersection mixins; object augmentation; method capabilities',v=>{
 const xs=selectedFields(v),base=valueOf(xs),keys=xs.map(f=>'audit'+f.key[0].toUpperCase()+f.key.slice(1));
 return task(`audit-methods=${masks(v)}`,`export type Model=${shape(xs)};\nexport type Audited<T>=T&{${xs.map((f,i)=>`${keys[i]}:()=>string`).join(';')}};`,
 '<T extends Model>(input:T): Audited<T>',`return Object.assign({},input,{${xs.map((f,i)=>`${keys[i]}:()=>${q(f.key+'=')}+JSON.stringify(input.${f.key})`).join(',')}});`,
 `Mix audit methods into a shallow copy of any richer Model. Preserve extra property types through an intersection and keep the source unchanged. Each audit method reads the original object's current field value lazily. Input must not already contain the reserved audit method names.`,
 `const input={...${q(base)},extra:{id:1}};const out=solve(input);assert.notEqual(out,input);assert.equal(out.extra,input.extra);${xs.map((f,i)=>`assert.equal(out.${keys[i]}(),${q(f.key+'='+JSON.stringify(f.value))});assert.equal(Object.hasOwn(input,${q(keys[i])}),false);`).join('')}assert.notEqual(out,solve(input));`,
 `const out=solve({...${q(base)},extra:1});const extra:number=out.extra;const audit:string=out.${keys[0]}();void extra;void audit;`,
 [`solve({});`,`solve({...${q(base)},${xs[0].key}:${wrong(xs[0])}});`,`solve(${q(base)}).${keys[0]}(1);`,`const bad:number=solve(${q(base)}).${keys[0]}();`]);
});
family('Arity-directed overload selection', 'overload sets; conditional input-return relationships',v=>{
 const n=v+1,arity=tuple(Array(n).fill('number')),xs=numbers(n);
 return task(`overload-tuple-width=${n}`,`export type Batch=${arity};\nexport type API={ (value:number):string;(value:Batch):${tuple(Array(n).fill('string'))};};`,
 '(): API',`const run=(value:number|Batch):string|readonly string[]=>typeof value==='number'?String(value):value.map(String);return run as API;`,
 `Return an overloaded formatter: scalar number gives string; a readonly tuple of exactly ${n} numbers gives a readonly string tuple of the same arity. The implementation signature is not public, so union arguments need narrowing before a call. No mutation or locale formatting.`,
 `const format=solve();assert.equal(format(7),'7');assert.equal(format(0),'0');const input=Object.freeze(${q(xs)});assert.deepEqual(format(input),${q(xs.map(String))});assert.notEqual(format(input),input);assert.equal(format(-2),'-2');`,
 `const fn=solve();const scalar:string=fn(1);const batch:${tuple(Array(n).fill('string'))}=fn(${q(xs)});void scalar;void batch;`,
 [`solve()('1');`,`solve()(${q(xs.slice(1))});`,`const input:number|api.Batch=Math.random()?1:${q(xs)};solve()(input);`,`const bad:number=solve()(1);`]);
});
family('Index-tagged promise races', 'mapped tuple unions; Promise combinator attribution',v=>{
 const n=v+1,types=numbers(n).map((_,i)=>i%2?'string':'number'),vals=types.map((t,i)=>t==='string'?'v'+i:i+1);
 return task(`race-participants=${n}`,`export type Input=${tuple(types.map(t=>'PromiseLike<'+t+'>'))};\nexport type Winner=${types.map((t,i)=>`{readonly index:${i};readonly value:${t}}`).join('|')};`,
 '(inputs:Input): Promise<Winner>',`return Promise.race(inputs.map((input,index)=>Promise.resolve<number|string>(input).then(value=>({index,value})))) as Promise<Winner>;`,
 `Race exactly ${n} typed promise-like participants. Resolve to an index-tagged union that preserves the winning position's value type. Adopt the first settled participant, propagating rejection values unchanged. Do not cancel other promises.`,
 `const pending=Array(${n}).fill(null).map(()=>new Promise(()=>{}));pending[0]=Promise.resolve(${q(vals[0])});assert.deepEqual(await solve(pending),{index:0,value:${q(vals[0])}});const settled=${q(vals)}.map(Promise.resolve.bind(Promise));assert.deepEqual(await solve(settled),{index:0,value:${q(vals[0])}});const reason=Error('race');const bad=Array(${n}).fill(null).map(()=>new Promise(()=>{}));bad[0]=Promise.reject(reason);await assert.rejects(solve(bad),e=>e===reason);`,
 `const result:Promise<api.Winner>=solve([${vals.map(x=>'Promise.resolve('+q(x)+')').join(',')}]);async function check(){const r=await result;if(r.index===0){const value:number=r.value;void value;}}void check;`,
 [`solve([]);`,`solve([${vals.map((x,i)=>i===0?"Promise.resolve(false)":'Promise.resolve('+q(x)+')').join(',')}]);`,`const r:api.Winner={index:${n},value:1};`,`const r:api.Winner={index:0,value:'bad'};`]);
});
family('Keyed all-settled outcome maps', 'mapped object Awaited; rejection unknown; key retention',v=>{
 const xs=selectedFields(v),base=valueOf(xs),first=xs[0];
 return task(`settled-keys=${masks(v)}`,`export type Input={${xs.map(f=>`${f.key}:PromiseLike<${f.type}>`).join(';')}};\nexport type Outcome<T>={status:'fulfilled';value:T}|{status:'rejected';reason:unknown};\nexport type Output={[K in keyof Input]:Outcome<Awaited<Input[K]>>};`,
 '(input:Input): Promise<Output>',`return (async()=>{const entries=await Promise.all(Object.entries(input).map(async([key,value])=>{try{return [key,{status:'fulfilled',value:await value}] as const;}catch(reason:unknown){return [key,{status:'rejected',reason}] as const;}}));return Object.fromEntries(entries) as Output;})();`,
 `Settle all named promises without rejecting for participant failures. Preserve each key and its awaited payload type; rejection reasons stay unknown. Run concurrently, preserve own key order, return fresh per-key outcomes. Input has exactly the declared keys.`,
 `const input={${xs.map(f=>`${f.key}:Promise.resolve(${q(f.value)})`).join(',')}};const out=await solve(input);assert.deepEqual(out,${q(Object.fromEntries(xs.map(f=>[f.key,{status:'fulfilled',value:f.value}])))});const reason={why:'offline'};const failed=await solve({...input,${first.key}:Promise.reject(reason)});assert.equal(failed.${first.key}.status,'rejected');assert.equal(failed.${first.key}.reason,reason);assert.notEqual(out,await solve(input));`,
 `declare const input:api.Input;async function check(){const r=await solve(input);if(r.${first.key}.status==='fulfilled'){const value:${first.type}=r.${first.key}.value;void value;}else{const reason:unknown=r.${first.key}.reason;void reason;}}void check;`,
 [`solve({});`,`solve({${xs.map(f=>`${f.key}:${q(f.value)}`).join(',')}});`,`declare const r:api.Output;r.${first.key}.value;`,`declare const r:api.Output;if(r.${first.key}.status==='rejected')r.${first.key}.reason.message;`]);
});
family('Finite retry-attempt contracts', 'numeric literal unions; typed retry callbacks; failure boundaries',v=>{
 const n=v+1;
 return task(`maximum-attempts=${n}`,`export type Attempt=${numbers(n).join('|')};\nexport type Outcome<T>={ok:true;value:T;attempt:Attempt}|{ok:false;error:unknown;attempts:${n}};`,
 '<T>(work:(attempt:Attempt)=>T|PromiseLike<T>): Promise<Outcome<Awaited<T>>>',
 `return (async()=>{let error:unknown;for(let i=1;i<=${n};i++){try{return {ok:true,value:await work(i as Attempt),attempt:i as Attempt};}catch(caught:unknown){error=caught;}}return {ok:false,error,attempts:${n}};})();`,
 `Retry sequentially at most ${n} times with one-based attempt literals. No timers, jitter or external effects. Stop on first success, including undefined or false; after exhaustion return the exact last thrown value. Never invoke attempts beyond the typed union.`,
 `const attempts=[];assert.deepEqual(await solve(i=>{attempts.push(i);if(i<${n})throw 'later';return 7;}),{ok:true,value:7,attempt:${n}});assert.deepEqual(attempts,${q(numbers(n))});const reason={offline:true};assert.deepEqual(await solve(()=>Promise.reject(reason)),{ok:false,error:reason,attempts:${n}});let calls=0;assert.deepEqual(await solve(()=>{calls++;return false;}),{ok:true,value:false,attempt:1});assert.equal(calls,1);`,
 `const r:Promise<api.Outcome<number>>=solve(attempt=>{const a:api.Attempt=attempt;void a;return 1;});async function check(){const out=await r;if(!out.ok){const total:${n}=out.attempts;void total;}}void check;`,
 [`const bad:api.Attempt=${n+1};`,`solve(1);`,`const bad:Promise<api.Outcome<string>>=solve(()=>1);`,`declare const r:api.Outcome<number>;if(!r.ok)r.error.message;`]);
});
family('Cursor-page boundary metadata', 'cursor key projections; exact optional pagination unions',v=>{
 const xs=selectedFields(v),base=valueOf(xs),first=xs[0];
 return task(`cursor-key-fields=${masks(v)}`,`export type Row=${shape(xs)}&{readonly payload:unknown};\nexport type Cursor=${shape(xs,'readonly ')};\nexport type Page={items:readonly Row[];hasMore:false;next?:never}|{items:readonly Row[];hasMore:true;next:Cursor};`,
 '(rows:readonly Row[],limit:number): Page',`if(!Number.isSafeInteger(limit)||limit<1)throw new Error('Invalid limit');const items=rows.slice(0,limit);if(rows.length<=limit)return {items,hasMore:false};const last=items[items.length-1]!;return {items,hasMore:true,next:{${xs.map(f=>`${f.key}:last.${f.key}`).join(',')}}};`,
 `Take a lookahead page. If rows exceed a positive safe-integer limit, expose next cursor containing exactly ${xs.map(f=>f.key).join(', ')} from the last retained row; otherwise omit next entirely. Cursor excludes payload. Do not sort, mutate or fetch data.`,
 `const a={...${q(base)},payload:{a:1}},b={...${q(base)},payload:{b:2}};const out=solve(Object.freeze([a,b]),1);assert.deepEqual(out,{items:[a],hasMore:true,next:${q(base)}});assert.equal(out.items[0],a);assert.deepEqual(solve([a],1),{items:[a],hasMore:false});assert.deepEqual(solve([],1),{items:[],hasMore:false});for(const limit of [0,-1,1.5,NaN])assert.throws(()=>solve([],limit),/Invalid limit/);`,
 `const page=solve([{...${q(base)},payload:null}],1);if(page.hasMore){const v:${first.type}=page.next.${first.key};void v;}const done:api.Page={items:[],hasMore:false};void done;`,
 [`solve([{payload:1}],1);`,`const p:api.Page={items:[],hasMore:true};`,`const p:api.Page={items:[],hasMore:false,next:undefined};`,`declare const cursor:api.Cursor;cursor.payload;`]);
});
family('Unit-exponent quantity multiplication', 'unique-symbol dimension brands; exponent tuple composition',v=>{
 const n=v+1;
 return task(`left-length-exponent=${n}`,`declare const dimension:unique symbol;\nexport type Quantity<P extends readonly unknown[]> = number&{readonly [dimension]:P};\nexport type LengthPower=${tuple(Array(n).fill('"length"'))};\nexport type DurationPower=readonly ['time'];\nexport type Product=Quantity<readonly [...LengthPower,...DurationPower]>;`,
 '(length:Quantity<LengthPower>,duration:Quantity<DurationPower>): Product','return (length*duration) as Product;',
 `Multiply a branded length^${n} quantity by a duration, obtaining length^${n}*time. Brands are minted externally; plain numbers and dimensions in the wrong order must not be accepted. Runtime arithmetic is ordinary multiplication with no conversion; inputs and product are finite.`,
 `assert.equal(solve(3,4),12);assert.equal(solve(0,5),0);assert.equal(solve(-2,3),-6);assert.equal(solve(0.5,4),2);`,
 `declare const length:api.Quantity<api.LengthPower>;declare const time:api.Quantity<api.DurationPower>;const product:api.Product=solve(length,time);const n:number=product;void n;`,
 [`solve(1,2);`,`declare const l:api.Quantity<api.LengthPower>;declare const t:api.Quantity<api.DurationPower>;solve(t,l);`,`declare const p:api.Product;const bad:api.Quantity<api.LengthPower>=p;`,`const plain:api.Product=1;`]);
});
family('I18n named message argument inference', 'template placeholder inference; repeated named arguments',v=>{
 const n=v+1,text='Hello '+numbers(n).map(i=>'{name'+i+'}').join(', ')+'! {name1}',args=Object.fromEntries(numbers(n).map(i=>['name'+i,'N'+i]));
 return task(`message-arguments=${n}`,`export type Message=${q(text)};\nexport type Names<S extends string>=S extends \`\${string}{\${infer K}}\${infer Rest}\`?K|Names<Rest>:never;\nexport type Args={[K in Names<Message>]:string};`,
 '(args:Args): string',`return ${q(text)}.replace(/[{]([^}]+)[}]/g,(_,key:string)=>args[key as keyof Args]);`,
 `Render the fixed message ${text}. Every unique placeholder name is required once even when repeated in the message. Replace globally with raw argument text; no HTML/URI escaping, coercion or recursive interpolation. Placeholder-looking content inside a value stays literal.`,
 `assert.equal(solve(${q(args)}),${q('Hello '+numbers(n).map(i=>'N'+i).join(', ')+'! N1')});const alt={...${q(args)},name1:'{name1}'};assert.equal(solve(alt),${q('Hello '+numbers(n).map(i=>i===1?'{name1}':'N'+i).join(', ')+'! {name1}')});assert.equal(solve({...${q(args)},name1:''}).endsWith('! '),true);`,
 `const value:string=solve(${q(args)});type Keys=Assert<Equal<keyof api.Args,${numbers(n).map(i=>q('name'+i)).join('|')}>>;void value;`,
 [`solve({});`,`solve({...${q(args)},name1:1});`,`solve({...${q(args)},unknown:'x'});`,`const bad:number=solve(${q(args)});`]);
});
family('Index-safe fixed vector dot products', 'fixed tuple dimensions; corresponding input arity',v=>{
 const n=v+1,xs=numbers(n);
 return task(`vector-dimension=${n}`,`export type Vector=${tuple(Array(n).fill('number'))};`,
 '(left:Vector,right:Vector): number',`let total=0;for(let i=0;i<${n};i++)total+=left[i]!*right[i]!;return total;`,
 `Compute the dot product of two ${n}-dimensional vectors. Both tuple lengths are enforced statically. Do not mutate inputs. Numbers and intermediate arithmetic are finite. The indexed non-null assertions are justified by the loop bound matching the public tuple dimension.`,
 `assert.equal(solve(Object.freeze(${q(xs)}),Object.freeze(${q(xs)})),${xs.reduce((a,x)=>a+x*x,0)});assert.equal(solve(${q(xs)},${q(Array(n).fill(0))}),0);assert.equal(solve(${q(xs)},${q(Array(n).fill(-1))}),${-xs.reduce((a,x)=>a+x,0)});assert.equal(solve(${q(Array(n).fill(0.5))},${q(Array(n).fill(2))}),${n});`,
 `const v:api.Vector=${q(xs)};const number:number=solve(v,v);const length:${n}=v.length;void number;void length;`,
 [`solve([],${q(xs)});`,`solve(${q(xs)},${q(xs.slice(1))});`,`solve(["bad"${n>1?','+xs.slice(1).join(','):''}],${q(xs)});`,`const bad:string=solve(${q(xs)},${q(xs)});`]);
});
family('Typed coefficient polynomial evaluation', 'const tuple coefficient degree; exact arity contracts',v=>{
 const n=v+1,xs=numbers(n+1);
 return task(`polynomial-degree=${n}`,`export type Coefficients=${tuple(Array(n+1).fill('number'))};\nexport type Evaluation={readonly degree:${n};readonly value:number};`,
 '(coefficients:Coefficients,x:number): Evaluation',`let value=0;for(const coefficient of coefficients)value=value*x+coefficient;return {degree:${n},value};`,
 `Evaluate a degree-${n} coefficient tuple in descending-power order using Horner's method. Exactly ${n+1} coefficients are required, including leading zeros. Return the declared degree literal (not the effective nonzero degree) and computed value. Do not mutate input.`,
 `const cs=Object.freeze(${q(xs)});assert.deepEqual(solve(cs,1),{degree:${n},value:${xs.reduce((a,x)=>a+x,0)}});assert.deepEqual(solve(cs,0),{degree:${n},value:${n+1}});assert.deepEqual(solve(Array(${n+1}).fill(0),2),{degree:${n},value:0});assert.equal(solve(cs,-1).value,${xs.reduce((a,x)=>a*-1+x,0)});assert.deepEqual(cs,${q(xs)});`,
 `const r=solve(${q(xs)},2);const degree:${n}=r.degree;const value:number=r.value;void degree;void value;`,
 [`solve(${q(xs.slice(1))},1);`,`solve(${q(xs)},'1');`,`solve(${q(xs)},1).degree=${n};`,`const bad:${n+1}=solve(${q(xs)},1).degree;`]);
});

const options={target:'ES2022',module:'CommonJS',moduleResolution:'Node',strict:true,noUncheckedIndexedAccess:true,exactOptionalPropertyTypes:true,useUnknownInCatchVariables:true,noImplicitReturns:true,noFallthroughCasesInSwitch:true,skipLibCheck:true,types:[],noEmitOnError:true,forceConsistentCasingInFileNames:true};
const helpers=`type Assert<T extends true>=T;\ntype Equal<A,B>=(<T>()=>T extends A?1:2) extends (<T>()=>T extends B?1:2)?true:false;\ntype NotAny<T>=0 extends (1&T)?false:true;\ntype SafeFunction=Assert<NotAny<typeof solve>>;\n`;
const verifier=String.raw`'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const root=__dirname;
function argumentsOf(args){let id=null,starter=false,inventory=false;const seen=new Set();for(let i=0;i<args.length;i++){const arg=args[i];let key;if(arg==='--starters'){key='starters';starter=true;}else if(arg==='--inventory'){key='inventory';inventory=true;}else if(arg==='--id'||arg.startsWith('--id=')){key='id';const value=arg==='--id'?args[++i]:arg.slice(5);if(!value||!/^\d+$/.test(value))throw Error('--id needs an integer');id=Number(value);}else throw Error('Unknown argument: '+arg);if(seen.has(key))throw Error('Duplicate argument: '+key);seen.add(key);}return {id,starter,inventory};}
function inventory(manifest){assert.equal(manifest.length,750);assert.deepEqual(manifest.map(r=>r.id),Array.from({length:750},(_,i)=>1969+i));const seen=new Set(),groups=new Map();for(const row of manifest){assert.equal(row.tech,'ts');const key=row.family+'|'+row.semanticKey;assert.ok(!seen.has(key),'Duplicate semantic contract '+key);seen.add(key);groups.set(row.family,(groups.get(row.family)||0)+1);for(const field of ['prompt','starter','solution','test','positive','negative'])assert.ok(fs.statSync(path.join(root,row[field])).isFile(),'Missing '+field+' '+row.id);const negative=fs.readFileSync(path.join(root,row.negative),'utf8');assert.equal((negative.match(/@ts-expect-error/g)||[]).length,4);for(const field of ['positive','negative'])assert.ok(fs.readFileSync(path.join(root,row[field]),'utf8').includes("'../solutions/"+row.id+"'"),'Bad fixture import '+row.id);}assert.equal(groups.size,50);for(const count of groups.values())assert.equal(count,15);return {count:manifest.length,families:groups.size,first:1969,last:2718,files:4500};}
async function main(){
 const args=argumentsOf(process.argv.slice(2)),manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));const stats=inventory(manifest);
 const selected=args.id===null?manifest:manifest.filter(r=>r.id===args.id);if(!selected.length)throw Error('Unknown id: '+args.id);
 if(args.inventory){console.log(JSON.stringify({...stats,selected:selected.length},null,2));return;}
 assert.equal(require('typescript/package.json').version,'5.9.3','Requires existing pinned TypeScript 5.9.3');
 const mode=args.starter?'starter':'solution',log=[];const say=text=>{log.push(text);console.log(text);};
 const compilerTimeoutMs=args.id===null?2400000:300000;
 const report={track:'ts-next',mode,scope:args.id===null?'full':'single-id',requestedIds:selected.map(r=>r.id),compilerVersion:'5.9.3',compilerTimeoutMs,compilerPassed:false,runtimeStarted:false,blankControlPassed:false,passed:0,failed:0,exitCode:2,results:[]};
 const workRoot=path.join(root,'.verify');fs.mkdirSync(workRoot,{recursive:true});const work=fs.mkdtempSync(path.join(workRoot,'run-')),build=path.join(work,'build');
 try{
  const files=[];
  for(const row of selected){files.push(path.join(root,row[mode]));for(const field of ['positive','negative']){const source=fs.readFileSync(path.join(root,row[field]),'utf8');const token="'../solutions/"+row.id+"'";assert.ok(source.includes(token));const rebound=source.split(token).join(JSON.stringify('../../'+row[mode].replace(/\.ts$/,'')));assert.ok(!rebound.includes(token),'Fixture import was not rebound');if(args.starter)assert.ok(!rebound.includes('/solutions/'),'Starter fixture still bound to solution');const fixture=path.join(work,path.basename(row[field]));fs.writeFileSync(fixture,rebound);files.push(fixture);}}
  const config=path.join(work,'tsconfig.json');const base=JSON.parse(fs.readFileSync(path.join(root,'tsconfig.json'),'utf8'));fs.writeFileSync(config,JSON.stringify({compilerOptions:{...base.compilerOptions,rootDir:root,outDir:build},files}));
  say('TypeScript compiler gate: START (5.9.3; '+selected.length+' '+mode+' APIs; positive + negative fixtures bound to candidate).');
  const compiled=spawnSync(process.execPath,[require.resolve('typescript/lib/tsc.js'),'-p',config],{encoding:'utf8',timeout:compilerTimeoutMs,maxBuffer:16*1024*1024});
  if(compiled.stdout)say(compiled.stdout.trimEnd());if(compiled.stderr)say(compiled.stderr.trimEnd());if(compiled.error)say(String(compiled.error));
  if(compiled.status!==0){say('TypeScript compiler gate: FAILED; runtime tests NOT RUN.');report.results=selected.map(r=>({id:r.id,compiler:'failed',runtime:'not-run',todoMatch:false}));return;}
  report.compilerPassed=true;say('TypeScript compiler gate: PASSED before runtime.');report.runtimeStarted=true;
  for(const row of selected){try{const candidate=require(path.join(build,row[mode].replace(/\.ts$/,'.js')));assert.equal(typeof candidate.solve,'function');await require(path.join(root,row.test))(candidate.solve);report.passed++;report.results.push({id:row.id,compiler:'passed',runtime:'passed',todoMatch:false});say('PASS '+row.id+' '+row.title);}catch(error){const diagnostic=error&&error.stack||String(error);const todoMatch=!!error&&error.message==='TODO exercise '+row.id;report.failed++;report.results.push({id:row.id,compiler:'passed',runtime:'failed',todoMatch,diagnostic});say('FAIL '+row.id+' '+diagnostic);}}
  report.exitCode=report.failed?1:0;report.blankControlPassed=args.starter&&report.failed===selected.length&&report.results.every(r=>r.compiler==='passed'&&r.runtime==='failed'&&r.todoMatch);
  say(mode+': '+report.passed+' passed, '+report.failed+' failed.');if(args.starter)say('Blank control: '+(report.blankControlPassed?'PASSED (tsc passed, every runtime diagnostic matches its TODO exercise ID)':'NOT PROVEN (requires successful compiler and matching TODO for every selected ID)'));
 }catch(error){report.exitCode=2;say('SETUP ERROR: '+(error.stack||String(error)));}
 finally{
  report.completedAt=new Date().toISOString();fs.mkdirSync(path.join(root,'reports'),{recursive:true});
  const filename='verification-'+mode+(args.id===null?'':'-'+args.id)+'.json';fs.writeFileSync(path.join(root,filename),JSON.stringify(report,null,2)+'\n');
  // A single-ID run also updates the aggregate name with an explicit single-id scope; never claims a full suite.
  if(args.id!==null)fs.writeFileSync(path.join(root,'verification-'+mode+'.json'),JSON.stringify(report,null,2)+'\n');
  for(const result of report.results)fs.writeFileSync(path.join(root,'reports',mode+'-'+result.id+'.json'),JSON.stringify({mode,compilerVersion:'5.9.3',...result},null,2)+'\n');
  fs.appendFileSync(path.join(root,args.starter?'blank-control.log':'verification.log'),'\n=== '+report.completedAt+' '+report.scope+' ===\n'+log.join('\n')+'\nexitCode='+report.exitCode+'\n');
  fs.rmSync(work,{recursive:true,force:true});process.exitCode=report.exitCode;
 }
}
main().catch(error=>{console.error('SETUP ERROR: '+(error.stack||String(error)));process.exitCode=2;});
`;
function existingManifests(){const found=[];function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if(['node_modules','.git','.verify','ts-next'].includes(ent.name))continue;const full=path.join(dir,ent.name);if(ent.isDirectory())walk(full);else if(ent.name==='manifest.json'){const parsed=JSON.parse(fs.readFileSync(full,'utf8'));const rows=Array.isArray(parsed)?parsed:(parsed.exercises||parsed.items||[]);found.push({file:path.relative(root,full),rows});}}}walk(root);return found;}
function prepare(){assert.equal(families.length,50);assert.equal(new Set(families.map(f=>f.name)).size,50);const existing=existingManifests();for(const {file,rows} of existing)for(const row of rows){const id=Number(row.id);assert.ok(!(id>=1969&&id<=2718),'ID collision in '+file+': '+id);}const old=new Set(existing.filter(x=>/^ts-(more|final)[/\\]/.test(x.file)).flatMap(x=>x.rows.map(r=>r.family)));for(const f of families)assert.ok(!old.has(f.name),'Repeated old family '+f.name);
 const rows=[],files=new Map(),keys=new Set();const put=(name,content)=>{assert.ok(!files.has(name));files.set(name,content);};
 for(let f=0;f<families.length;f++){const signatures=new Set();for(let v=0;v<15;v++){
  const id=1969+15*f+v,def=families[f],t=enforceTupleDomain(def.create(v));const semantic=def.name+'|'+t.semanticKey;assert.ok(!keys.has(semantic),'Duplicate semantic key '+semantic);keys.add(semantic);
  const contract=crypto.createHash('sha256').update(t.prelude+'\n'+t.signature).digest('hex');assert.ok(!signatures.has(contract),'Renamed-only scenario in '+def.name);signatures.add(contract);
  const title=def.name+' / '+t.semanticKey;const header='// '+id+': '+title+'\n// '+def.topic+'\n';
  const signature='export function solve'+t.signature;
  put('solutions/'+id+'.ts',header+t.prelude+'\n'+signature+' {\n  '+t.body+'\n}\n');
  put('starters/'+id+'.ts',header+t.prelude+'\n'+signature+" {\n  // TODO: implement the public contract without changing its signature.\n  throw new Error('TODO exercise "+id+"');\n}\n");
  const runtime="'use strict';\nconst assert=require('node:assert/strict');\nmodule.exports=async function(solve){\n"+t.tests+'\n};\n';new (require('node:vm').Script)(runtime,{filename:'tests/'+id+'.cjs'});put('tests/'+id+'.cjs',runtime);
  const imports="import * as api from '../solutions/"+id+"';\nimport {solve} from '../solutions/"+id+"';\n";
  put('types/'+id+'.positive.ts',imports+helpers+t.positive+'\n');
  put('types/'+id+'.negative.ts',imports+t.negative.map((line,i)=>'// @ts-expect-error Case '+(i+1)+': '+['reject invalid input or unsafe variance','reject incompatible property/position type','reject missing capability or unsafe result access','reject invalid output/arity/mutability'][i]+'\n{ '+line.replace(/declare const (\w+):([^;]+);/g,'const $1=null as unknown as $2;')+' }').join('\n')+'\n');
  put('prompts/'+id+'.txt',id+': '+title+'\n\nContract focus: '+def.topic+'.\n\n'+t.prompt+'\n\nSemantic variation '+(v+1)+'/15: '+t.semanticKey+'. Other scenarios change the type contract (not a policy argument or just test data).\n\nImplement starters/'+id+'.ts. Keep exported types and signatures. Do not import solutions, use any, or silence errors. Localized assertions are allowed only to bridge the stated runtime invariant to a conditional/mapped type; never cast away invalid caller input.\n\nRuntime examples: tests/'+id+'.cjs. Type contracts: types/'+id+'.positive.ts and types/'+id+'.negative.ts. Fixtures compile but are never executed.\n\nPractice: node ts-next/verify.cjs --starters --id='+id+'\nReference: node ts-next/verify.cjs --id='+id+'\n');
  rows.push({id,tech:'ts',title,family:def.name,scenario:v+1,semanticKey:t.semanticKey,contractHash:contract,topic:def.topic,starter:'starters/'+id+'.ts',solution:'solutions/'+id+'.ts',test:'tests/'+id+'.cjs',positive:'types/'+id+'.positive.ts',negative:'types/'+id+'.negative.ts',prompt:'prompts/'+id+'.txt'});
 }}
 put('manifest.json',JSON.stringify(rows,null,2)+'\n');put('tsconfig.json',JSON.stringify({compilerOptions:{...options,outDir:'.build',rootDir:'.'},include:['solutions/**/*.ts','types/**/*.ts']},null,2)+'\n');put('verify.cjs',verifier);
 put('GUIDE.txt','TS-NEXT — STRUCTURAL TYPESCRIPT CONTRACT LAB\n\n750 new exercises; IDs 1969–2718; tech: ts. 50 families × 15 observably different public contracts. Not 750 unrelated algorithms. Variations alter recursive budgets, tuple dimensions, required key sets, allowed variants, or protocol states. The manifest records semanticKey and a public-contract SHA-256. Generator gates require family|semanticKey uniqueness and 15 distinct public contracts per family.\n\nArchitecture\nSix files per exercise: prompts/<id>.txt, starters/<id>.ts, solutions/<id>.ts, tests/<id>.cjs, types/<id>.positive.ts, types/<id>.negative.ts. Starters keep the type API but throw TODO exercise <id>. Solutions are independent and never imported by starters. Exactly four @ts-expect-error cases per negative fixture; positive fixtures guard against any on solve and assert concrete return/key/tuple types.\n\nWorkflow\n1. Read a prompt and implement its starter without changing the API.\n2. node ts-next/verify.cjs --starters --id=1969\n3. Reference: node ts-next/verify.cjs --id=1969\n4. Inventory (no compiler/runtime): node ts-next/verify.cjs --inventory\n5. Full suites (coordinator only during authoring): node ts-next/verify.cjs and node ts-next/verify.cjs --starters\n--id N is also supported. Unknown/duplicate arguments and unknown IDs exit 2.\n\nStrict gate\nThe existing local TypeScript 5.9.3 tsc CLI is required (never downloaded). strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes, useUnknownInCatchVariables, noImplicitReturns and noEmitOnError are enabled. Both positive AND negative imports are rebound to the candidate. tsc must pass before any runtime test. Fixtures are compile-only. A compiler failure is never accepted as a blank control.\n\nExit codes and evidence\n0: all runtime checks pass; 1: compiler passed but runtime grading failed; 2: setup/compiler/CLI failure. A valid blank control requires successful compiler followed by every selected runtime test failing with its exact TODO exercise ID. verification-solution.json and verification-starter.json record explicit scope and selected IDs; per-ID summary names and reports/<mode>-<id>.json preserve single-ID evidence. verification.log and blank-control.log append actual diagnostics. A single-ID report NEVER claims a full suite passed. Compiler scratch files are removed after each run.\n\nAuthoring and safety\nSource: ../build-ts-next.cjs. It refuses an existing ts-next directory, uses exclusive writes, checks existing manifests for ID collisions, and never touches root integration. --inventory builds and checks inventory in memory without writing. No installs, network, commits, or publishing. No full suites were run by the author; the coordinator must run them sequentially on the memory-limited machine.\n\nDomain notes\nTemplate-literal transformations specify their exact ASCII or placeholder domain. Tuple algebra rejects widened arrays. Mapped object APIs assume exactly their declared own string fields unless otherwise specified. Assertions bridge runtime iteration with types, not validation gaps. Type fixtures are regression contracts, not a proof against deliberate type escapes.\n\nFamilies\n'+families.map((f,i)=>(1969+i*15)+'–'+(1983+i*15)+': '+f.name+' ('+f.topic+')').join('\n')+'\n');
 return {rows,files,existing:existing.map(x=>({file:x.file,count:x.rows.length}))};
}
function main(){const args=process.argv.slice(2);if(args.length>1||(args.length===1&&args[0]!=='--inventory'))throw Error('Usage: node build-ts-next.cjs [--inventory]');const inventoryOnly=args[0]==='--inventory';if(!inventoryOnly&&fs.existsSync(destination))throw Error('Refusing existing ts-next directory');const prepared=prepare();if(inventoryOnly){console.log(JSON.stringify({exercises:prepared.rows.length,families:families.length,first:1969,last:2718,files:prepared.files.size,semanticKeys:750,existingManifests:prepared.existing},null,2));return;}fs.mkdirSync(destination);for(const [name,content] of prepared.files){const target=path.join(destination,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,content,{flag:'wx'});}console.log('Created ts-next: 750 exercises / 50 families / '+prepared.files.size+' files. Full suites NOT run.');}
if(require.main===module){try{main();}catch(error){console.error(error.stack||String(error));process.exitCode=2;}}
module.exports={families,prepare};
