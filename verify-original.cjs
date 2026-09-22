'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const markdown=fs.readFileSync(path.join(__dirname,'SOLUTIONS.md'),'utf8');
const tests={
1:`assert.equal(celsiusToFahrenheit(0),32);assert.equal(celsiusToFahrenheit(100),212);assert.equal(celsiusToFahrenheit(-40),-40);`,
2:`assert.equal(getInitials('ada lovelace'),'A.L.');assert.equal(getInitials('grace brewster hopper'),'G.B.H.');assert.equal(getInitials('linus'),'L.');`,
3:`const a=[4,9,1,9,7];assert.equal(secondLargest(a),7);assert.deepEqual(a,[4,9,1,9,7]);assert.equal(secondLargest([5,5]),undefined);assert.equal(secondLargest([]),undefined);`,
4:`assert.deepEqual(countWords(['apple','banana','apple']),{apple:2,banana:1});assert.deepEqual(countWords([]),{});assert.deepEqual(countWords(['constructor','constructor']),{constructor:2});`,
5:`assert.equal(logs.length,30);assert.deepEqual(logs.slice(0,5),[[1],[2],['Fizz'],[4],['Buzz']]);assert.deepEqual(logs[14],['FizzBuzz']);assert.deepEqual(logs[29],['FizzBuzz']);`,
6:`const a=makeCounter(),b=makeCounter(10);assert.equal(a(),1);assert.equal(a(),2);assert.equal(b(),11);assert.equal(a(),3);`,
7:`assert.deepEqual(honorRoll,['ADA','BARBARA','GRACE']);assert.equal(Number(average),72.2);assert.equal(students[0].score,92);`,
8:`assert.deepEqual(checkout([{price:80,qty:1},{price:5,qty:4},{price:250,qty:2}]),{subtotal:600,discount:60,total:540});assert.equal(checkout([{price:500,qty:1}]).discount,0);assert.equal(checkout([{price:1000,qty:1}]).discount,100);assert.deepEqual(checkout([]),{subtotal:0,discount:0,total:0});`,
9:`assert.equal(capitalizeWords('hello world'),'Hello World');assert.equal(capitalizeWords('jAVA sCRIPT is FUN'),'Java Script Is Fun');assert.equal(capitalizeWords(''),'');`,
10:`assert.deepEqual(flatten([1,[2,3],[4,[5]]]),[1,2,3,4,[5]]);assert.deepEqual(flatten([[],[1],[2,3]]),[1,2,3]);assert.deepEqual(flatten([]),[]);`,
11:`assert.equal(isPalindrome('A man, a plan, a canal: Panama'),true);assert.equal(isPalindrome('hello'),false);assert.equal(isPalindrome(''),true);`,
12:`assert.deepEqual(chunk([1,2,3,4,5],2),[[1,2],[3,4],[5]]);assert.deepEqual(chunk([],2),[]);assert.deepEqual(chunk([1,2],5),[[1,2]]);`,
13:`assert.equal(firstUniqueChar('swiss'),1);assert.equal(firstUniqueChar('aabb'),-1);assert.equal(firstUniqueChar('leetcode'),0);`,
14:`assert.equal(digitalRoot(942),6);assert.equal(digitalRoot(7),7);assert.equal(digitalRoot(99999),9);`,
15:`assert.equal(reverseWords('hello world'),'world hello');assert.equal(reverseWords('  too   many spaces '),'spaces many too');assert.equal(reverseWords(''),'');`,
16:`assert.equal(areAnagrams('listen','silent'),true);assert.equal(areAnagrams('Dormitory','Dirty Room'),true);assert.equal(areAnagrams('aab','abb'),false);`,
17:`const cache=new LRUCache(2);cache.put('a',1);cache.put('b',2);assert.equal(cache.get('a'),1);cache.put('c',3);assert.equal(cache.get('b'),undefined);assert.equal(cache.get('c'),3);`,
18:`const bus=new Emitter(),seen=[];const a=x=>seen.push('a'+x),b=x=>seen.push('b'+x);bus.on('m',a);bus.on('m',b);bus.emit('m',1);bus.off('m',a);bus.emit('m',2);bus.emit('none');assert.deepEqual(seen,['a1','b1','b2']);`,
19:`assert.equal(deepEqual({x:1,y:{z:2}},{x:1,y:{z:2}}),true);assert.equal(deepEqual({x:1},{x:1,y:undefined}),false);assert.equal(deepEqual([1,2],[2,1]),false);assert.equal(deepEqual(null,{}),false);`,
20:`await new Promise(resolve=>setTimeout(resolve,10));assert.equal(logs.length,2);for(const [comments] of logs)assert.deepEqual(comments,['comment 1','comment 2']);`,
21:`let n=0;assert.equal(await retry(()=>++n<3?Promise.reject(new Error('x')):Promise.resolve('yes'),3,0),'yes');assert.equal(n,3);const e=new Error('last');await assert.rejects(retry(()=>Promise.reject(e),2,0),x=>x===e);`,
22:`assert.equal(isBalanced('{[()]}'),true);assert.equal(isBalanced('([)]'),false);assert.equal(isBalanced(')('),false);assert.equal(isBalanced('none'),true);`,
23:`const empty=Object.freeze([]),action={type:'ADD',text:'x'};assert.deepEqual(todoReducer(empty,action),todoReducer(empty,action));const added=todoReducer(empty,action);assert.equal(todoReducer(added,{type:'TOGGLE',id:1})[0].done,true);assert.equal(added[0].done,false);assert.deepEqual(todoReducer(added,{type:'REMOVE',id:1}),[]);`,
24:`const dog=new Dog('Rex');assert.equal(dog.describe(),'Rex is a dog');assert.equal(new Animal('Rex').describe(),'Rex is an animal');assert.ok(dog instanceof Animal);assert.equal(dog.bark(),'WOOF');`,
25:`assert.deepEqual(groupBy([1,2,3,4],n=>n%2?'odd':'even'),{odd:[1,3],even:[2,4]});assert.deepEqual(groupBy([],x=>x),{});assert.deepEqual(groupBy(['x'],()=> 'constructor'),{constructor:['x']});`,
26:`assert.equal(pipe(n=>n*2,n=>n+5)(10),25);assert.equal(pipe()(7),7);let calls=0;const f=once(()=>++calls);assert.equal(f(),1);assert.equal(f(),1);assert.equal(calls,1);`,
27:`let count=0;const f=memoize(x=>{count++;return {x};});assert.equal(f(2),f(2));assert.equal(count,1);assert.notEqual(f({}),f({}));const g=memoize(()=>undefined);assert.equal(g(1),undefined);`,
28:`assert.equal(treeSum({value:1,children:[{value:2,children:[]}]}),3);assert.equal(treeSum(null),0);assert.equal(treeSum({value:-1,children:[]}),-1);`,
29:`assert.deepEqual(parseCSV('name, age\\nAda,36\\nLinus,25'),[{name:'Ada',age:'36'},{name:'Linus',age:'25'}]);assert.deepEqual(parseCSV(''),[]);assert.deepEqual(parseCSV('name'),[]);`,
30:`const p=picker(['a','b','c']);assert.deepEqual([p(),p(),p()].sort(),['a','b','c']);assert.deepEqual([p(),p(),p()].sort(),['a','b','c']);p.reset();assert.deepEqual([p(),p(),p()].sort(),['a','b','c']);`,
31:`assert.equal(render('Hello {{name}}!',{name:'Ada'}),'Hello Ada!');assert.equal(render('{{a.b}}',{a:{b:0}}),'0');assert.equal(render('{{missing}}',{}),'{{missing}}');`,
32:`assert.deepEqual(diff([1,2,3,4],[3,4,5,6]),{onlyInA:[1,2],onlyInB:[5,6],common:[3,4]});assert.deepEqual(diff([],[1]),{onlyInA:[],onlyInB:[1],common:[]});assert.deepEqual(diff([1,1],[1]),{onlyInA:[],onlyInB:[],common:[1]});`,
33:`assert.equal(ladderLength('hit','cog',['hot','dot','dog','lot','log','cog']),5);assert.equal(ladderLength('hit','cog',['hot','dot']),0);assert.equal(ladderLength('hit','hit',['hit']),1);`
};
const extra={
34:s=>{assert.deepEqual(s([2,7,11,15],9),[0,1]);assert.deepEqual(s([3,2,4],6),[1,2]);assert.deepEqual(s([3,3],6),[0,1]);},
35:s=>{const a=[0,1,0,3,12];s(a);assert.deepEqual(a,[1,3,12,0,0]);const b=[];s(b);assert.deepEqual(b,[]);},
36:s=>{assert.equal(s([-2,1,-3,4,-1,2,1,-5,4]),6);assert.equal(s([5,4,-1,7,8]),23);assert.equal(s([-3,-1,-2]),-1);},
37:s=>{assert.equal(s('III'),3);assert.equal(s('LVIII'),58);assert.equal(s('MCMXCIV'),1994);},
38:s=>{assert.equal(s(3),'III');assert.equal(s(58),'LVIII');assert.equal(s(3999),'MMMCMXCIX');},
51:s=>{assert.deepEqual(s([1,2,3,4]),[24,12,8,6]);assert.deepEqual(s([2,5]),[5,2]);assert.deepEqual(s([0,2,3]),[6,0,0]);},
52:s=>{assert.equal(s(3,7),28);assert.equal(s(3,2),3);assert.equal(s(1,1),1);},
53:s=>{assert.equal(s(2),2);assert.equal(s(3),3);assert.equal(s(10),89);},
54:s=>{assert.equal(s([1,2,5],11),3);assert.equal(s([2],3),-1);assert.equal(s([1],0),0);},
55:s=>{const os=require('node:os');const dir=fs.mkdtempSync(path.join(os.tmpdir(),'unionboot-test-'));try{const file=path.join(dir,'db.json');const db=new s(file,{visits:0});assert.equal(db.get('visits'),0);db.set('visits',1);assert.equal(new s(file,{}).get('visits'),1);assert.equal(db.get('missing'),undefined);}finally{fs.rmSync(dir,{recursive:true,force:true});}},
56:s=>{const a=new s('Ada');a.deposit(100);a.withdraw(30);assert.equal(a.balance,70);assert.throws(()=>a.withdraw(1000),/Insufficient/);assert.throws(()=>a.deposit(-1),/positive/);assert.equal(s.fromSnapshot({balance:70,history:a.history}).balance,70);},
57:s=>{const l=new s();[1,2,3].forEach(x=>l.push(x));assert.deepEqual(l.toArray(),[1,2,3]);assert.equal(l.delete(2),true);assert.deepEqual(l.toArray(),[1,3]);assert.equal(l.find(99),null);},
58:s=>{const t=new s();[50,30,70,20,40,60,80,30].forEach(x=>t.insert(x));assert.deepEqual(t.toArray(),[20,30,40,50,60,70,80]);assert.equal(t.has(40),true);assert.equal(t.has(45),false);},
59:s=>{assert.equal(s([1,3,5,7,9],7),3);assert.equal(s([],5),-1);assert.equal(s([1,3],2),-1);}
};
(async()=>{let passed=0,failed=0;for(let id=1;id<=33;id++){try{
const section=markdown.split(new RegExp('## '+String(id).padStart(2,'0')+' —'))[1]?.split(/\n## /)[0];const code=section?.match(/```js\r?\n([\s\S]*?)```/)?.[1];assert.ok(code,'Reference code exists');
const logs=[];let pre='';if(id===7)pre="const students=[{name:'Ada',score:92},{name:'Linus',score:48},{name:'Grace',score:78},{name:'Edsger',score:55},{name:'Barbara',score:88}];";
if(id===20)pre="const fetchUser=async()=>({name:'Ada'}),fetchPosts=async()=>['post1','post2'],fetchComments=async()=>['comment 1','comment 2'];";
await new AsyncFunction('assert','console','logs',pre+'\n'+code+'\n'+tests[id])(assert,{log:(...args)=>logs.push(args)},logs);passed++;console.log('PASS original '+id);
}catch(e){failed++;console.error('FAIL original '+id+': '+e.stack);}}
const refs=require('./solutions/round2-remaining.cjs');for(const [id,check] of Object.entries(extra)){try{await check(refs[id]);passed++;console.log('PASS original '+id);}catch(e){failed++;console.error('FAIL '+id+': '+e.stack);}}
// Execute saved assertion-based examples with only the blank declaration replaced.
for(const id of [60,61,62,63,64,65,72,73]){try{
const file=fs.readdirSync(__dirname).find(f=>f.startsWith(id+'-')&&f.endsWith('.js'));const source=fs.readFileSync(path.join(__dirname,file),'utf8');
const pattern=/(?:async\s+)?function\s+(\w+)\([^)]*\)\s*\{\s*\/\/ your code here[^\n]*\n\s*throw new Error\([^\n]*\);\s*\}/;
const match=source.match(pattern);assert.ok(match,'Recognized starter');const code=source.replace(pattern,`const ${match[1]}=require('./solutions/round2-remaining.cjs')[${id}];`);
const result=spawnSync(process.execPath,['-e',code],{cwd:__dirname,encoding:'utf8',timeout:15000});assert.equal(result.status,0,result.stderr);passed++;console.log('PASS original '+id);
}catch(e){failed++;console.error('FAIL original '+id+': '+e.stack);}}
console.log('Original reference groups: '+passed+' passed, '+failed+' failed. Other groups run in verify-39-50 and verify-missing.');process.exitCode=failed?1:0;
})();
