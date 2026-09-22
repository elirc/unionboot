'use strict';
// Authoring catalog for scenario-based practice. Variants are labelled honestly.
// Refuses to replace an existing track or learner work.
const fs=require('node:fs'),path=require('node:path');
const root=__dirname;
const specs=[];
const add=(id,tech,title,requirements,body,cases,types='(input: any): any',typeChecks='')=>specs.push({id,tech,title,requirements,body,cases,types,typeChecks});
const fixtures=(...rows)=>rows.map(([input,expected])=>({input,expected}));
const policies=['keep-first','keep-last','reject','collect'];
for(let v=0;v<4;v++){
 const policy=policies[v];
 add(104+v,'js',`Index records: ${policy}`,
 `Input {rows:[{id,value}]} with string ids and primitive values. Return sorted [id,value] pairs. Duplicate policy: ${policy}; collect returns arrays even for a single value. reject throws Error for duplicates. Use Map so all string keys work. Preserve input.`,
 `const m=new Map();for(const row of input.rows){${v===0?'if(!m.has(row.id))m.set(row.id,row.value);':v===1?'m.set(row.id,row.value);':v===2?'if(m.has(row.id))throw new Error("Duplicate id");m.set(row.id,row.value);':'if(!m.has(row.id))m.set(row.id,[]);m.get(row.id).push(row.value);'}}return [...m].sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0);`,
 [...fixtures([{rows:[]},[]],[{rows:[{id:'b',value:2},{id:'a',value:1}]},v===3?[['a',[1]],['b',[2]]]:[['a',1],['b',2]]]),v===2?{input:{rows:[{id:'a',value:1},{id:'a',value:2}]},error:'Duplicate id'}:{input:{rows:[{id:'a',value:1},{id:'a',value:2}]},expected:[['a',v===0?1:v===1?2:[1,2]]]}]);
}
const joinKinds=['inner','left','full','anti'];
for(let v=0;v<4;v++){
 const kind=joinKinds[v];
 add(108+v,'js',`${kind} join by identifier`,
 `Input {left:[{id,value}],right:[{id,value}]}, unique numeric ids per side. Return ${kind==='anti'?'left-only [id,leftValue]':'[id,leftValueOrNull,rightValueOrNull]'} rows sorted by id. Implement a ${kind} join; null denotes an absent side. No mutation.`,
 `const a=new Map(input.left.map(r=>[r.id,r.value])),b=new Map(input.right.map(r=>[r.id,r.value]));const ids=[...new Set([...a.keys(),...b.keys()])].sort((x,y)=>x-y);return ids.filter(id=>${v===0?'a.has(id)&&b.has(id)':v===1?'a.has(id)':v===2?'true':'a.has(id)&&!b.has(id)'}).map(id=>${v===3?'[id,a.get(id)]':'[id,a.has(id)?a.get(id):null,b.has(id)?b.get(id):null]'});`,
 fixtures([{left:[],right:[]},[]],[{left:[{id:1,value:'a'},{id:2,value:'b'}],right:[{id:2,value:'B'},{id:3,value:'C'}]},v===0?[[2,'b','B']]:v===1?[[1,'a',null],[2,'b','B']]:v===2?[[1,'a',null],[2,'b','B'],[3,null,'C']]:[[1,'a']]],[{left:[],right:[{id:7,value:'x'}]},v===2?[[7,null,'x']]:[]]));
}
const paths=['sum','count','min','max'];
for(let v=0;v<4;v++)add(112+v,'js',`Aggregate nested tree: ${paths[v]}`,
 `Input null or a tree {value:number,children:Tree[]}. Return ${paths[v]} across all nodes. Empty tree returns ${v<2?'0':'null'}. Use a stack to handle deep trees without recursive calls.`,
 `if(input===null)return ${v<2?'0':'null'};const stack=[input];let result=${v===0||v===1?'0':v===2?'Infinity':'-Infinity'};while(stack.length){const n=stack.pop();${v===0?'result+=n.value;':v===1?'result++;':v===2?'result=Math.min(result,n.value);':'result=Math.max(result,n.value);'}stack.push(...n.children);}return result;`,
 fixtures([null,v<2?0:null],[{value:3,children:[]},v===1?1:3],[{value:2,children:[{value:-1,children:[]},{value:7,children:[]}]},[8,3,-1,7][v]]));
const metrics=['euclidean','manhattan','chebyshev','squared'];
for(let v=0;v<4;v++)add(116+v,'js',`Nearest point: ${metrics[v]} distance`,
 `Input {origin:[x,y],points:[[x,y],...]}. Return index of nearest point by ${metrics[v]} distance; first wins ties, -1 if empty. Coordinates are finite. Do not sort/mutate input.`,
 `let best=Infinity,index=-1;input.points.forEach((p,i)=>{const dx=Math.abs(p[0]-input.origin[0]),dy=Math.abs(p[1]-input.origin[1]);const d=${['Math.hypot(dx,dy)','dx+dy','Math.max(dx,dy)','dx*dx+dy*dy'][v]};if(d<best){best=d;index=i;}});return index;`,
 fixtures([{origin:[0,0],points:[]},-1],[{origin:[0,0],points:[[2,2],[3,0]]},[0,1,0,0][v]],[{origin:[1,1],points:[[1,2],[2,1]]},0]));
