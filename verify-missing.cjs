'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const s=require('./solutions/missing-refs.cjs');
const ids=[66,67,68,69,70,71,74,75,76,77,78,79,80,81,82,83];
let failed=0;
for(const id of ids){
  const file=fs.readdirSync(__dirname).find(f=>f.startsWith(id+'-')&&f.endsWith('.js'));
  try{
    assert.ok(file,'Starter exists');assert.equal(typeof s[id],'function');
    const code=fs.readFileSync(path.join(__dirname,file),'utf8');
    const pattern=/(?:function\s+\w+\([^)]*\)|class\s+\w+)\s*\{\s*\/\/ your code here[^\n]*\n(?:\s*throw new Error\([^\n]*\);\s*)?\}/;
    assert.ok(pattern.test(code),'Recognized blank declaration');
    const declaration=code.match(pattern)[0];
    const name=declaration.match(/(?:function|class)\s+(\w+)/)[1];
    const replaced=code.replace(pattern,`const ${name}=require('./solutions/missing-refs.cjs')[${id}];`);
    const result=spawnSync(process.execPath,['-e',replaced],{cwd:__dirname,encoding:'utf8',timeout:10000});
    assert.equal(result.status,0,result.stderr||result.error?.message);
    console.log('PASS '+id+' sample assertions');
  }catch(error){failed++;console.error('FAIL '+id+': '+error.message);}
}
async function edges(){
assert.deepEqual([...s[66]('=x&x=a=b&&x=')],[['',['x']],['x',['a=b','']]]);
assert.throws(()=>s[66]('a=%FF'),URIError);
assert.equal(s[67]([],99,2).page,1);assert.throws(()=>s[67]([],1,1.5),RangeError);
const rows=Object.freeze([{v:1,id:'a'},{v:1,id:'b'}]);assert.deepEqual(s[68](rows,[{key:'v',direction:'desc'}]),rows);assert.notEqual(s[68](rows,[]),rows);
assert.equal(s[69]({v:undefined},['v'],'fallback'),undefined);assert.equal(s[69]({},['toString'],'fallback'),'fallback');
const nested={a:{},b:{x:null}};const flat=s[70](nested);assert.notEqual(flat.get('a'),nested.a);assert.deepEqual(s[71](flat),nested);
for(const entries of [[['a',{}],['a.b',1]],[['a.b',1],['a',{}]],[['constructor.x',1]],[['a..b',1]]])assert.throws(()=>s[71](new Map(entries)));
assert.deepEqual(s[74]('B a b A',2),[{word:'a',count:2},{word:'b',count:2}]);assert.deepEqual(s[74]('a',0),[]);
const median=new s[75]();assert.equal(median.add(-1),-1);assert.equal(median.add(-1),-1);assert.throws(()=>median.add(Infinity));assert.equal(median.size,2);
const cart=Object.freeze([Object.freeze({sku:'x',priceCents:2,qty:1})]);assert.throws(()=>s[76](cart,[{type:'add',sku:'x',qty:1,priceCents:2},{type:'remove',sku:'y',qty:1}]));assert.equal(cart[0].qty,1);assert.notEqual(s[76](cart,[]).items[0],cart[0]);
const machine=s[77]('a',{a:{go:'b'},b:{}});assert.equal(machine.can('toString'),false);assert.throws(()=>machine.send('toString'));assert.equal(machine.getState(),'a');assert.throws(()=>s[77]('a',{a:{go:'missing'}}));
const h=s[78](3);assert.equal(h.undo(),undefined);h.push('a');h.push('b');h.undo();h.push('c');assert.equal(h.canRedo(),false);assert.equal(h.undo(),'a');assert.equal(s[78](1).canUndo(),false);
const q=new s[79]();q.enqueue(undefined).enqueue(2);assert.equal(q.size,2);assert.equal(q.dequeue(),undefined);assert.equal(q.dequeue(),2);assert.equal(q.size,0);q.enqueue(3).clear();assert.equal(q.peek(),undefined);
assert.deepEqual(s[80]({n:{required:true}},{n:undefined}),{valid:false,errors:['n: required']});assert.equal(s[80]({n:{type:'number'}},{n:NaN}).valid,false);assert.equal(s[80]({b:{type:'boolean'}},{b:false}).valid,true);
assert.deepEqual(s[81](['b','a'],[['a','b'],['a','b']]),['a','b']);assert.throws(()=>s[81](['a'],[['a','a']]),/cycle/);
const avg=s[82](2);assert.equal(avg.push(-2),-2);assert.equal(avg.push(2),0);assert.equal(avg.push(4),3);avg.reset();assert.equal(avg.size,0);assert.ok(Number.isNaN(avg.average()));
const error=new Error('x');await assert.rejects(s[83]([()=>Promise.reject(error)]).run(0),e=>e===error);
const p=s[83]([()=>{throw error;},n=>n+2]);p.use(async()=>5);assert.equal(await p.run(0),7);assert.equal(await p.run(0),7);
console.log('PASS edge-case assertions for all 16 missing references');
}
edges().catch(error=>{failed++;console.error(error);}).finally(()=>{console.log('Missing-reference verification: '+(failed?'FAIL':'PASS')+'; 16 references checked.');process.exitCode=failed?1:0;});
