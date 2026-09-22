'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'js-capstones');
const exercises=[
 {id:3439,family:'Three-way document merge',title:'Merge independent flat-document edits',
 prompt:'Implement solve(base, local, remote) for flat records whose own enumerable values are strings. Inputs must not change. Absence means deletion. For each key: if local equals remote use it; otherwise if local equals base use remote; otherwise if remote equals base use local; otherwise record a conflict and keep local (including local deletion). Return {value, conflicts}; conflicts is lexicographically sorted. Keys such as __proto__ are ordinary data keys. Example base={a:"old"}, local={a:"new"}, remote={a:"old",b:"x"} returns {value:{a:"new",b:"x"},conflicts:[]}.',
 solution:`function solve(base,local,remote){
 const missing=Symbol('missing'),read=(o,k)=>Object.hasOwn(o,k)?o[k]:missing;
 const entries=[],conflicts=[];
 for(const k of [...new Set([...Object.keys(base),...Object.keys(local),...Object.keys(remote)])].sort()){
  const b=read(base,k),l=read(local,k),r=read(remote,k);let selected;
  if(l===r)selected=l;else if(l===b)selected=r;else if(r===b)selected=l;else{conflicts.push(k);selected=l;}
  if(selected!==missing)entries.push([k,selected]);
 }
 return {value:Object.fromEntries(entries),conflicts};
}`,
 test:`assert.deepEqual(solve(Object.freeze({a:'old'}),Object.freeze({a:'new'}),Object.freeze({a:'old',b:'x'})),{value:{a:'new',b:'x'},conflicts:[]});
 assert.deepEqual(solve({a:'x',z:'x'},{z:'local'},{a:'remote',z:'remote'}),{value:{z:'local'},conflicts:['a','z']});
 assert.deepEqual(solve({a:'x'},{},{}),{value:{},conflicts:[]});
 assert.deepEqual(solve({}, {a:''},{a:''}),{value:{a:''},conflicts:[]});
 const special=JSON.parse('{"__proto__":"data","constructor":"ok"}');
 assert.deepEqual(solve({},special,{}),{value:special,conflicts:[]});
 assert.deepEqual(solve({a:'x'},{a:'x'},{}),{value:{},conflicts:[]});`},
 {id:3440,family:'Revision event replay',title:'Replay idempotent ordered account events',
 prompt:'Implement solve(initial, events). initial is a safe-integer balance. Each event is {id,revision,delta}: nonempty string ID, positive safe-integer revision, safe-integer delta. Validate every event before deduplicating. A repeated ID is ignored only when revision and delta exactly match; conflicting reuse throws Error. Sort unique events by revision; revisions must be exactly 1..N, else throw. Every intermediate balance must be a nonnegative safe integer, otherwise throw. Return {balance, revision:N, applied:[IDs in revision order]}. Do not mutate inputs. Example initial=10, events=[{id:"b",revision:2,delta:-3},{id:"a",revision:1,delta:5}] returns {balance:12,revision:2,applied:["a","b"]}. Invalid initial balance throws.',
 solution:`function solve(initial,events){
 if(!Number.isSafeInteger(initial)||initial<0)throw Error('Invalid initial balance');
 const unique=new Map();
 for(const e of events){
  if(!e||typeof e.id!=='string'||!e.id.length||!Number.isSafeInteger(e.revision)||e.revision<1||!Number.isSafeInteger(e.delta))throw Error('Invalid event');
  const old=unique.get(e.id);
  if(old&&(old.revision!==e.revision||old.delta!==e.delta))throw Error('Conflicting event ID');
  if(!old)unique.set(e.id,e);
 }
 const ordered=[...unique.values()].sort((a,b)=>a.revision-b.revision),applied=[];let balance=initial;
 for(const [i,e] of ordered.entries()){
  if(e.revision!==i+1)throw Error('Revision gap or collision');
  balance+=e.delta;if(!Number.isSafeInteger(balance)||balance<0)throw Error('Invalid balance');applied.push(e.id);
 }
 return {balance,revision:ordered.length,applied};
}`,
 test:`const a=Object.freeze({id:'a',revision:1,delta:5}),b=Object.freeze({id:'b',revision:2,delta:-3});
 assert.deepEqual(solve(10,Object.freeze([b,a,a])),{balance:12,revision:2,applied:['a','b']});
 assert.deepEqual(solve(0,[]),{balance:0,revision:0,applied:[]});
 assert.throws(()=>solve(0,[{id:'a',revision:2,delta:0}]));
 assert.throws(()=>solve(0,[a,{id:'b',revision:1,delta:0}]));
 assert.throws(()=>solve(0,[a,{id:'a',revision:1,delta:6}]));
 assert.throws(()=>solve(0,[{id:'a',revision:1,delta:-1},{id:'b',revision:2,delta:1}]));
 assert.throws(()=>solve(Number.MAX_SAFE_INTEGER,[a]));
 assert.throws(()=>solve(-1,[]));
 assert.throws(()=>solve(0,[{id:'',revision:1,delta:0}]));
 assert.throws(()=>solve(0,[{id:'x',revision:1,delta:0.5}]));`},
 {id:3441,family:'Structural JSON change log',title:'Produce a deterministic JSON Pointer diff',
 prompt:'Implement solve(before, after) for JSON values. Return operations {op:"add"|"remove"|"replace",path,value?}. Root path is the empty string. Recursively compare plain objects, visiting the sorted union of own keys. Missing keys yield add/remove; remove has no value property. Arrays are atomic: emit one replace only if their JSON structures differ (object key insertion order is irrelevant). Scalar/type changes emit replace; equal structures emit nothing. Escape pointer segments by replacing ~ with ~0 and / with ~1. Every emitted value must be deeply cloned, not aliased to either input. Example {"a/b":1} -> {"a/b":2} yields [{op:"replace",path:"/a~1b",value:2}]. No input mutation.',
 solution:`function solve(before,after){
 const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
 const equal=(a,b)=>{
  if(a===b)return true;
  if(Array.isArray(a)&&Array.isArray(b))return a.length===b.length&&a.every((v,i)=>equal(v,b[i]));
  if(object(a)&&object(b)){const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(k=>Object.hasOwn(b,k)&&equal(a[k],b[k]));}
  return false;
 };
 const clone=x=>JSON.parse(JSON.stringify(x)),ops=[];
 function visit(a,b,p){
  if(equal(a,b))return;
  if(object(a)&&object(b)){
   for(const k of [...new Set([...Object.keys(a),...Object.keys(b)])].sort()){
    const q=p+'/'+k.replace(/~/g,'~0').replace(/\\//g,'~1');
    if(!Object.hasOwn(b,k))ops.push({op:'remove',path:q});
    else if(!Object.hasOwn(a,k))ops.push({op:'add',path:q,value:clone(b[k])});
    else visit(a[k],b[k],q);
   }
  }else ops.push({op:'replace',path:p,value:clone(b)});
 }
 visit(before,after,'');return ops;
}`,
 test:`assert.deepEqual(solve({'a/b':1,'~':true},{'a/b':2}),[{op:'replace',path:'/a~1b',value:2},{op:'remove',path:'/~0'}]);
 assert.deepEqual(solve(null,{a:1}),[{op:'replace',path:'',value:{a:1}}]);
 assert.deepEqual(solve([{a:1,b:2}],[{b:2,a:1}]),[]);
 assert.deepEqual(solve([1],[1,2]),[{op:'replace',path:'',value:[1,2]}]);
 assert.deepEqual(solve({z:1},{a:2}),[{op:'add',path:'/a',value:2},{op:'remove',path:'/z'}]);
 const before=Object.freeze({x:Object.freeze({a:1})}),after={x:{a:2},n:{v:[1]}};
 const out=solve(before,after);assert.deepEqual(out,[{op:'add',path:'/n',value:{v:[1]}},{op:'replace',path:'/x/a',value:2}]);
 out[0].value.v.push(2);assert.deepEqual(after.n.v,[1]);
 assert.deepEqual(solve({'':1},{'':2}),[{op:'replace',path:'/',value:2}]);`}
];
if(fs.existsSync(root))throw Error('Refusing existing js-capstones directory');
// Preflight references against independent expectations before writing anything.
for(const e of exercises){const solve=Function(e.solution+';return solve;')();Function('assert','solve',e.test)(assert,solve);}
fs.mkdirSync(root);for(const dir of ['prompts','starters','solutions','tests'])fs.mkdirSync(path.join(root,dir));
const write=(name,text)=>fs.writeFileSync(path.join(root,name),text,{flag:'wx'});
const manifest=exercises.map(e=>({id:e.id,tech:'js',family:e.family,title:e.title,prompt:'prompts/'+e.id+'.txt',starter:'starters/'+e.id+'.cjs',solution:'solutions/'+e.id+'.cjs',test:'tests/'+e.id+'.cjs'}));
for(const [i,e] of exercises.entries()){
 const row=manifest[i];write(row.prompt,e.id+' — '+e.title+'\n\n'+e.prompt+'\n');
 write(row.starter,"'use strict';\n// TODO: read ../"+row.prompt+"\nmodule.exports=function solve(){throw new Error('TODO exercise "+e.id+"');};\n");
 write(row.solution,"'use strict';\n"+e.solution+'\nmodule.exports=solve;\n');
 write(row.test,"'use strict';\nconst assert=require('node:assert/strict');\nmodule.exports=solve=>{\n"+e.test+'\n};\n');
}
write('manifest.json',JSON.stringify(manifest,null,2)+'\n');
write('GUIDE.txt','Three standalone JavaScript capstones, IDs 3439–3441. Read prompts, edit starters only, then node verify.cjs --starters --id=3439. Omit --starters to grade references. Blank starters intentionally fail. Tests cover stated cases, not all possible inputs.\n');
write('verify.cjs',`'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const args=process.argv.slice(2);let id,starters=false,inventory=false;const seen=new Set();
try{for(const arg of args){const key=arg.startsWith('--id=')?'id':arg;if(seen.has(key))throw Error('Duplicate option');seen.add(key);if(arg==='--starters')starters=true;else if(arg==='--inventory')inventory=true;else if(/^--id=\\d+$/.test(arg))id=Number(arg.slice(5));else throw Error('Unknown option');}if(inventory&&(starters||id!==undefined))throw Error('Inventory cannot combine with grading');if(id!==undefined&&![3439,3440,3441].includes(id))throw Error('Unknown ID');}catch(e){console.error(e.message);process.exit(2);}
const rows=require('./manifest.json');assert.deepEqual(rows.map(r=>r.id),[3439,3440,3441]);for(const r of rows)for(const field of ['prompt','starter','solution','test'])assert.ok(fs.statSync(path.join(__dirname,r[field])).isFile());
if(inventory){console.log('3 JavaScript capstones: 3439–3441');process.exit(0);}
const mode=starters?'starter':'solution',results=[];
for(const r of rows.filter(r=>id===undefined||r.id===id)){try{require('./'+r.test)(require('./'+r[mode]));results.push({id:r.id,passed:true});console.log('PASS '+r.id);}catch(e){results.push({id:r.id,passed:false,errorType:e.name,error:e.message});console.log('FAIL '+r.id+' '+e.message);}}
const passed=results.filter(r=>r.passed).length,failed=results.length-passed;
fs.writeFileSync(path.join(__dirname,'verification-'+mode+(id?'-'+id:'')+'.json'),JSON.stringify({mode,groups:results.length,passed,failed,results},null,2)+'\\n');
console.log(mode+': '+passed+' passed, '+failed+' failed');process.exitCode=failed?1:0;
`);
console.log('Generated 3 preflighted JavaScript capstones');