const roundModes=['floor','ceil','nearest-half-up','toward-zero'];
for(let v=0;v<4;v++)add(120+v,'js',`Quantize to a step: ${roundModes[v]}`,
 `Input {values:number[],step:number}; step must be finite and >0 or throw Error('Invalid step'). Round each value/step using ${roundModes[v]}, then multiply by step. nearest-half-up means Math.floor(x+0.5), including negatives. Normalize negative zero to zero.`,
 `if(!Number.isFinite(input.step)||input.step<=0)throw new Error('Invalid step');return input.values.map(n=>{const x=n/input.step;return ${['Math.floor(x)','Math.ceil(x)','Math.floor(x+0.5)','Math.trunc(x)'][v]}*input.step||0;});`,
 [...fixtures([{values:[],step:2},[]],[{values:[-3,-1,1,3],step:2},[[-4,-2,0,2],[-2,0,2,4],[-2,0,2,4],[-2,0,0,2]][v]]),{input:{values:[1],step:0},error:'Invalid step'}]);
const changeModes=['added','removed','changed','unchanged'];
for(let v=0;v<4;v++)add(124+v,'js',`Configuration diff: ${changeModes[v]}`,
 `Input {before,after} plain objects with primitive values. Return lexically sorted keys that were ${changeModes[v]}. Use own properties and Object.is for comparing present values; no mutation.`,
 `const {before,after}=input;return [...new Set([...Object.keys(before),...Object.keys(after)])].filter(k=>{const a=Object.hasOwn(before,k),b=Object.hasOwn(after,k);return ${['!a&&b','a&&!b','a&&b&&!Object.is(before[k],after[k])','a&&b&&Object.is(before[k],after[k])'][v]};}).sort();`,
 fixtures([{before:{a:1,b:2,c:3},after:{a:1,b:4,d:5}},[['d'],['c'],['b'],['a']][v]],[{before:{},after:{}},[]],[{before:{x:null},after:{x:null}},v===3?['x']:[]]));
const tieModes=['first','last','all','error'];
for(let v=0;v<4;v++)add(128+v,'js',`Best candidate with ${tieModes[v]} ties`,
 `Input array of {id:string,score:number}. Return ${v===2?'array of ids':'id or null'} of maximum-score candidates, using ${tieModes[v]} tie policy. ${v===3?'Throw Error("Tied score") if top score is shared.':''} Empty returns ${v===2?'[]':'null'}.`,
 `if(!input.length)return ${v===2?'[]':'null'};let best=-Infinity,ids=[];for(const r of input){if(r.score>best){best=r.score;ids=[r.id];}else if(r.score===best)ids.push(r.id);}${v===3?'if(ids.length>1)throw new Error("Tied score");':''}return ${v===2?'ids':v===1?'ids[ids.length-1]':'ids[0]'};`,
 [...fixtures([[],v===2?[]:null],[[{id:'a',score:1},{id:'b',score:2}],v===2?['b']:'b']),v===3?{input:[{id:'a',score:2},{id:'b',score:2}],error:'Tied score'}:{input:[{id:'a',score:2},{id:'b',score:2}],expected:v===2?['a','b']:v===1?'b':'a'}]);
const charModes=['letters','digits','whitespace','punctuation'];
for(let v=0;v<4;v++)add(132+v,'js',`Locate ${charModes[v]} runs`,
 `Input ASCII string. Return {start,end,text} for maximal runs of ${charModes[v]}, with end exclusive. Letters A–Z/a–z; digits 0–9; whitespace JS \\s; punctuation means non-alphanumeric, non-whitespace. Indices are UTF-16 offsets.`,
 `const out=[];const regex=${['/[a-z]+/gi','/[0-9]+/g','/\\s+/g','/[^a-z0-9\\s]+/gi'][v]};for(const match of input.matchAll(regex))out.push({start:match.index,end:match.index+match[0].length,text:match[0]});return out;`,
 fixtures(['ab12 !?',[[{start:0,end:2,text:'ab'}],[{start:2,end:4,text:'12'}],[{start:4,end:5,text:' '}],[{start:5,end:7,text:'!?'}]][v]],['',[]],['x',v===0?[{start:0,end:1,text:'x'}]:[]]));
const directionModes=['north','east','south','west'];
for(let v=0;v<4;v++)add(136+v,'js',`Robot navigation starting ${directionModes[v]}`,
 `Input string of L,R,F commands; invalid character throws Error('Invalid command'). Start at (0,0) facing ${directionModes[v]}. L/R turn90 degrees; F moves one unit; north increases y, east increases x. Return {x,y,direction} using N/E/S/W.`,
 `let x=0,y=0,d=${v};const steps=[[0,1],[1,0],[0,-1],[-1,0]];for(const c of input){if(c==='L')d=(d+3)%4;else if(c==='R')d=(d+1)%4;else if(c==='F'){x+=steps[d][0];y+=steps[d][1];}else throw new Error('Invalid command');}return {x,y,direction:'NESW'[d]};`,
 [...fixtures(['',{x:0,y:0,direction:'NESW'[v]}],['FFRFL', [{x:1,y:2,direction:'N'},{x:2,y:-1,direction:'E'},{x:-1,y:-2,direction:'S'},{x:-2,y:1,direction:'W'}][v]]),{input:'FX',error:'Invalid command'}]);
const freqModes=['intersection','union','subtract','symmetric'];
for(let v=0;v<4;v++)add(140+v,'js',`Multiset ${freqModes[v]}`,
 `Input {a:number[],b:number[]} of integers. Return sorted multiset ${freqModes[v]}. Multiplicities use ${['minimum','maximum','max(aCount-bCount,0)','absolute count difference'][v]}. Do not treat duplicates as a simple set.`,
 `const a=new Map(),b=new Map();for(const n of input.a)a.set(n,(a.get(n)||0)+1);for(const n of input.b)b.set(n,(b.get(n)||0)+1);const out=[];for(const n of [...new Set([...a.keys(),...b.keys()])].sort((x,y)=>x-y)){const x=a.get(n)||0,y=b.get(n)||0;out.push(...Array(${['Math.min(x,y)','Math.max(x,y)','Math.max(x-y,0)','Math.abs(x-y)'][v]}).fill(n));}return out;`,
 fixtures([{a:[1,1,2],b:[1,3,3]},[[1],[1,1,2,3,3],[1,2],[1,2,3,3]][v]],[{a:[],b:[]},[]],[{a:[4,4],b:[4,4]},v<2?[4,4]:[]]));
const queueModes=['drop-oldest','drop-newest','reject','grow'];
for(let v=0;v<4;v++)add(144+v,'js',`Bounded event buffer: ${queueModes[v]}`,
 `Input {capacity,events}; capacity positive integer or Error('Invalid capacity'). Process primitive events in order. On capacity overflow ${queueModes[v]} ${v===2?'with Error("Overflow")':''}. Return final buffer, leaving events unchanged. grow ignores the cap after validation.`,
 `if(!Number.isInteger(input.capacity)||input.capacity<1)throw new Error('Invalid capacity');const out=[];for(const e of input.events){if(out.length===input.capacity){${v===0?'out.shift();':v===1?'continue;':v===2?'throw new Error("Overflow");':''}}out.push(e);}return out;`,
 [ ...fixtures([{capacity:2,events:[]},[]],[{capacity:2,events:['a','b']},['a','b']]),v===2?{input:{capacity:2,events:['a','b','c']},error:'Overflow'}:{input:{capacity:2,events:['a','b','c']},expected:v===0?['b','c']:v===1?['a','b']:['a','b','c']},{input:{capacity:0,events:[]},error:'Invalid capacity'}]);
const bounds=['closed','open','left-closed','right-closed'];
for(let v=0;v<4;v++)add(148+v,'js',`Interval membership: ${bounds[v]}`,
 `Input {start,end,values}. Reject start>end with Error('Invalid interval'). Return values within ${bounds[v]} interval: ${['start<=x<=end','start<x<end','start<=x<end','start<x<=end'][v]}. Preserve order/duplicates.`,
 `if(input.start>input.end)throw new Error('Invalid interval');return input.values.filter(x=>${['x>=input.start&&x<=input.end','x>input.start&&x<input.end','x>=input.start&&x<input.end','x>input.start&&x<=input.end'][v]});`,
 [...fixtures([{start:1,end:3,values:[0,1,2,3,4]},[[1,2,3],[2],[1,2],[2,3]][v]],[{start:2,end:2,values:[2]},v===0?[2]:[]]),{input:{start:3,end:1,values:[]},error:'Invalid interval'}]);
const words=['kebab','snake','camel','pascal'];
for(let v=0;v<4;v++)add(152+v,'js',`Identifier conversion: ${words[v]}`,
 `Input string, tokenize maximal ASCII letter/digit runs, lowercase tokens, return ${words[v]}Case identifier. Punctuation and whitespace separate tokens. Empty/no tokens returns ''. camel lowercases first token; pascal capitalizes every token.`,
 `const tokens=(input.match(/[a-z0-9]+/gi)||[]).map(x=>x.toLowerCase());return ${v<2?`tokens.join('${v===0?'-':'_'}')`:`tokens.map((w,i)=>${v===2?'i===0?w:':''}w[0].toUpperCase()+w.slice(1)).join('')`};`,
 fixtures(['Hello__WORLD 42',['hello-world-42','hello_world_42','helloWorld42','HelloWorld42'][v]],['---',''],['x',v===3?'X':'x']));
const runMetrics=['longest','shortest','first','last'];
for(let v=0;v<4;v++)add(156+v,'js',`Positive streak: ${runMetrics[v]}`,
 `Input finite-number array. Return {start,length} for ${runMetrics[v]} contiguous run of strictly positive numbers, or null. ${v<2?'First run wins equal lengths.':''} Zero/negative breaks a streak.`,
 `const runs=[];for(let i=0;i<input.length;){if(input[i]<=0){i++;continue;}const start=i;while(i<input.length&&input[i]>0)i++;runs.push({start,length:i-start});}if(!runs.length)return null;${v<2?`return runs.reduce((best,r)=>r.length${v===0?'>':'<'}best.length?r:best);`:`return runs[${v===2?'0':'runs.length-1'}];`}`,
 fixtures([[1,2,0,3,-1,4,5,6],[{start:5,length:3},{start:3,length:1},{start:0,length:2},{start:5,length:3}][v]],[[],null],[[0,-2],null],[[1],{start:0,length:1}]));
const diagonalModes=['main','anti','above','below'];
for(let v=0;v<4;v++)add(160+v,'js',`Square matrix ${diagonalModes[v]} sum`,
 `Input square matrix of finite numbers; [] returns0. Reject non-square rows with Error('Not square'). Sum ${['main diagonal','anti-diagonal','strictly above main diagonal','strictly below main diagonal'][v]} cells, no mutation.`,
 `const n=input.length;if(input.some(r=>r.length!==n))throw new Error('Not square');let sum=0;for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(${['r===c','r+c===n-1','c>r','r>c'][v]})sum+=input[r][c];return sum;`,
 [...fixtures([[[1,2,3],[4,5,6],[7,8,9]],[15,15,11,19][v]],[[],0],[[[7]],v<2?7:0]),{input:[[1,2]],error:'Not square'}]);
const orderings=['preorder','postorder','level-order','leaves-only'];
for(let v=0;v<4;v++)add(164+v,'js',`Tree labels in ${orderings[v]}`,
 `Input null or {label:string,children:Node[]}. Return labels in ${orderings[v]}, respecting child order. No mutation; trees contain no cycles. leaves-only uses depth-first order.`,
 `if(input===null)return [];const out=[];${v===2?`const q=[input];for(let i=0;i<q.length;i++){out.push(q[i].label);q.push(...q[i].children);}`:`function visit(n){${v===0?'out.push(n.label);':''}${v===3?'if(!n.children.length)out.push(n.label);':''}for(const c of n.children)visit(c);${v===1?'out.push(n.label);':''}}visit(input);`}return out;`,
 fixtures([null,[]],[{label:'a',children:[{label:'b',children:[{label:'d',children:[]}]},{label:'c',children:[]}]},[['a','b','d','c'],['d','b','c','a'],['a','b','c','d'],['d','c']][v]],[{label:'x',children:[]},['x']]));
const stepModes=['add','multiply','power','clamp'];
for(let v=0;v<4;v++)add(168+v,'js',`Process tagged ${stepModes[v]} instructions`,
 `Input {initial,steps}. Each step must have type '${stepModes[v]}' or throw Error('Unknown operation'). Apply ${['step.value addition','step.value multiplication','raise current to step.value','clamp current between step.min and step.max'][v]} left-to-right. Return {value,trace} where trace records each result. Finite valid values supplied.`,
 `let value=input.initial;const trace=[];for(const step of input.steps){if(step.type!=='${stepModes[v]}')throw new Error('Unknown operation');value=${['value+step.value','value*step.value','value**step.value','Math.min(step.max,Math.max(step.min,value))'][v]};trace.push(value);}return {value,trace};`,
 [...fixtures([{initial:2,steps:[]},{value:2,trace:[]}],[{initial:2,steps:v===3?[{type:'clamp',min:3,max:5},{type:'clamp',min:0,max:1}]:[{type:stepModes[v],value:3},{type:stepModes[v],value:2}]},[{value:7,trace:[5,7]},{value:12,trace:[6,12]},{value:64,trace:[8,64]},{value:1,trace:[3,1]}][v]]),{input:{initial:0,steps:[{type:'nope'}]},error:'Unknown operation'}]);
const percentiles=[0,25,75,100];
for(let v=0;v<4;v++)add(172+v,'js',`Interpolated percentile ${percentiles[v]}`,
 `Input finite-number array. Sort a copy. Return percentile ${percentiles[v]} using linear interpolation at (length-1)*p/100; null if empty. Do not mutate input.`,
 `if(!input.length)return null;const a=[...input].sort((x,y)=>x-y),index=(a.length-1)*${percentiles[v]}/100,lo=Math.floor(index),hi=Math.ceil(index);return a[lo]+(a[hi]-a[lo])*(index-lo);`,
 fixtures([[],null],[[30,0,20,10],[0,7.5,22.5,30][v]],[[4],4]));
const edgeOps=['sources','sinks','isolated','self-looped'];
for(let v=0;v<4;v++)add(176+v,'js',`Graph classification: ${edgeOps[v]}`,
 `Input {nodes:string[],edges:[from,to][]}. Nodes unique, edges reference nodes; duplicate edges permitted. Return sorted labels of ${['nodes with no incoming edges','nodes with no outgoing edges','nodes with neither incoming nor outgoing edges','nodes with an edge to themselves'][v]}.`,
 `const incoming=new Set(input.edges.map(e=>e[1])),outgoing=new Set(input.edges.map(e=>e[0])),self=new Set(input.edges.filter(e=>e[0]===e[1]).map(e=>e[0]));return input.nodes.filter(n=>${['!incoming.has(n)','!outgoing.has(n)','!incoming.has(n)&&!outgoing.has(n)','self.has(n)'][v]}).sort();`,
 fixtures([{nodes:['a','b','c','d'],edges:[['a','b'],['b','b'],['a','b']]},[['a','c','d'],['c','d'],['c','d'],['b']][v]],[{nodes:[],edges:[]},[]],[{nodes:['x'],edges:[]},v===3?[]:['x']]));
const mismatchModes=['strict','ignore-case','ignore-space','alphanumeric'];
for(let v=0;v<4;v++)add(180+v,'js',`Compare text under ${mismatchModes[v]} normalization`,
 `Input {a,b} strings. Normalize with ${['no changes','lowercase only','remove all whitespace only','lowercase and remove all characters except ASCII letters/digits'][v]}. Return {equal,firstDifference} where index is in normalized strings, -1 if equal; shorter-prefix mismatch is at shorter length.`,
 `const norm=s=>${['s','s.toLowerCase()','s.replace(/\\s/g,"")','s.toLowerCase().replace(/[^a-z0-9]/g,"")'][v]};const a=norm(input.a),b=norm(input.b);let i=0;while(i<Math.min(a.length,b.length)&&a[i]===b[i])i++;const equal=a===b;return {equal,firstDifference:equal?-1:i};`,
 fixtures([{a:'A b!',b:'ab'},[{equal:false,firstDifference:0},{equal:false,firstDifference:1},{equal:false,firstDifference:0},{equal:true,firstDifference:-1}][v]],[{a:'x',b:'xy'},{equal:false,firstDifference:1}],[{a:'',b:''},{equal:true,firstDifference:-1}]));

// TypeScript: twenty API families, five explicitly labelled policy cases each.
const typeVariants=['basic','empty-boundary','duplicate-values','negative-values','large-values'];
const datasets=[[1,2,3],[],[2,2,2],[-3,-1,2],[100,200,300]];
for(let family=0;family<20;family++)for(let v=0;v<5;v++){
 const id=184+family*5+v;
 const x=datasets[v];
 const typedFamilies=[
 ['Sum readonly numbers','(input: readonly number[]): number','return input.reduce((sum,n)=>sum+n,0);',a=>a.reduce((p,n)=>p+n,0)],
 ['Map to labelled records','(input: readonly number[]): {index:number; value:number}[]','return input.map((value,index)=>({index,value}));',a=>a.map((value,index)=>({index,value}))],
 ['Discriminated sign union',"(input: readonly number[]): ({kind:'negative';value:number}|{kind:'nonnegative';value:number})[]","return input.map(value=>value<0?{kind:'negative' as const,value}:{kind:'nonnegative' as const,value});",a=>a.map(value=>({kind:value<0?'negative':'nonnegative',value}))],
 ['Optional first value','(input: readonly number[]): number | undefined','return input[0];',a=>a[0]],
 ['Readonly tuple bounds','(input: readonly number[]): readonly [number,number] | null','return input.length?[Math.min(...input),Math.max(...input)] as const:null;',a=>a.length?[Math.min(...a),Math.max(...a)]:null],
 ['Typed Result mean',"(input: readonly number[]): {ok:true;value:number}|{ok:false;error:'empty'}","return input.length?{ok:true,value:input.reduce((s,n)=>s+n,0)/input.length}:{ok:false,error:'empty'};",a=>a.length?{ok:true,value:a.reduce((s,n)=>s+n,0)/a.length}:{ok:false,error:'empty'}],
 ['Record frequency index','(input: readonly number[]): Record<string,number>','const out:Record<string,number>={};for(const n of input){const k=String(n);out[k]=(out[k]??0)+1;}return out;',a=>{const o={};for(const n of a)o[n]=(o[n]||0)+1;return o;}],
 ['Generic identity copy','<T>(input: readonly T[]): T[]','return [...input];',a=>[...a]],
 ['Generic pair each element','<T>(input: readonly T[]): [T,T][]','return input.map(value=>[value,value]);',a=>a.map(n=>[n,n])],
 ['Generic last value','<T>(input: readonly T[]): T | undefined','return input[input.length-1];',a=>a.at(-1)],
 ['Exclude negative numbers','(input: readonly number[]): number[]','return input.filter(n=>n>=0);',a=>a.filter(n=>n>=0)],
 ['Cumulative typed records','(input: readonly number[]): {input:number;total:number}[]','let total=0;return input.map(n=>({input:n,total:total+=n}));',a=>{let s=0;return a.map(n=>({input:n,total:s+=n}));}],
 ['Tuple neighbouring differences','(input: readonly number[]): [number,number,number][]','return input.slice(1).map((n,i)=>[input[i]!,n,n-input[i]!]);',a=>a.slice(1).map((n,i)=>[a[i],n,n-a[i]])],
 ['Union numeric parser','(input: readonly (number|string)[]): number[]',"return input.map(n=>{const value=typeof n==='number'?n:Number(n);if(!Number.isFinite(value))throw new Error('Invalid number');return value;});",a=>a.map(Number)],
 ['Nullable count summary','(input: readonly number[] | null): {count:number;empty:boolean}','return {count:input?.length??0,empty:!input?.length};',a=>({count:a?.length??0,empty:!a?.length})],
 ['Typed sorted set','(input: readonly number[]): number[]','return [...new Set(input)].sort((a,b)=>a-b);',a=>[...new Set(a)].sort((a,b)=>a-b)],
 ['Discriminated parity labels',"(input: readonly number[]): {value:number;parity:'even'|'odd'}[]","return input.map(value=>({value,parity:value%2===0?'even':'odd'}));",a=>a.map(value=>({value,parity:value%2===0?'even':'odd'}))],
 ['Readonly input reversal','<T>(input: readonly T[]): T[]','return [...input].reverse();',a=>[...a].reverse()],
 ['Optional object entries','(input: readonly number[]): {value:number;previous?:number}[]','return input.map((value,i)=>i===0?{value}:{value,previous:input[i-1]!});',a=>a.map((value,i)=>i===0?{value}:{value,previous:a[i-1]} )],
 ['Typed running product','(input: readonly number[]): number[]','let product=1;return input.map(n=>product*=n);',a=>{let p=1;return a.map(n=>p*=n);}],
 ];
 const [title,types,body,oracle]=typedFamilies[family];
 // The variant adds a literal configuration contract, not just another filename.
 // Five variants enforce distinct allowed policy tokens with a branded return field.
 const tag=`${family}-${v}`;
 const returnType=types.slice(types.lastIndexOf('):')+2).trim();
 const generic=types.startsWith('<T>');
 const parameter=types.slice(types.indexOf('(')+1,types.lastIndexOf('):'));
 const completeType=`${generic?'<T>':''}(${parameter}, policy: '${tag}'): {policy:'${tag}'; result:${returnType}}`;
 const wrapped=`const compute = ${generic?'':' ' }(${parameter}): ${returnType} => {${body}};return {policy,result:compute(input)};`;
 // Inputs/outputs encoded in code when undefined occurs (JSON would omit it).
 const cases=[x,[0,1],[-1,0,1]].map(input=>({input,expected:{policy:tag,result:oracle(input)},args:[tag]}));
 if(family===13)cases.push({input:['2','-1'],args:[tag],expected:{policy:tag,result:[2,-1]}});
 if(family===14)cases.push({input:null,args:[tag],expected:{policy:tag,result:oracle(null)}});
 const positive=generic?`const preserved=solve(['a','b'] as const,'${tag}'); void preserved;`:`const good=solve([1,2] as const,'${tag}');void good;`;
 const negative=`// @ts-expect-error policy token must match this scenario\nsolve([], 'wrong-policy');\n// @ts-expect-error input must be an array (or documented null), not a number\nsolve(42, '${tag}');\n`;
 add(id,'ts',`${title} / ${typeVariants[v]}`,
 `Implement the stated API under strict TypeScript. Scenario policy literal '${tag}' is required as the second argument and returned unchanged. Return {policy,result}. ${title}; preserve input. See examples for boundary behavior. Avoid any. This is a typed scenario variant in a 20-family track.`,wrapped,cases,completeType,positive+'\n'+negative);
}

// Mixed track: seventy JS and sixty-five TS policy-rich data pipelines.
// Each task uses a different combination of predicate, projection, ordering,
// grouping, pagination and boundary treatment. These are scenario variants.
for(let n=0;n<135;n++){
 const id=384+n,tech=n<70?'js':'ts';
 const threshold=[0,10,20,30,40][n%5],descending=Math.floor(n/5)%2===1;
 const status=['any','open','closed'][Math.floor(n/10)%3];
 const aggregate=['rows','total','groups'][Math.floor(n/30)%3];
 const skip=Math.floor(n/90),limit=2+(Math.floor(n/15)%3);
 const ascendingRows=[{id:'a',amount:5,status:'open',team:'red'},{id:'b',amount:15,status:'closed',team:'blue'},{id:'c',amount:25,status:'open',team:'red'},{id:'d',amount:35,status:'closed',team:'blue'},{id:'e',amount:45,status:'open',team:'red'}];
 const check=(rows)=>{
  const selected=rows.filter(r=>r.amount>=threshold&&(status==='any'||r.status===status)).map(r=>({...r})).sort((a,b)=>(descending?b.amount-a.amount:a.amount-b.amount)||(a.id<b.id?-1:a.id>b.id?1:0)).slice(skip,skip+limit);
  if(aggregate==='total')return {count:selected.length,total:selected.reduce((a,r)=>a+r.amount,0)};
  if(aggregate==='groups'){const groups={};for(const r of selected)groups[r.team]=(groups[r.team]||0)+r.amount;return Object.entries(groups).sort(([a],[b])=>a<b?-1:a>b?1:0);}
  return selected.map(r=>({id:r.id,amount:r.amount}));
 };
 const typed=tech==='ts';
 const body=`const selected=input.filter(r=>r.amount>=${threshold}${status==='any'?'':`&&r.status==='${status}'`}).map(r=>({...r})).sort((a,b)=>${descending?'b.amount-a.amount':'a.amount-b.amount'}||(a.id<b.id?-1:a.id>b.id?1:0)).slice(${skip},${skip+limit});${aggregate==='rows'?'return selected.map(r=>({id:r.id,amount:r.amount}));':aggregate==='total'?'return {count:selected.length,total:selected.reduce((s,r)=>s+r.amount,0)};':`const groups${typed?':Record<string,number>':''}={};for(const r of selected)groups[r.team]=(groups[r.team]??0)+r.amount;return Object.entries(groups).sort(([a],[b])=>a<b?-1:a>b?1:0);`}`;
 const inputType="readonly {id:string;amount:number;status:'open'|'closed';team:string}[]";
 const outputType=aggregate==='rows'?'{id:string;amount:number}[]':aggregate==='total'?'{count:number;total:number}':'[string,number][]';
 add(id,tech,`Report policy ${n+1}: ${status}, min ${threshold}, ${aggregate}`,
 `Filter records by amount >=${threshold}, status ${status}; sort amount ${descending?'descending':'ascending'}, ties id ascending (code-unit). Skip ${skip}, take ${limit}. ${aggregate==='rows'?'Return {id,amount} rows.':aggregate==='total'?'Return {count,total} for selected rows.':'Return [team,totalAmount] pairs sorted by team, grouping only selected rows.'} Never mutate input. Records are valid, amounts finite, IDs unique.`,body,
 fixtures([ascendingRows,check(ascendingRows)],[[],check([])],[[{id:'z',amount:threshold,status:'open',team:'solo'}],check([{id:'z',amount:threshold,status:'open',team:'solo'}])],[[...ascendingRows].reverse(),check([...ascendingRows].reverse())]),`(input: ${inputType}): ${outputType}`,
 `const good=solve([]);void good;\n// @ts-expect-error invalid status literal\nsolve([{id:'x',amount:1,status:'other',team:'t'}]);\n// @ts-expect-error amount cannot be a string\nsolve([{id:'x',amount:'1',status:'open',team:'t'}]);`);
}

function literal(value){if(Object.is(value,-0))return '-0';if(value===undefined)return 'undefined';if(Array.isArray(value))return '['+value.map(literal).join(',')+']';if(value!==null&&typeof value==='object')return '{'+Object.entries(value).map(([k,v])=>JSON.stringify(k)+':'+literal(v)).join(',')+'}';return JSON.stringify(value);}
function ensureNew(dir){if(fs.existsSync(dir))throw new Error('Refusing existing track: '+dir);fs.mkdirSync(dir,{recursive:true});}
function emitTrack(name,items){
 const dir=path.join(root,name);ensureNew(dir);
 for(const part of ['starters','solutions','tests','types'])fs.mkdirSync(path.join(dir,part));
 const manifest=[];
 for(const task of items){
  const ext=task.tech==='ts'?'ts':'cjs',file=task.id+'.'+ext;
  const header=`// ${task.id}: ${task.title}\n// ${task.requirements}\n// Tests: node ${name}/verify.cjs --id=${task.id} [--starters]\n// Study tests/${task.id}.cjs for examples.\n`;
  const body=task.tech==='ts'?`export function solve${task.types} {\n${task.body}\n}\n`:`function solve(input) {\n${task.body}\n}\nmodule.exports=solve;\n`;
  const stub=task.tech==='ts'?`export function solve${task.types} {\nthrow new Error('TODO exercise ${task.id}');\n}\n`:`function solve(input) {throw new Error('TODO exercise ${task.id}');}\nmodule.exports=solve;\n`;
  fs.writeFileSync(path.join(dir,'solutions',file),header+body);
  fs.writeFileSync(path.join(dir,'starters',file),header+stub);
  const checks=task.cases.map(c=>`{const input=${literal(c.input)};const before=structuredClone(input);${c.error?`assert.throws(()=>solve(input${c.args?','+c.args.map(literal).join(','):''}),e=>e instanceof Error&&e.message===${literal(c.error)});`:`assert.deepEqual(solve(input${c.args?','+c.args.map(literal).join(','):''}),${literal(c.expected)});`}assert.deepEqual(input,before,'Input must not mutate');}`).join('\n');
  fs.writeFileSync(path.join(dir,'tests',task.id+'.cjs'),`const assert=require('node:assert/strict');module.exports=solve=>{\n${checks}\n};\n`);
  if(task.tech==='ts')fs.writeFileSync(path.join(dir,'types',task.id+'.ts'),`import {solve} from '../solutions/${task.id}';\n${task.typeChecks}\n`);
  manifest.push({id:task.id,tech:task.tech,title:task.title,starter:'starters/'+file,solution:'solutions/'+file,test:'tests/'+task.id+'.cjs'});
 }
 fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2));
 const hasTS=items.some(x=>x.tech==='ts');
 if(hasTS)fs.writeFileSync(path.join(dir,'tsconfig.json'),JSON.stringify({compilerOptions:{target:'ES2022',module:'CommonJS',strict:true,noUncheckedIndexedAccess:true,exactOptionalPropertyTypes:true,esModuleInterop:true,skipLibCheck:true,outDir:'.build',rootDir:'.',types:[],noEmitOnError:true},include:['solutions/**/*.ts','starters/**/*.ts','types/**/*.ts']},null,2));
 fs.writeFileSync(path.join(dir,'verify.cjs'),`'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const manifest=require('./manifest.json');
assert.equal(manifest.length,${items.length});
assert.equal(new Set(manifest.map(x=>x.id)).size,${items.length});
${hasTS?`const compiled=spawnSync(process.execPath,[require.resolve('typescript/lib/tsc.js'),'-p',path.join(__dirname,'tsconfig.json')],{encoding:'utf8',timeout:120000});if(compiled.status!==0){process.stdout.write(compiled.stdout||'');process.stderr.write(compiled.stderr||'');process.exit(1);}`:''}
const args=process.argv.slice(2),option=args.find(a=>a.startsWith('--id=')),id=option?Number(option.slice(5)):null;
const selected=id===null?manifest:manifest.filter(x=>x.id===id);if(!selected.length)throw new Error('Unknown id');
const mode=args.includes('--starters')?'starter':'solution';let passed=0,failed=0;
for(const row of selected){try{
 let target=path.join(__dirname,row[mode]);
 if(row.tech==='ts')target=path.join(__dirname,'.build',row[mode].replace(/\\.ts$/,'.js'));
 else for(const field of ['starter','solution','test'])new vm.Script(fs.readFileSync(path.join(__dirname,row[field]),'utf8'));
 const loaded=require(target),solve=row.tech==='ts'?loaded.solve:loaded;
 require(path.join(__dirname,row.test))(solve);passed++;console.log('PASS '+row.id+' '+row.title);
 }catch(e){failed++;console.error('FAIL '+row.id+' '+e.stack);}}
console.log(mode+': '+passed+' passed, '+failed+' failed. TypeScript compiler gate: ${hasTS?'required':'not applicable'}.');process.exitCode=failed?1:0;
`);
 fs.writeFileSync(path.join(dir,'GUIDE.txt'),`${name.toUpperCase()} SCENARIO EXERCISES\n\n${items.length} exercises. Variants deliberately revisit an API family with different policies, boundary cases, or type contracts. They are not ${items.length} unrelated algorithms.\n\nFrom unionboot: node ${name}/verify.cjs\nPractice: node ${name}/verify.cjs --starters --id=${items[0].id}\nEdit starters, consult tests for examples, solutions only after attempting.\nTypeScript tracks use strict compilation plus negative type fixtures and runtime assertions.\nBlank starters compile but fail runtime tests by design. Reference solutions are not imported into starters.\n\n`+items.map(x=>x.id+' '+x.title+'\n'+x.requirements+'\n').join('\n'));
 console.log('Created '+name+': '+items.length+' exercises');
}
assertCounts();
function assertCounts(){for(const [lo,hi,count] of [[104,183,80],[184,283,100],[384,518,135]])if(specs.filter(x=>x.id>=lo&&x.id<=hi).length!==count)throw new Error('Missing catalog range '+lo);}
emitTrack('js-rest',specs.filter(x=>x.id>=104&&x.id<=183));
emitTrack('ts',specs.filter(x=>x.id>=184&&x.id<=283));
emitTrack('mixed-data',specs.filter(x=>x.id>=384&&x.id<=518));
