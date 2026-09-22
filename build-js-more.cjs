'use strict';
// Owns only js-more/. No overwrite, refresh, or partial-regeneration mode.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const target = path.join(__dirname, 'js-more');
const families = [];
const json = JSON.stringify;
function family(name, configs, implementation, spec, test) {
  assert.equal(configs.length, 10, name + ': ten scenarios required');
  families.push({name, configs, implementation, spec, test});
}
const cross = (left, right, make) => left.flatMap(a => right.map(b => make(a,b)));

// Reference implementations are defined first. Each is emitted independently with
// only its active configuration; there are no cross-exercise solution imports.
function lfu(input) {
  const entries = new Map(); let serial = 0; const reads = [];
  for (const op of input.ops) {
    if (op.type === 'get') {
      const item = entries.get(op.key);
      reads.push(item ? item.value : null);
      if (item) { item.frequency++; item.touched = serial++; }
    } else if (op.type === 'put') {
      if (entries.has(op.key)) {
        const item = entries.get(op.key); item.value = op.value;
        item.frequency++; item.touched = serial++;
      } else {
        if (entries.size === cfg.capacity) {
          const victim = [...entries].sort((a,b) => a[1].frequency-b[1].frequency ||
            (cfg.tie === 'oldest' ? a[1].touched-b[1].touched : b[1].touched-a[1].touched))[0];
          entries.delete(victim[0]);
        }
        entries.set(op.key, {value:op.value, frequency:1, touched:serial++});
      }
    } else throw new Error('Unknown operation');
  }
  return {reads, entries:[...entries].sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0).map(([key,v])=>[key,v.value,v.frequency])};
}
function trie(input) {
  const root = {children:new Map(), terminal:null};
  input.words.forEach((row,index) => {
    let node = root;
    for (const ch of row.word) {
      if (!node.children.has(ch)) node.children.set(ch,{children:new Map(),terminal:null});
      node = node.children.get(ch);
    }
    node.terminal = {...row,index};
  });
  let node = root;
  for (const ch of input.prefix) { node = node.children.get(ch); if (!node) return []; }
  const found=[], stack=[node];
  while (stack.length) { const n=stack.pop(); if(n.terminal)found.push(n.terminal); for(const child of n.children.values())stack.push(child); }
  const lexical=(a,b)=>a.word<b.word?-1:a.word>b.word?1:0;
  found.sort((a,b)=> (cfg.rank==='score'?b.score-a.score:cfg.rank==='shortest'?a.word.length-b.word.length:
    cfg.rank==='longest'?b.word.length-a.word.length:cfg.rank==='recent'?b.index-a.index:0) || lexical(a,b));
  return found.slice(0,cfg.limit).map(x=>x.word);
}
function weightedIntervals(input) {
  const jobs=[...input].sort((a,b)=>a.end-b.end || (a.id<b.id?-1:1));
  const best=[{value:0, ids:[]}];
  const better=(a,b)=>{
    if(a.value!==b.value)return a.value>b.value?a:b;
    if(a.ids.length!==b.ids.length)return (cfg.tie==='fewer'?a.ids.length<b.ids.length:a.ids.length>b.ids.length)?a:b;
    return JSON.stringify(a.ids)<JSON.stringify(b.ids)?a:b;
  };
  for(let i=0;i<jobs.length;i++) {
    let lo=0,hi=i;
    while(lo<hi){const mid=(lo+hi)>>1;if(jobs[mid].end+cfg.gap<=jobs[i].start)lo=mid+1;else hi=mid;}
    const prior=best[lo];
    best.push(better(best[i],{value:prior.value+jobs[i].value,ids:[...prior.ids,jobs[i].id]}));
  }
  return best.at(-1);
}
function heapDispatch(input) {
  const waiting=input.map((job,index)=>({...job,index})); let now=0; const out=[];
  while(waiting.length){
    if(!waiting.some(x=>x.arrival<=now))now=Math.min(...waiting.map(x=>x.arrival));
    const rank=x=>(cfg.direction==='high'?-x.priority:x.priority)-cfg.aging*(now-x.arrival);
    const before=(a,b)=>rank(a)<rank(b)||(rank(a)===rank(b)&&a.index<b.index);
    const heap=[];
    for(const job of waiting.filter(x=>x.arrival<=now)){
      heap.push(job);let i=heap.length-1;while(i>0){const p=(i-1)>>1;if(!before(heap[i],heap[p]))break;[heap[i],heap[p]]=[heap[p],heap[i]];i=p;}
    }
    const job=heap[0]; waiting.splice(waiting.indexOf(job),1);
    // Heap contains copies of the same job objects placed in waiting.
    out.push({id:job.id,start:now,end:now+job.duration}); now+=job.duration;
  }
  return out;
}
function unionFind(input) {
  const n=cfg.size, parent=Array.from({length:n},(_,i)=>i), answers=[];
  function find(x){let r=x;while(parent[r]!==r)r=parent[r];while(parent[x]!==x){const next=parent[x];parent[x]=r;x=next;}return r;}
  for(const op of input){
    if(!Number.isInteger(op.a)||op.a<0||op.a>=n||!Number.isInteger(op.b)||op.b<0||op.b>=n)throw new RangeError('Unknown node');
    const a=find(op.a),b=find(op.b);
    if(op.type==='union'){if(a!==b)parent[cfg.root==='minimum'?Math.max(a,b):Math.min(a,b)]=cfg.root==='minimum'?Math.min(a,b):Math.max(a,b);}
    else if(op.type==='same')answers.push(a===b);else throw new Error('Unknown operation');
  }
  const roots=parent.map((_,i)=>find(i));
  return {answers,roots,components:new Set(roots).size};
}
function dijkstra(input) {
  const dist=new Map(input.nodes.map(x=>[x,Infinity]));dist.set(input.start,0);
  const paths=new Map([[input.start,[input.start]]]),done=new Set();
  const compare=(a,b)=>{
    if(cfg.tie==='fewest'&&a.length!==b.length)return a.length-b.length;
    const x=JSON.stringify(a),y=JSON.stringify(b);return x<y?-1:x>y?1:0;
  };
  while(true){
    const available=input.nodes.filter(x=>!done.has(x)&&dist.get(x)!==Infinity);
    available.sort((a,b)=>dist.get(a)-dist.get(b)||compare(paths.get(a),paths.get(b)));
    if(!available.length)break;const u=available[0];done.add(u);
    for(const [from,to,weight] of input.edges){if(from!==u)continue;
      const candidate=dist.get(u)+weight+cfg.toll, route=[...paths.get(u),to];
      if(candidate<dist.get(to)||(candidate===dist.get(to)&&compare(route,paths.get(to))<0)){dist.set(to,candidate);paths.set(to,route);}
    }
  }
  return input.nodes.map(node=>({node,cost:dist.get(node)===Infinity?null:dist.get(node),path:paths.get(node)||[]}));
}
function kmp(input) {
  const text=cfg.fold?input.text.toLowerCase():input.text, pattern=cfg.fold?input.pattern.toLowerCase():input.pattern;
  let hits=[];
  if(!pattern.length)hits=Array.from({length:text.length+1},(_,i)=>i);
  else {
    const prefix=Array(pattern.length).fill(0);
    for(let i=1,j=0;i<pattern.length;i++){while(j&&pattern[i]!==pattern[j])j=prefix[j-1];if(pattern[i]===pattern[j])j++;prefix[i]=j;}
    for(let i=0,j=0;i<text.length;i++){
      while(j&&text[i]!==pattern[j])j=prefix[j-1];if(text[i]===pattern[j])j++;
      if(j===pattern.length){hits.push(i-j+1);j=cfg.output==='disjoint'?0:prefix[j-1];}
    }
  }
  if(cfg.output==='first')return hits[0]??-1;
  if(cfg.output==='last')return hits.at(-1)??-1;
  if(cfg.output==='count')return hits.length;
  return hits;
}
function decimalArithmetic(input) {
  const clean=s=>{if(!/^\d+$/.test(s))throw new TypeError('Decimal digits required');return s.replace(/^0+(?=\d)/,'');};
  const a=clean(input.a),b=clean(input.b);
  const add=(x,y)=>{let i=x.length-1,j=y.length-1,carry=0,out='';while(i>=0||j>=0||carry){const n=Number(x[i--]||0)+Number(y[j--]||0)+carry;out=n%10+out;carry=Math.floor(n/10);}return out;};
  const cmp=(x,y)=>x.length!==y.length?Math.sign(x.length-y.length):x<y?-1:x>y?1:0;
  const sub=(x,y)=>{let borrow=0,out='',j=y.length-1;for(let i=x.length-1;i>=0;i--){let n=Number(x[i])-Number(y[j--]||0)-borrow;borrow=n<0?1:0;if(borrow)n+=10;out=n+out;}return clean(out);};
  let result;
  if(cfg.op==='add')result=add(a,b);
  else if(cfg.op==='difference')result=cmp(a,b)<0?sub(b,a):sub(a,b);
  else if(cfg.op==='subtract'){if(cmp(a,b)<0)throw new RangeError('Negative result');result=sub(a,b);}
  else if(cfg.op==='multiply'){
    const digits=Array(a.length+b.length).fill(0);
    for(let i=a.length-1;i>=0;i--)for(let j=b.length-1;j>=0;j--)digits[i+j+1]+=Number(a[i])*Number(b[j]);
    for(let i=digits.length-1;i>0;i--){digits[i-1]+=Math.floor(digits[i]/10);digits[i]%=10;}result=clean(digits.join(''));
  }else result=cmp(a,b)>=0?a:b;
  return cfg.pad?result.padStart(Math.max(input.a.length,input.b.length),'0'):result;
}
function huffman(input) {
  const counts=new Map();for(const ch of input)counts.set(ch,(counts.get(ch)||0)+1);
  const queue=[...counts].map(([symbol,weight])=>({symbol,weight,key:symbol}));
  const compare=(a,b)=>a.weight-b.weight || (a.key<b.key?(cfg.tie==='ascending'?-1:1):a.key>b.key?(cfg.tie==='ascending'?1:-1):0);
  while(queue.length>1){queue.sort(compare);const left=queue.shift(),right=queue.shift();queue.push({left,right,weight:left.weight+right.weight,key:[...left.key+right.key].sort().join('')});}
  const table=new Map();
  function walk(n,bits){if(n.symbol!==undefined)table.set(n.symbol,bits||cfg.zero);else{walk(n.left,bits+cfg.zero);walk(n.right,bits+(cfg.zero==='0'?'1':'0'));}}
  if(queue.length)walk(queue[0],'');
  const codes=[...table].sort((a,b)=>a[0]<b[0]?-1:1),bits=[...input].map(c=>table.get(c)).join('');
  if(cfg.output==='table')return codes;
  if(cfg.output==='length')return cfg.unit==='bytes'?Math.ceil(bits.length/8):bits.length;
  return {codes,bits};
}
function jsonSelection(input) {
  let nodes=[input.value];
  for(const token of input.path){const next=[];
    for(const value of nodes){
      if(token==='*'){
        if(value&&typeof value==='object'){
          let keys=Object.keys(value);if(cfg.order==='reverse')keys.reverse();
          for(const key of keys)next.push(value[key]);
        }
      }else if(value!==null&&typeof value==='object'&&Object.prototype.hasOwnProperty.call(value,token))next.push(value[token]);
      else if(cfg.missing==='null')next.push(null);
      else if(cfg.missing==='error')throw new Error('Missing path');
    }
    nodes=next;
  }
  if(cfg.output==='count')return nodes.length;
  if(cfg.output==='first')return nodes.length?nodes[0]:null;
  return nodes;
}
function topicBus() {
  let serial=0;const listeners=[];
  const matches=(pattern,topic)=>{
    const p=pattern.split('.'),t=topic.split('.');
    for(let i=0;i<p.length;i++){if(p[i]==='**')return true;if(i>=t.length||(p[i]!=='*'&&p[i]!==t[i]))return false;}return p.length===t.length;
  };
  return {
    subscribe(pattern,callback,priority=0){const item={pattern,callback,priority,serial:serial++,active:true};listeners.push(item);return()=>{item.active=false;};},
    emit(topic,value){
      const snapshot=listeners.filter(x=>x.active&&matches(x.pattern,topic));
      snapshot.sort((a,b)=>cfg.order==='priority'?b.priority-a.priority||a.serial-b.serial:cfg.order==='reverse'?b.serial-a.serial:a.serial-b.serial);
      const errors=[];let delivered=0;
      for(const item of snapshot){if(cfg.live&&!item.active)continue;
        delivered++;try{item.callback(value,topic);}catch(e){if(cfg.errors==='throw')throw e;errors.push(String(e.message||e));}
      }
      return {delivered,errors};
    }
  };
}
function semaphore() {
  let active=0;const waiting=[];
  function grant(resolve){active++;let released=false;resolve(()=>{if(released)return;released=true;active--;if(waiting.length)grant((cfg.queue==='fifo'?waiting.shift():waiting.pop()).resolve);});}
  return {acquire(){return new Promise(resolve=>{if(active<cfg.permits)grant(resolve);else waiting.push({resolve});});},stats(){return {active,waiting:waiting.length};}};
}
function lazyPipeline(input) {
  return (function*(){
    if(cfg.take===0)return;let emitted=0;
    for(const value of input){
      if(cfg.mode==='even'&&value%2!==0)continue;
      if(cfg.mode==='positive'&&value<=0)continue;
      yield cfg.mode==='square'?value*value:cfg.mode==='negate'?-value:cfg.mode==='double'?value*2:value;
      if(++emitted===cfg.take)return;
    }
  })();
}
function persistentStacks(input) {
  const versions=[null],queries=[];
  for(const op of input){
    if(!Number.isInteger(op.version)||op.version<0||op.version>=versions.length)throw new RangeError('Unknown version');
    const node=versions[op.version];
    if(op.type==='push')versions.push(Object.freeze({value:op.value,next:node,size:(node?.size||0)+1}));
    else if(op.type==='pop'){
      if(!node&&cfg.empty==='error')throw new RangeError('Empty stack');
      versions.push(node?node.next:null);
    }else if(op.type==='read'){
      const values=[];for(let at=node;at;at=at.next)values.push(at.value);
      queries.push(cfg.view==='bottom'?values.reverse():cfg.view==='size'?values.length:cfg.view==='peek'?(values[0]??null):cfg.view==='last-two'?values.slice(0,2):values);
    }else throw new Error('Unknown operation');
  }
  return {versions:versions.length,queries};
}
function expression(input) {
  const tokens=input.match(/\d+(?:\.\d+)?|[()+*\-\/^]/g)||[];
  if(tokens.join('')!==input.replace(/\s/g,''))throw new SyntaxError('Invalid expression');
  let pos=0;
  const precedence=op=>op==='^'?3:cfg.precedence==='flat'?1:(op==='+'||op==='-')?1:2;
  function atom(){const t=tokens[pos++];if(t==='('){const n=parse(0);if(tokens[pos++]!==')')throw new SyntaxError('Invalid expression');return n;}
    if(t==='-')return -atom();if(t==='+'&&cfg.unaryPlus)return atom();if(t===undefined||!/^\d/.test(t))throw new SyntaxError('Invalid expression');return Number(t);}
  function parse(min){let left=atom();while(pos<tokens.length&&tokens[pos]!==')'){
    const op=tokens[pos];if(!['+','-','*','/','^'].includes(op))throw new SyntaxError('Invalid expression');const p=precedence(op);if(p<min)break;pos++;
    const right=parse(p+(op==='^'&&cfg.power==='right'?0:1));
    left=op==='+'?left+right:op==='-'?left-right:op==='*'?left*right:op==='/'?left/right:left**right;
  }return left;}
  const result=parse(0);if(pos!==tokens.length||!Number.isFinite(result))throw new SyntaxError('Invalid expression');return Object.is(result,-0)?0:result;
}
function lcsDiff(input) {
  const a=[...input.a],b=[...input.b],dp=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));
  const equal=(x,y)=>cfg.fold?x.toLowerCase()===y.toLowerCase():x===y;
  for(let i=a.length-1;i>=0;i--)for(let j=b.length-1;j>=0;j--)dp[i][j]=equal(a[i],b[j])?1+dp[i+1][j+1]:Math.max(dp[i+1][j],dp[i][j+1]);
  let i=0,j=0;const ops=[],kept=[];
  while(i<a.length||j<b.length){
    if(i<a.length&&j<b.length&&equal(a[i],b[j])){ops.push(['keep',b[j]]);kept.push(b[j]);i++;j++;}
    else if(i<a.length&&(j===b.length||dp[i+1][j]>dp[i][j+1]||(dp[i+1][j]===dp[i][j+1]&&cfg.tie==='delete'))){ops.push(['delete',a[i++]]);}
    else ops.push(['insert',b[j++]]);
  }
  if(cfg.output==='length')return kept.length;
  if(cfg.output==='common')return kept.join('');
  return ops;
}
function sudoku(input) {
  const n=cfg.box*cfg.box,board=input.board;
  if(board.length!==n||board.some(r=>r.length!==n))throw new RangeError('Invalid board');
  for(const row of board)for(const x of row)if(!Number.isInteger(x)||x<0||x>n)throw new RangeError('Invalid cell');
  const groups=[];
  for(let i=0;i<n;i++){groups.push(board[i]);groups.push(board.map(r=>r[i]));}
  for(let r=0;r<n;r+=cfg.box)for(let c=0;c<n;c+=cfg.box){const g=[];for(let i=0;i<cfg.box;i++)for(let j=0;j<cfg.box;j++)g.push(board[r+i][c+j]);groups.push(g);}
  if(cfg.diagonal){groups.push(board.map((row,i)=>row[i]));groups.push(board.map((row,i)=>row[n-i-1]));}
  if(groups.some(g=>new Set(g.filter(Boolean)).size!==g.filter(Boolean).length))return {valid:false,candidates:[]};
  const {row:r,col:c}=input;if(!Number.isInteger(r)||!Number.isInteger(c)||r<0||c<0||r>=n||c>=n)throw new RangeError('Invalid coordinate');
  if(board[r][c])return {valid:true,candidates:[]};
  const used=new Set([...board[r],...board.map(row=>row[c])]);
  const br=Math.floor(r/cfg.box)*cfg.box,bc=Math.floor(c/cfg.box)*cfg.box;
  for(let i=0;i<cfg.box;i++)for(let j=0;j<cfg.box;j++)used.add(board[br+i][bc+j]);
  if(cfg.diagonal&&r===c)board.forEach((row,i)=>used.add(row[i]));
  if(cfg.diagonal&&r+c===n-1)board.forEach((row,i)=>used.add(row[n-i-1]));
  return {valid:true,candidates:Array.from({length:n},(_,i)=>i+1).filter(x=>!used.has(x))};
}
function tokenBucket(input) {
  let tokens=cfg.capacity,last=input.now();
  return {take(cost=1){const time=input.now();if(time<last)throw new RangeError('Time reversed');tokens=Math.min(cfg.capacity,tokens+(time-last)*cfg.refill);last=time;
    if(!Number.isFinite(cost)||cost<=0)throw new RangeError('Invalid cost');
    if(tokens<cost)return {allowed:false,tokens};tokens-=cost;return {allowed:true,tokens};
  }};
}
function bloom(input) {
  const bits=Array(cfg.bits).fill(0), answers=[];
  function positions(s){let a=0,b=0;for(const ch of s){a=(a*31+ch.charCodeAt(0))%cfg.bits;b=(b*17+ch.charCodeAt(0)+1)%cfg.bits;}return Array.from({length:cfg.hashes},(_,i)=>(a+i*(b||1))%cfg.bits);}
  for(const op of input){const indexes=positions(op.value);if(op.type==='add')for(const i of indexes)bits[i]=1;else if(op.type==='has')answers.push(indexes.every(i=>bits[i]));else throw new Error('Unknown operation');}
  return {answers,bits:bits.join('')};
}
function fenwick(input) {
  const nums=[...input.values],tree=Array(nums.length+1).fill(0),answers=[];
  const add=(at,value)=>{for(let i=at+1;i<tree.length;i+=i&-i)tree[i]+=value;};
  const sum=end=>{let total=0;for(let i=end;i>0;i-=i&-i)total+=tree[i];return total;};
  nums.forEach((x,i)=>add(i,x));
  for(const op of input.ops){
    if(op.type==='update'){
      if(!Number.isInteger(op.index)||op.index<0||op.index>=nums.length)throw new RangeError('Index');
      const next=cfg.update==='set'?op.value:nums[op.index]+op.value;add(op.index,next-nums[op.index]);nums[op.index]=next;
    }else if(op.type==='range'){
      const end=op.end+(cfg.inclusive?1:0);
      if(!Number.isInteger(op.start)||!Number.isInteger(end)||op.start<0||end<op.start||end>nums.length)throw new RangeError('Range');
      const value=sum(end)-sum(op.start);answers.push(cfg.output==='average'?(end===op.start?null:value/(end-op.start)):value);
    }else throw new Error('Unknown operation');
  }
  return {answers,values:nums};
}
function segmentTree(input) {
  const values=[...input.values];let size=1;while(size<values.length)size*=2;
  const tree=Array(size*2).fill(null);
  const merge=(a,b)=>{if(a===null)return b;if(b===null)return a;if(a.value!==b.value)return (cfg.extreme==='min'?a.value<b.value:a.value>b.value)?a:b;return (cfg.tie==='first'?a.index<b.index:a.index>b.index)?a:b;};
  values.forEach((value,index)=>{tree[size+index]={value,index};});
  for(let i=size-1;i>0;i--)tree[i]=merge(tree[2*i],tree[2*i+1]);
  const answers=[];
  for(const op of input.ops){
    if(op.type==='set'){
      if(!Number.isInteger(op.index)||op.index<0||op.index>=values.length)throw new RangeError('Index');
      values[op.index]=op.value;let at=size+op.index;tree[at]={value:op.value,index:op.index};
      while(at>1){at>>=1;tree[at]=merge(tree[at*2],tree[at*2+1]);}
    }else if(op.type==='query'){
      if(!Number.isInteger(op.start)||!Number.isInteger(op.end)||op.start<0||op.end<op.start||op.end>values.length)throw new RangeError('Range');
      let l=size+op.start,r=size+op.end,result=null;
      while(l<r){if(l%2)result=merge(result,tree[l++]);if(r%2)result=merge(result,tree[--r]);l>>=1;r>>=1;}
      answers.push(result===null?null:cfg.output==='index'?result.index:cfg.output==='value'?result.value:result);
    }else throw new Error('Unknown operation');
  }
  return answers;
}
function hashRing(input) {
  const hash=text=>{let h=0;for(const ch of text)h=(h*31+ch.charCodeAt(0))%cfg.slots;return h;};
  const ring=[];
  for(const node of input.nodes)for(let i=0;i<cfg.replicas;i++)ring.push({node,position:hash(node+'#'+i),replica:i});
  ring.sort((a,b)=>a.position-b.position||(a.node<b.node?-1:a.node>b.node?1:a.replica-b.replica));
  return input.keys.map(key=>{
    if(!ring.length)return null;const point=hash(key);
    let lo=0,hi=ring.length;while(lo<hi){const mid=(lo+hi)>>1;if(ring[mid].position<point)lo=mid+1;else hi=mid;}
    return ring[lo%ring.length].node;
  });
}
function knapsack(input) {
  const dp=Array.from({length:cfg.capacity+1},()=>({value:0,ids:[],weight:0}));
  const better=(a,b)=>{
    if(a.value!==b.value)return a.value>b.value?a:b;
    if(a.weight!==b.weight)return (cfg.tie==='lighter'?a.weight<b.weight:a.weight>b.weight)?a:b;
    return JSON.stringify(a.ids)<JSON.stringify(b.ids)?a:b;
  };
  for(const item of input){
    if(!Number.isInteger(item.weight)||item.weight<=0)throw new RangeError('Weight');
    for(let w=cfg.capacity;w>=item.weight;w--){const p=dp[w-item.weight];dp[w]=better(dp[w],{value:p.value+item.value,ids:[...p.ids,item.id],weight:p.weight+item.weight});}
  }
  return dp[cfg.capacity];
}
function automaton(input) {
  let cells=[...input.cells];const history=[[...cells]];
  if(!Number.isInteger(input.steps)||input.steps<0)throw new RangeError('Steps');
  for(let step=0;step<input.steps;step++){
    const get=i=>cfg.wrap?cells[(i+cells.length)%cells.length]:(cells[i]||0);
    cells=cells.map((value,i)=>(cfg.rule>>(get(i-1)*4+value*2+get(i+1)))&1);history.push([...cells]);
  }
  return history;
}
function polynomial(input) {
  const out=Array(Math.max(0,input.a.length+input.b.length-1)).fill(0);
  if(!input.a.length||!input.b.length)return [];
  for(let i=0;i<input.a.length;i++)for(let j=0;j<input.b.length;j++)out[i+j]+=input.a[i]*input.b[j];
  const reduced=out.map(x=>cfg.modulus?((x%cfg.modulus)+cfg.modulus)%cfg.modulus:x);
  if(cfg.trim)while(reduced.length&&reduced.at(-1)===0)reduced.pop();
  return reduced;
}

// Independent test oracles below use simpler models (linear scans, exhaustive
// subsets, native BigInt, etc.), never a generated reference import.
family('LFU cache eviction',cross([2,3,4,5,6],['oldest','newest'],(capacity,tie)=>({capacity,tie})),lfu,
 c=>`Input {ops} with get {key} and put {key,value}, string keys and primitive non-null values. Capacity ${c.capacity}; evict least frequency, ties ${c.tie} last successful access. Insert frequency 1; get hit and put replacement each increment frequency and touch sequence. Miss returns null and does not touch. Return {reads,entries}; entries are [key,value,frequency] sorted by code-unit key. Unknown operation throws Error('Unknown operation').`,
 c=>`check({ops:[]},{reads:[],entries:[]});
 function oracle(ops){let rows=[],tick=0,reads=[];for(const op of ops){let row=rows.find(x=>x.key===op.key);if(op.type==='get'){reads.push(row?row.value:null);if(row){row.f++;row.t=tick++;}}else if(row){row.value=op.value;row.f++;row.t=tick++;}else{if(rows.length===cfg.capacity){const f=Math.min(...rows.map(x=>x.f));const tied=rows.filter(x=>x.f===f);const victim=tied.reduce((a,b)=>(cfg.tie==='oldest'?a.t<b.t:a.t>b.t)?a:b);rows=rows.filter(x=>x!==victim);}rows.push({key:op.key,value:op.value,f:1,t:tick++});}}return {reads,entries:rows.sort((a,b)=>a.key<b.key?-1:1).map(x=>[x.key,x.value,x.f])};}
 const ops=[];for(let i=0;i<12;i++){ops.push({type:'put',key:String(i),value:i});if(i%3===0)ops.push({type:'get',key:String(i)});}ops.push({type:'put',key:'__proto__',value:false},{type:'get',key:'__proto__'},{type:'get',key:'missing'});check({ops},oracle(ops));
 check({ops:[{type:'put',key:'a',value:1},{type:'put',key:'a',value:2},{type:'get',key:'a'}]},{reads:[2],entries:[['a',2,3]]});
 assert.throws(()=>solve({ops:[{type:'bad'}]}),/Unknown operation/);`);
family('Ranked trie autocomplete',cross(['score','shortest','longest','recent','lexical'],[2,4],(rank,limit)=>({rank,limit})),trie,
 c=>`Input {words:[{word,score}],prefix}, unique ASCII word strings, finite scores. Build a trie; collect prefix matches, rank by ${c.rank} (score descending, lengths as named, recent means reverse input position, lexical code-unit ascending). Break ties lexically. Return at most ${c.limit} word strings. Empty prefix matches every word, including empty word; no match returns [].`,
 c=>`check({words:[],prefix:''},[]);const words=[{word:'apple',score:2},{word:'a',score:9},{word:'atom',score:4},{word:'apricot',score:8},{word:'ape',score:2},{word:'z',score:99},{word:'',score:7}];
 for(const prefix of ['','a','ap','apple','missing']){const expected=words.map((x,i)=>({...x,i})).filter(x=>x.word.startsWith(prefix));expected.sort((a,b)=>(cfg.rank==='score'?b.score-a.score:cfg.rank==='shortest'?a.word.length-b.word.length:cfg.rank==='longest'?b.word.length-a.word.length:cfg.rank==='recent'?b.i-a.i:0)||(a.word<b.word?-1:1));check({words,prefix},expected.slice(0,cfg.limit).map(x=>x.word));}`);
family('Weighted interval scheduling',cross([0,1,2,3,4],['fewer','more'],(gap,tie)=>({gap,tie})),weightedIntervals,
 c=>`Input jobs {id,start,end,value} with unique lowercase ASCII ids, start<end, positive duration and nonnegative value. Select maximum total value without overlap; consecutive jobs require previous.end+${c.gap}<=next.start. Return {value,ids} in time order. Tied value prefers ${c.tie} jobs, then lexicographically smaller JSON-serialized id sequence. Empty schedule is allowed.`,
 c=>`check([],{value:0,ids:[]});function oracle(jobs){let best=null;for(let mask=0;mask<2**jobs.length;mask++){const selected=jobs.filter((_,i)=>mask&(1<<i)).sort((a,b)=>a.end-b.end||(a.id<b.id?-1:1));if(selected.some((x,i)=>i&&selected[i-1].end+cfg.gap>x.start))continue;const candidate={value:selected.reduce((s,x)=>s+x.value,0),ids:selected.map(x=>x.id)};if(!best||candidate.value>best.value||(candidate.value===best.value&&(candidate.ids.length!==best.ids.length?(cfg.tie==='fewer'?candidate.ids.length<best.ids.length:candidate.ids.length>best.ids.length):JSON.stringify(candidate.ids)<JSON.stringify(best.ids))))best=candidate;}return best;}
 const jobs=[{id:'c',start:0,end:8,value:10},{id:'a',start:0,end:2,value:5},{id:'b',start:2,end:4,value:5},{id:'d',start:5,end:6,value:0},{id:'e',start:9,end:11,value:6},{id:'f',start:13,end:15,value:6}];check(jobs,oracle(jobs));
 for(let gap=0;gap<=5;gap++){const rows=[{id:'a',start:0,end:1,value:2},{id:'b',start:1+gap,end:2+gap,value:2},{id:'c',start:0,end:2+gap,value:4}];check(rows,oracle(rows));}`);
family('Heap job dispatch',cross(['high','low'],[0,1,2,3,4],(direction,aging)=>({direction,aging})),heapDispatch,
 c=>`Nonpreemptive virtual scheduler. Input jobs {id,arrival,duration,priority}, arrival>=0, duration>0. Clock starts0, jumps to next arrival when idle. At each dispatch, heap-order ready jobs by ${c.direction==='high'?'-priority':'priority'} - ${c.aging}*(now-arrival), ascending; ties input order. Return {id,start,end} execution records. No real clock or timer. Rebuild ready heap as aging changes.`,
 c=>`check([],[]);const jobs=[{id:'a',arrival:0,duration:3,priority:2},{id:'b',arrival:0,duration:1,priority:0},{id:'c',arrival:2,duration:2,priority:5},{id:'d',arrival:4,duration:1,priority:-3},{id:'e',arrival:30,duration:1,priority:5}];
 function oracle(rows){let todo=rows.map((r,i)=>({...r,i})),now=0,out=[];while(todo.length){if(!todo.some(x=>x.arrival<=now))now=Math.min(...todo.map(x=>x.arrival));const ready=todo.filter(x=>x.arrival<=now);ready.sort((a,b)=>(cfg.direction==='high'?b.priority-a.priority:a.priority-b.priority)+cfg.aging*(a.arrival-b.arrival)||a.i-b.i);const x=ready[0];out.push({id:x.id,start:now,end:now+x.duration});now+=x.duration;todo=todo.filter(y=>y!==x);}return out;}check(jobs,oracle(jobs));
 for(let priority=0;priority<12;priority++){const rows=[{id:'start',arrival:0,duration:5,priority:99},{id:'old',arrival:1,duration:1,priority},{id:'new',arrival:4,duration:1,priority:5}];check(rows,oracle(rows));}`);
family('Union-find components',cross([3,4,5,6,7],['minimum','maximum'],(size,root)=>({size,root})),unionFind,
 c=>`Start ${c.size} singleton nodes numbered0..${c.size-1}. Input operations {type:'union'|'same',a,b}. Union representative is always ${c.root} node in the component. Implement full path compression. Return {answers,roots,components}; answers for same operations; roots after compressing every node. Invalid node throws RangeError('Unknown node'); unknown operation throws Error('Unknown operation').`,
 c=>`check([],{answers:[],roots:Array.from({length:cfg.size},(_,i)=>i),components:cfg.size});const ops=[{type:'same',a:0,b:1},{type:'union',a:0,b:1},{type:'union',a:2,b:1},{type:'same',a:0,b:2},{type:'union',a:cfg.size-1,b:2},{type:'same',a:cfg.size-1,b:0}];let groups=Array.from({length:cfg.size},(_,i)=>[i]),answers=[];for(const op of ops){const a=groups.find(g=>g.includes(op.a)),b=groups.find(g=>g.includes(op.b));if(op.type==='same')answers.push(a===b);else if(a!==b){groups=groups.filter(g=>g!==a&&g!==b);groups.push([...a,...b]);}}check(ops,{answers,roots:Array.from({length:cfg.size},(_,i)=>{const g=groups.find(g=>g.includes(i));return cfg.root==='minimum'?Math.min(...g):Math.max(...g);}),components:groups.length});assert.throws(()=>solve([{type:'same',a:-1,b:0}]),/Unknown node/);`);
family('Dijkstra route policies',cross([0,1,2,3,4],['lexical','fewest'],(toll,tie)=>({toll,tie})),dijkstra,
 c=>`Input {nodes,edges,start}, unique ASCII labels, directed [from,to,weight], strictly positive weights and valid labels. Each edge costs weight+${c.toll}. Return input-node-order {node,cost,path}, unreachable cost null/path[]. Shortest ties prefer ${c.tie==='fewest'?'fewest vertices, then lexical JSON path':'lexical JSON path'}; start path [start], cost0. Use Dijkstra; no mutation.`,
 c=>`check({nodes:['a'],edges:[],start:'a'},[{node:'a',cost:0,path:['a']}]);
 function oracle(input){const routes=new Map();function visit(at,cost,route){const prev=routes.get(at),lex=prev&&JSON.stringify(route)<JSON.stringify(prev.path);if(!prev||cost<prev.cost||(cost===prev.cost&&(cfg.tie==='fewest'&&route.length!==prev.path.length?route.length<prev.path.length:lex)))routes.set(at,{cost,path:route});for(const [a,b,w] of input.edges)if(a===at&&!route.includes(b))visit(b,cost+w+cfg.toll,[...route,b]);}visit(input.start,0,[input.start]);return input.nodes.map(node=>({node,...(routes.get(node)||{cost:null,path:[]})}));}
 for(let w=1;w<=10;w++){const input={nodes:['s','a','b','t','z'],start:'s',edges:[['s','a',1],['a','b',1],['b','t',1],['s','t',w],['a','t',w],['t','s',2]]};check(input,oracle(input));}`);
family('KMP substring matches',cross(['all','disjoint','first','last','count'],[false,true],(output,fold)=>({output,fold})),kmp,
 c=>`Input {text,pattern}, ASCII strings. KMP search with ${c.fold?'ASCII case folding':'exact case'}. Output ${c.output}: all returns overlapping offsets; disjoint greedily skips consumed pattern; first/last returns index or -1; count counts overlaps. Empty pattern matches every boundary0..text.length in every mode, including disjoint. Indices are UTF-16 offsets.`,
 c=>`function oracle(input){const t=cfg.fold?input.text.toLowerCase():input.text,p=cfg.fold?input.pattern.toLowerCase():input.pattern,h=[];for(let i=0;i<=t.length-p.length;i++){if(t.slice(i,i+p.length)===p){h.push(i);if(cfg.output==='disjoint'&&p.length)i+=p.length-1;}}return cfg.output==='first'?(h[0]??-1):cfg.output==='last'?(h.at(-1)??-1):cfg.output==='count'?h.length:h;}
 for(const input of [{text:'',pattern:''},{text:'abc',pattern:''},{text:'ABabaBa',pattern:'aba'},{text:'aaaaa',pattern:'aa'},{text:'ababcababd',pattern:'ababd'},{text:'a',pattern:'long'},{text:'abc',pattern:'z'}])check(input,oracle(input));`);
family('Decimal-string arithmetic',cross(['add','difference','subtract','multiply','maximum'],[false,true],(op,pad)=>({op,pad})),decimalArithmetic,
 c=>`Input nonempty unsigned digit strings {a,b}. Compute ${c.op} exactly without Number whole-value conversion or BigInt in your implementation. Difference is absolute; subtract a-b throws RangeError('Negative result') if negative; maximum returns greater numeric operand. ${c.pad?'Pad output to at least max original input width.':'Return canonical digits, zero as 0.'} Invalid input throws TypeError('Decimal digits required').`,
 c=>`for(const [a,b] of [['0','0'],['0012','0007'],['999999999999999999999999','1'],['12345678901234567890','987654321'],['4','9']]){if(cfg.op==='subtract'&&BigInt(a)<BigInt(b)){assert.throws(()=>solve({a,b}),/Negative result/);continue;}const x=BigInt(a),y=BigInt(b);let result=String(cfg.op==='add'?x+y:cfg.op==='difference'?(x>y?x-y:y-x):cfg.op==='subtract'?x-y:cfg.op==='multiply'?x*y:x>y?x:y);if(cfg.pad)result=result.padStart(Math.max(a.length,b.length),'0');check({a,b},result);}assert.throws(()=>solve({a:'1.2',b:'0'}),/Decimal digits/);`);
// Huffman length ignores both edge labels and equal-weight tie-breaking.
// Length scenarios therefore vary active units (bits versus padded bytes).
family('Huffman prefix codes',cross(['ascending','descending'],['table0','table1','both0','both1','length'],(tie,mode)=>mode==='length'?{output:'length',unit:tie==='ascending'?'bits':'bytes'}:{tie,output:mode.startsWith('table')?'table':'both',zero:mode.endsWith('0')?'0':'1'}),
 huffman,c=>`Input ASCII string. Huffman frequencies; repeatedly merge two least-weight nodes, ties ${c.tie||'ascending (length invariant)'} by sorted concatenated leaf-symbol key. First removed is left child. ${c.output==='length'?`Return ${c.unit==='bytes'?'ceil(total encoded bit length/8), padding final byte':'total encoded bit length'}; singleton uses1 bit per symbol.`:`Left edge uses ${c.zero}, right opposite; singleton code ${c.zero}. Return ${c.output==='table'?'[symbol,code] table sorted ASCII':'{codes,bits}, table sorted ASCII and encoded original input'}.`} Empty yields ${c.output==='length'?'0':c.output==='table'?'[]':'{codes:[],bits:""}'}.`,
 c=>`function oracle(text){const counts={};for(const ch of text)counts[ch]=(counts[ch]||0)+1;let nodes=Object.keys(counts).map(k=>({key:k,w:counts[k],codes:{[k]:''}}));while(nodes.length>1){nodes.sort((a,b)=>a.w-b.w||(a.key<b.key?(cfg.tie==='ascending'?-1:1):a.key>b.key?(cfg.tie==='ascending'?1:-1):0));const a=nodes.shift(),b=nodes.shift(),codes={};for(const k of Object.keys(a.codes))codes[k]=(cfg.zero||'0')+a.codes[k];for(const k of Object.keys(b.codes))codes[k]=(cfg.zero==='1'?'0':'1')+b.codes[k];nodes.push({key:Object.keys(codes).sort().join(''),w:a.w+b.w,codes});}const map=nodes[0]?.codes||{};for(const k of Object.keys(map))if(!map[k])map[k]=cfg.zero||'0';const codes=Object.keys(map).sort().map(k=>[k,map[k]]),bits=[...text].map(k=>map[k]).join('');return cfg.output==='table'?codes:cfg.output==='length'?(cfg.unit==='bytes'?Math.ceil(bits.length/8):bits.length):{codes,bits};}
 for(const text of ['', 'aaaa', 'ab', 'abcde', 'abbcccdddd', 'banana bandana'])check(text,oracle(text));`);
family('JSON wildcard selection',[
 ...cross(['forward','reverse'],['skip','null','error'],(order,missing)=>({order,missing,output:'all'})),
 ...cross(['forward','reverse'],['skip','null'],(order,missing)=>({order,missing,output:'first'}))
],jsonSelection,
 c=>`Input {value,path}, JSON data, path array of own-property string tokens or '*'. Expand wildcard over Object.keys order ${c.order}; primitives have no wildcard children. Literal missing key ${c.missing==='skip'?'drops branch':c.missing==='null'?'produces null':'throws Error("Missing path")'}. Repeat per path segment. Return ${c.output==='all'?'all resulting values':'first resulting value or null'}. Empty path selects root. No prototype traversal, no expressions or recursive descent.`,
 c=>`function oracle(value,tokens){if(!tokens.length)return [value];const [token,...rest]=tokens;let children=[];if(token==='*'){if(value&&typeof value==='object'){let entries=Object.entries(value);if(cfg.order==='reverse')entries.reverse();children=entries.map(x=>x[1]);}}else if(value&&typeof value==='object'&&Object.hasOwn(value,token))children=[value[token]];else if(cfg.missing==='error')throw Error('Missing path');else if(cfg.missing==='null')children=[null];return children.flatMap(x=>oracle(x,rest));}
 const value={users:[{name:'A',score:0},{name:'B'},{name:'C',score:4}],empty:[],n:null};for(const route of [[],['users','*','name'],['users','*','score'],['n','x'],['missing'],['empty','*'],['toString']]){let expected;try{expected=oracle(value,route);}catch{assert.throws(()=>solve({value,path:route}),/Missing path/);continue;}check({value,path:route},cfg.output==='all'?expected:expected[0]??null);}`);
family('Wildcard topic bus',[
 ...cross(['forward','reverse','priority'],[false,true],(order,live)=>({order,live,errors:'collect'})),
 ...cross(['forward','priority'],[false,true],(order,live)=>({order,live,errors:'throw'}))
],topicBus,
 c=>`Export solve() returning {subscribe(pattern,callback,priority=0),emit(topic,value)}. Dot topics; '*' matches one segment, terminal '**' matches zero or more. Subscribe returns idempotent unsubscribe. Emit snapshots matching listeners in ${c.order} order (priority descending then registration). ${c.live?'Skip snapshot listeners unsubscribed before their turn.':'Snapshot listeners still fire after unsubscribe during dispatch.'} New listeners never join current dispatch. Errors ${c.errors==='throw'?'propagate immediately':'collect message strings and continue'}. Return {delivered,errors}, including throwing callbacks in delivered. Fresh instance isolation.`,
 c=>`const bus=solve();deep(bus.emit('a',1),{delivered:0,errors:[]});const calls=[];const registrations=[['a.*','single',1],['a.**','many',3],['**','all',2],['a','exact',0]];for(const [pattern,id,priority] of registrations)bus.subscribe(pattern,(value,topic)=>calls.push([id,value,topic]),priority);const sorted=(rows)=>[...rows].sort((a,b)=>cfg.order==='priority'?b[2]-a[2]:cfg.order==='reverse'?registrations.indexOf(b)-registrations.indexOf(a):registrations.indexOf(a)-registrations.indexOf(b));deep(bus.emit('a.b',7),{delivered:3,errors:[]});deep(calls,sorted(registrations.slice(0,3)).map(x=>[x[1],7,'a.b']));calls.length=0;bus.emit('a',8);deep(calls,sorted(registrations.slice(1)).map(x=>[x[1],8,'a']));
 const mutation=solve(),log=[];let offB;const a=()=>{log.push('A');offB();mutation.subscribe('x',()=>log.push('late'));};if(cfg.order==='reverse'){offB=mutation.subscribe('x',()=>log.push('B'));mutation.subscribe('x',a);}else{mutation.subscribe('x',a,9);offB=mutation.subscribe('x',()=>log.push('B'));}mutation.emit('x',0);deep(log,cfg.live?['A']:['A','B']);offB();
 const broken=solve();broken.subscribe('x',()=>{throw Error('boom');});if(cfg.errors==='throw')assert.throws(()=>broken.emit('x',1),/boom/);else deep(broken.emit('x',1),{delivered:1,errors:['boom']});deep(solve().emit('x',0),{delivered:0,errors:[]});`);
family('Async semaphore queues',cross([1,2,3,4,5],['fifo','lifo'],(permits,queue)=>({permits,queue})),semaphore,
 c=>`Export solve() -> {acquire,stats}. ${c.permits} permits. acquire() returns Promise<releaseFunction>; grant immediately if available, otherwise queue ${c.queue}. Release is idempotent and hands permit directly to one waiter before later acquisitions. stats() is {active,waiting}. Every instance independent. No timers, polling, or tasks run by semaphore itself.`,
 c=>`const sem=solve();deep(sem.stats(),{active:0,waiting:0});const held=[];for(let i=0;i<cfg.permits;i++)held.push(await sem.acquire());deep(sem.stats(),{active:cfg.permits,waiting:0});const order=[],granted=[];const waiting=[0,1,2].map(i=>sem.acquire().then(release=>{order.push(i);granted.push(release);}));await Promise.resolve();deep(order,[]);deep(sem.stats(),{active:cfg.permits,waiting:3});held[0]();held[0]();await Promise.resolve();deep(order,[cfg.queue==='fifo'?0:2]);deep(sem.stats(),{active:cfg.permits,waiting:2});granted[0]();await Promise.resolve();granted[1]();await Promise.all(waiting);deep(order,cfg.queue==='fifo'?[0,1,2]:[2,1,0]);granted[2]();for(const release of held.slice(1))release();deep(sem.stats(),{active:0,waiting:0});deep(solve().stats(),{active:0,waiting:0});`);
family('Lazy iterator pipelines',cross(['even','positive','square','negate','double'],[2,4],(mode,take)=>({mode,take})),lazyPipeline,
 c=>`Input iterable of finite numbers. Return lazy iterable: ${c.mode==='even'?'filter even integers':c.mode==='positive'?'filter strictly positive':c.mode==='square'?'square each value':c.mode==='negate'?'negate each value':'double each value'}, then take at most ${c.take}. Do not pull input at construction or beyond the last yielded item. Early consumer termination or reaching take must close underlying iterator with return(). Do not materialize input.`,
 c=>`let pulls=0,closed=0;function* source(){try{for(const n of [-2,-1,0,1,2,3,4,5,6,7,8,9]){pulls++;yield n;}}finally{closed++;}}const iterator=solve(source());eq(pulls,0);const result=[...iterator];const values=[-2,-1,0,1,2,3,4,5,6,7,8,9];const projected=values.filter(x=>cfg.mode==='even'?x%2===0:cfg.mode==='positive'?x>0:true).map(x=>cfg.mode==='square'?x*x:cfg.mode==='negate'?-x:cfg.mode==='double'?x*2:x).slice(0,cfg.take);deep(result,projected);eq(closed,1);let expectedPulls=0,kept=0;for(const x of values){expectedPulls++;if(cfg.mode==='even'?x%2===0:cfg.mode==='positive'?x>0:true)kept++;if(kept===cfg.take)break;}eq(pulls,expectedPulls);pulls=0;closed=0;for(const x of solve(source())){void x;break;}eq(closed,1);deep([...solve([])],[]);`);
family('Persistent versioned stacks',cross(['top','bottom','size','peek','last-two'],['empty','error'],(view,empty)=>({view,empty})),persistentStacks,
 c=>`Input operations referencing existing version number. Version0 empty; push {version,value} appends a version, pop {version} appends tail version; read {version} appends query output. Versions never change; branch freely. Empty pop ${c.empty==='error'?'throws RangeError("Empty stack")':'creates another empty version'}. Read view ${c.view}: top/bottom order array, size number, peek value or null, last-two top two. Return {versions:count,queries}. Invalid version RangeError('Unknown version'). Values are non-null JSON primitives. Implement immutable linked nodes with structural sharing.`,
 c=>`check([],{versions:1,queries:[]});const ops=[{type:'push',version:0,value:'a'},{type:'push',version:1,value:'b'},{type:'push',version:1,value:'branch'},{type:'push',version:2,value:'c'},{type:'pop',version:4},{type:'read',version:4},{type:'read',version:2},{type:'read',version:3},{type:'read',version:5},{type:'read',version:0}];const versions=[[]],queries=[];for(const op of ops){const a=versions[op.version];if(op.type==='push')versions.push([op.value,...a]);else if(op.type==='pop')versions.push(a.slice(1));else queries.push(cfg.view==='size'?a.length:cfg.view==='peek'?(a[0]??null):cfg.view==='bottom'?[...a].reverse():cfg.view==='last-two'?a.slice(0,2):a);}check(ops,{versions:versions.length,queries});if(cfg.empty==='error')assert.throws(()=>solve([{type:'pop',version:0}]),/Empty stack/);else check([{type:'pop',version:0}],{versions:2,queries:[]});assert.throws(()=>solve([{type:'read',version:9}]),/Unknown version/);`);
family('Precedence expression parsing',[
 ...cross(['standard','flat'],['left','right'],(precedence,power)=>({precedence,power,unaryPlus:false})),
 ...cross(['standard','flat'],['left','right'],(precedence,power)=>({precedence,power,unaryPlus:true})),
 {precedence:'standard',power:'right',unaryPlus:false,offset:1},
 {precedence:'flat',power:'right',unaryPlus:true,offset:1}
],expression,
 c=>`Parse ASCII numeric expressions with parentheses, + - * / ^ and whitespace. ${c.precedence==='flat'?'All binary operators except ^ share precedence.':'* / bind above + -.'} ^ always highest binary precedence and ${c.power}-associative. Unary minus binds tighter than ^; unary plus ${c.unaryPlus?'allowed':'invalid'}. No eval/Function. Invalid syntax, division by zero, nonfinite results throw SyntaxError('Invalid expression'). ${c.offset?'Return computed result plus1 (calibrated result policy).':'Return computed numeric result.'} Normalize -0.`,
 c=>`const extra=cfg.offset||0;check('2 + 3 * 4',(cfg.precedence==='flat'?20:14)+extra);check('2 ^ 3 ^ 2',(cfg.power==='left'?64:512)+extra);check('(2 + 3) * 4',20+extra);check('-2 ^ 2',4+extra);check(' 1.5 * 4 - 2 ',4+extra);check('8 / 2 / 2',2+extra);if(cfg.unaryPlus)check('+2',2+extra);else assert.throws(()=>solve('+2'),/Invalid expression/);for(const text of ['', '1 2','1 +','(1','1)','1a','1 / 0'])assert.throws(()=>solve(text),/Invalid expression/);`);
family('LCS edit scripts',[
 ...cross(['delete','insert'],[false,true],(tie,fold)=>({tie,fold,output:'ops'})),
 ...cross(['delete','insert'],[false,true],(tie,fold)=>({tie,fold,output:'common'})),
 {fold:false,output:'length'}, {fold:true,output:'length'}
],lcsDiff,
 c=>`Input {a,b}, ASCII strings. Longest common subsequence via dynamic programming, ${c.fold?'ignore case':'case-sensitive'}. Return ${c.output==='ops'?'edit operations [keep|delete|insert,character]':c.output==='common'?'common subsequence text':'LCS length'}. ${c.output==='length'?'Only length matters.':`Walk from start; when equal always keep target character; on equal LCS alternatives prefer ${c.tie}.`} Delete character comes from a, keep/insert from b. Not Levenshtein: substitutions are separate delete and insert.`,
 c=>`function oracle(a,b){const equal=(x,y)=>cfg.fold?x.toLowerCase()===y.toLowerCase():x===y;const memo=new Map();function go(i,j){const key=i+','+j;if(memo.has(key))return memo.get(key);let result;if(i===a.length)result={n:0,ops:[...b.slice(j)].map(x=>['insert',x])};else if(j===b.length)result={n:0,ops:[...a.slice(i)].map(x=>['delete',x])};else if(equal(a[i],b[j])){const rest=go(i+1,j+1);result={n:rest.n+1,ops:[['keep',b[j]],...rest.ops]};}else{const del=go(i+1,j),ins=go(i,j+1),use=del.n>ins.n||(del.n===ins.n&&cfg.tie==='delete');const rest=use?del:ins;result={n:rest.n,ops:[[use?'delete':'insert',use?a[i]:b[j]],...rest.ops]};}memo.set(key,result);return result;}const r=go(0,0);return cfg.output==='length'?r.n:cfg.output==='common'?r.ops.filter(x=>x[0]==='keep').map(x=>x[1]).join(''):r.ops;}
 for(const [a,b] of [['',''],['abc',''],['','abc'],['ab','ba'],['ABC','abc'],['banana','ananas'],['abcbdab','bdcaba']])check({a,b},oracle(a,b));`);
family('Sudoku candidate validation',cross([1,2,3,4,5],[false,true],(box,diagonal)=>({box,diagonal})),sudoku,
 c=>`Input {board,row,col}. Board dimension ${c.box*c.box}, boxes ${c.box}x${c.box}, cells integer0..${c.box*c.box}; 0 blank. Reject wrong shape/cells with RangeError. Rows, columns, boxes${c.diagonal?' and both main diagonals':''} cannot duplicate nonzero digits. Return {valid:false,candidates:[]} on conflict. Otherwise candidates are ascending legal digits for chosen blank cell; occupied cell returns []. Coordinates checked on valid board only.`,
 c=>`const n=cfg.box*cfg.box,empty=()=>Array.from({length:n},()=>Array(n).fill(0));const board=empty();check({board,row:0,col:0},{valid:true,candidates:Array.from({length:n},(_,i)=>i+1)});board[0][0]=1;check({board,row:0,col:0},{valid:true,candidates:[]});if(n>1){check({board,row:0,col:1},{valid:true,candidates:Array.from({length:n-1},(_,i)=>i+2)});const dup=empty();dup[0][0]=1;dup[0][1]=1;check({board:dup,row:0,col:0},{valid:false,candidates:[]});const diagonal=empty();diagonal[0][0]=1;const r=cfg.box,c=cfg.box;check({board:diagonal,row:r,col:c},{valid:true,candidates:Array.from({length:n},(_,i)=>i+1).filter(x=>!cfg.diagonal||x!==1)});}assert.throws(()=>solve({board:[],row:0,col:0}),/Invalid board/);`);
family('Injected token-bucket limiter',cross([2,3,4,5,6],[0.5,1],(capacity,refill)=>({capacity,refill})),tokenBucket,
 c=>`solve({now}) creates independent token bucket, initially ${c.capacity} tokens. Injected now() returns finite monotonic virtual time. take(cost=1) first refills elapsed*${c.refill}, capped ${c.capacity}, then spends iff enough. Return {allowed,tokens}. Fractional tokens/cost permitted. Denial retains balance. Reverse time throws RangeError('Time reversed'). Nonfinite or nonpositive cost RangeError('Invalid cost'). No real timers.`,
 c=>`let time=0;const bucket=solve({now:()=>time});deep(bucket.take(cfg.capacity),{allowed:true,tokens:0});deep(bucket.take(),{allowed:false,tokens:0});time=1;deep(bucket.take(0.5),{allowed:true,tokens:cfg.refill-0.5});time=100;deep(bucket.take(1),{allowed:true,tokens:cfg.capacity-1});deep(bucket.take(cfg.capacity+1),{allowed:false,tokens:cfg.capacity-1});assert.throws(()=>bucket.take(0),/Invalid cost/);time=99;assert.throws(()=>bucket.take(),/Time reversed/);let t=0;const other=solve({now:()=>t});deep(other.take(),{allowed:true,tokens:cfg.capacity-1});`);
family('Bloom membership bitsets',cross([7,11,17,23,31],[2,3],(bits,hashes)=>({bits,hashes})),bloom,
 c=>`Input add/has operations {type,value}, ASCII strings. Start zero bitset length${c.bits}. Hash a starts0, update (a*31+charCode)%m; b starts0, update (b*17+charCode+1)%m. ${c.hashes} positions (a+i*(b||1))%m, i starts0. Add sets bits; has true iff all set (false positives intentional). Return {answers,bits} as bit string index0 first. No deletion. Unknown type throws Error.`,
 c=>`function oracle(ops){const set=new Set(),answers=[];const indexes=s=>{const codes=[...s].map(x=>x.charCodeAt(0));const a=codes.reduce((h,x)=>(h*31+x)%cfg.bits,0),b=codes.reduce((h,x)=>(h*17+x+1)%cfg.bits,0);return Array.from({length:cfg.hashes},(_,i)=>(a+i*(b||1))%cfg.bits);};for(const op of ops){const p=indexes(op.value);if(op.type==='add')p.forEach(x=>set.add(x));else answers.push(p.every(x=>set.has(x)));}return {answers,bits:Array.from({length:cfg.bits},(_,i)=>set.has(i)?'1':'0').join('')};}check([],{answers:[],bits:'0'.repeat(cfg.bits)});const ops=[{type:'has',value:'a'},{type:'add',value:'a'},{type:'has',value:'a'},{type:'add',value:''},{type:'has',value:''},...['b','aa','ab','z','__proto__'].map(value=>({type:'has',value}))];check(ops,oracle(ops));assert.throws(()=>solve([{type:'bad',value:'a'}]),/Unknown operation/);`);
family('Fenwick point updates',[
 ...cross(['set','add'],[false,true],(update,inclusive)=>({update,inclusive,output:'sum'})),
 ...cross(['set','add'],[false,true],(update,inclusive)=>({update,inclusive,output:'average'})),
 {update:'set',inclusive:false,output:'sum',initialOffset:1},
 {update:'add',inclusive:true,output:'average',initialOffset:1}
],fenwick,
 c=>`Input {values,ops}, finite numbers. Fenwick tree supports update {index,value} (${c.update}) and range {start,end} (${c.inclusive?'inclusive end':'exclusive end'}). Return {answers,values} snapshot after updates; queries return ${c.output}, empty average null. ${c.initialOffset?'Initialize every input value plus1 before processing.':''} Invalid integer index/range throws RangeError. Empty ranges allowed only if normalized end===start. O(log n) updates/queries after setup, no input mutation.`,
 c=>`const values=[2,4,6,8,10],ops=[{type:'range',start:0,end:3},{type:'update',index:1,value:3},{type:'range',start:1,end:3},{type:'update',index:4,value:-2},{type:'range',start:4,end:cfg.inclusive?4:5}];const a=values.map(x=>x+(cfg.initialOffset||0)),answers=[];for(const op of ops){if(op.type==='update')a[op.index]=cfg.update==='set'?op.value:a[op.index]+op.value;else{const range=a.slice(op.start,op.end+(cfg.inclusive?1:0)),sum=range.reduce((s,x)=>s+x,0);answers.push(cfg.output==='sum'?sum:range.length?sum/range.length:null);}}check({values,ops},{answers,values:a});check({values:[],ops:[]},{answers:[],values:[]});assert.throws(()=>solve({values:[1],ops:[{type:'update',index:1,value:2}]}),/Index/);assert.throws(()=>solve({values:[1],ops:[{type:'range',start:-1,end:0}]}),/Range/);`);
family('Segment-tree extrema',[
 ...cross(['min','max'],['first','last'],(extreme,tie)=>({extreme,tie,output:'pair'})),
 ...cross(['min','max'],['first','last'],(extreme,tie)=>({extreme,tie,output:'index'})),
 {extreme:'min',output:'value'}, {extreme:'max',output:'value'}
],segmentTree,
 c=>`Input {values,ops}. Point set {index,value}; query {start,end} over half-open range. Segment tree finds ${c.extreme}; ${c.output==='value'?'return value':`ties choose ${c.tie} index; return ${c.output==='index'?'index':'{value,index}'}`}. Return array of query results, null for empty range. Invalid range/index RangeError. Keep input immutable; use O(log n) point updates/queries.`,
 c=>`const values=[4,1,7,1,7,3],ops=[{type:'query',start:0,end:6},{type:'query',start:1,end:4},{type:'set',index:1,value:9},{type:'query',start:0,end:6},{type:'set',index:2,value:9},{type:'query',start:0,end:6},{type:'query',start:2,end:2}];const a=[...values],answers=[];for(const op of ops){if(op.type==='set')a[op.index]=op.value;else{const range=a.slice(op.start,op.end);if(!range.length){answers.push(null);continue;}const value=cfg.extreme==='min'?Math.min(...range):Math.max(...range);const index=op.start+(cfg.tie==='last'?range.lastIndexOf(value):range.indexOf(value));answers.push(cfg.output==='value'?value:cfg.output==='index'?index:{value,index});}}check({values,ops},answers);check({values:[],ops:[]},[]);assert.throws(()=>solve({values:[],ops:[{type:'query',start:0,end:1}]}),/Range/);`);
family('Consistent-hash ring',cross([1,2,3,4,5],[97,127],(replicas,slots)=>({replicas,slots})),hashRing,
 c=>`Input {nodes,keys}, unique ASCII node labels, ASCII key strings. Ring modulus ${c.slots}; hash starts0, for each char h=(31*h+code)%modulus. Create ${c.replicas} virtual nodes per label using node+'#'+replica, replica0-based. Sort by position, then node ASCII, then replica. Key owner first ring position>=hash(key), wrapping. Return owners in key order, null when no nodes. Use binary-search successor.`,
 c=>`const hash=s=>[...s].reduce((h,c)=>(31*h+c.charCodeAt(0))%cfg.slots,0);function oracle(nodes,keys){const slots=[];for(const node of nodes)for(let replica=0;replica<cfg.replicas;replica++)slots.push({node,p:hash(node+'#'+replica),replica});slots.sort((a,b)=>a.p-b.p||(a.node<b.node?-1:a.node>b.node?1:a.replica-b.replica));return keys.map(key=>(slots.find(x=>x.p>=hash(key))||slots[0])?.node??null);}const keys=['','a','b','c','account-1','account-2','zz','__proto__',...Array.from({length:30},(_,i)=>String(i))];for(const nodes of [[],['solo'],['a','b','c'],['a','c'],['c','b','a']])check({nodes,keys},oracle(nodes,keys));`);
family('Zero-one knapsack policies',cross([4,5,6,7,8],['lighter','heavier'],(capacity,tie)=>({capacity,tie})),knapsack,
 c=>`Input items {id,weight,value}, unique ASCII ids, positive integer weight and nonnegative value. Select each at most once, capacity ${c.capacity}. Maximize value, tied value prefers ${c.tie} total weight, then lexical JSON id array in original item order. Return {value,ids,weight}; empty selection allowed. Dynamic programming; invalid weight RangeError('Weight').`,
 c=>`check([],{value:0,ids:[],weight:0});function oracle(items){let best=null;for(let mask=0;mask<2**items.length;mask++){const selected=items.filter((_,i)=>mask&(1<<i)),weight=selected.reduce((s,x)=>s+x.weight,0);if(weight>cfg.capacity)continue;const candidate={value:selected.reduce((s,x)=>s+x.value,0),ids:selected.map(x=>x.id),weight};if(!best||candidate.value>best.value||(candidate.value===best.value&&(weight!==best.weight?(cfg.tie==='lighter'?weight<best.weight:weight>best.weight):JSON.stringify(candidate.ids)<JSON.stringify(best.ids))))best=candidate;}return best;}const items=[{id:'a',weight:2,value:4},{id:'b',weight:3,value:4},{id:'c',weight:4,value:8},{id:'d',weight:1,value:0},{id:'e',weight:5,value:9}];check(items,oracle(items));check([...items].reverse(),oracle([...items].reverse()));assert.throws(()=>solve([{id:'a',weight:0,value:9}]),/Weight/);`);
family('Elementary cellular automata',cross([30,54,90,110,184],[false,true],(rule,wrap)=>({rule,wrap})),automaton,
 c=>`Input {cells,steps}, array of0/1 and nonnegative integer steps. Elementary rule ${c.rule}: neighborhood code=left*4+self*2+right, next=(rule>>code)&1. Boundary ${c.wrap?'wraps circularly':'outside zero'}. Synchronous updates. Return history including initial snapshot. Empty cells produces steps+1 empty rows. Invalid steps RangeError('Steps').`,
 c=>`function oracle(cells,steps){const history=[[...cells]];for(let step=0;step<steps;step++){const prior=history.at(-1),next=[];for(let i=0;i<prior.length;i++){const triple=[i-1,i,i+1].map(j=>cfg.wrap?prior[(j+prior.length)%prior.length]:(prior[j]||0));const bit=parseInt(triple.join(''),2);next.push(Math.floor(cfg.rule/(2**bit))%2);}history.push(next);}return history;}for(const cells of [[],[0],[1],[1,0,1],[0,0,1,0,0],[1,1,0,0,1,0,1]])for(const steps of [0,1,4])check({cells,steps},oracle(cells,steps));assert.throws(()=>solve({cells:[],steps:-1}),/Steps/);`);
family('Polynomial convolution',cross([0,2,5,7,11],[false,true],(modulus,trim)=>({modulus,trim})),polynomial,
 c=>`Input {a,b}, finite integer polynomial coefficients in ascending exponent order, values small enough for exact JS arithmetic. Multiply by convolution. ${c.modulus?'Reduce every coefficient to nonnegative residue modulo'+c.modulus+'.':'No modular reduction.'} ${c.trim?'Remove trailing zero coefficients; zero polynomial [].':'Preserve full a.length+b.length-1 width even trailing zeros.'} Either input empty yields []. No mutation.`,
 c=>`function oracle(a,b){if(!a.length||!b.length)return [];const out=Array.from({length:a.length+b.length-1},(_,degree)=>a.reduce((sum,x,i)=>sum+x*(b[degree-i]??0),0)).map(x=>cfg.modulus?((x%cfg.modulus)+cfg.modulus)%cfg.modulus:x);if(cfg.trim)while(out.length&&out.at(-1)===0)out.pop();return out;}for(const [a,b] of [[[],[]],[[0],[1]],[[1,2,3],[4,5]],[[1,-1],[1,1]],[[-3,4,0],[2,0]],[[-1,7,2],[5,-4,3]]])check({a,b},oracle(a,b));`);

function emit() {
  if(process.argv.length!==2)throw new Error('No generator flags supported');
  if(fs.existsSync(target))throw new Error('Refusing to overwrite existing js-more directory');
  const predecessor=JSON.parse(fs.readFileSync(path.join(__dirname,'react-300','manifest.json'),'utf8'));
  assert.equal(Math.max(...predecessor.map(x=>x.id)),1718,'Unexpected predecessor last ID');
  assert.equal(families.length,25);
  const definitions=[],seen=new Set();
  for(const f of families)for(let index=0;index<10;index++){
    const cfg=f.configs[index];
    // Keys contain active policies only (e.g. extrema value ignores tie policy).
    const semanticKey=json(Object.fromEntries(Object.entries(cfg).sort(([a],[b])=>a<b?-1:1)));
    const key=f.name+'|'+semanticKey;assert.ok(!seen.has(key),'Duplicate semantic configuration '+key);seen.add(key);
    const id=1719+definitions.length;
    definitions.push({f,cfg,id,scenario:index+1,semanticKey});
  }
  assert.equal(definitions.length,250);
  fs.mkdirSync(target);
  for(const dir of ['prompts','starters','solutions','tests'])fs.mkdirSync(path.join(target,dir));
  const manifest=[];
  for(const {f,cfg,id,scenario,semanticKey} of definitions){
    const variant=Object.entries(cfg).map(([k,v])=>k+'='+v).join('; '),title=f.name+' / scenario '+scenario+' — '+variant;
    const spec=f.spec(cfg);
    const header='// '+id+' '+title+'\n// Prompt: ../prompts/'+id+'.txt\n';
    let implementation=f.implementation.toString();
    // These policies intentionally alter arithmetic initial state/output; apply
    // them in emitted source so each solution remains self-contained.
    if(f.name==='Precedence expression parsing'&&cfg.offset)implementation=implementation.replace('return Object.is(result,-0)?0:result;','return (Object.is(result,-0)?0:result)+cfg.offset;');
    if(f.name==='Fenwick point updates'&&cfg.initialOffset)implementation=implementation.replace('const nums=[...input.values]','const nums=input.values.map(x=>x+cfg.initialOffset)');
    if(f.name==='Huffman prefix codes'&&cfg.output==='length')implementation=implementation.replaceAll('cfg.zero',"'0'");
    const solution=header+"'use strict';\nconst cfg="+json(cfg)+';\n'+implementation+'\nmodule.exports='+f.implementation.name+';\n';
    const starter=header+"'use strict';\nfunction solve(input) {\n  // TODO: implement this scenario independently.\n  throw new Error('TODO exercise "+id+"');\n}\nmodule.exports=solve;\n";
    const test=header+"'use strict';\nconst assert=require('node:assert/strict');\nconst cfg="+json(cfg)+";\nmodule.exports=async solve=>{\nconst eq=assert.equal,deep=assert.deepEqual;\nfunction check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}\n"+f.test(cfg)+'\n};\n';
    const prompt=title+'\n\nTASK\n'+spec+'\n\nCONTRACT\nExport one CommonJS function: module.exports=solve. Each call creates independent state. Do not import another exercise or reference solution. Preserve inputs. Tests use only Node built-ins and injected synchronous clocks or promise microtasks; no network, DOM, timers, filesystem access, or random data. Algorithmic complexity/structural sharing requirements also need source review.\n\nEXAMPLES\nRead tests/'+id+'.cjs for executable input/output cases and an independent oracle.\n\nRUN FROM unionboot\nnode js-more/verify.cjs --id='+id+'\nnode js-more/verify.cjs --starters --id='+id+'\n\nPOLICIES\n'+variant+'\nSemantic key: '+semanticKey+'\n';
    const row={id,tech:'js',family:f.name,scenario,variant,title,starter:'starters/'+id+'.cjs',solution:'solutions/'+id+'.cjs',test:'tests/'+id+'.cjs',prompt:'prompts/'+id+'.txt'};
    for(const [field,content] of [['starter',starter],['solution',solution],['test',test],['prompt',prompt]])fs.writeFileSync(path.join(target,row[field]),content,{flag:'wx'});
    manifest.push(row);
  }
  fs.writeFileSync(path.join(target,'manifest.json'),json(manifest,null,2)+'\n',{flag:'wx'});
  fs.writeFileSync(path.join(target,'verify.cjs'),verifySource,{flag:'wx'});
  fs.writeFileSync(path.join(target,'GUIDE.txt'),'JAVASCRIPT MORE: 250 NEW SCENARIOS\n\nIDs1719..1968; 25 families x10 scenarios, not250 unrelated algorithms. Plain Node22 CommonJS, no dependencies. Every scenario has independent starter/reference/test and prompt. Cases deliberately revisit active policy, tie-break, boundary or initial-data choices. Existing tracks and root integration untouched.\n\nPRACTICE\nRead prompts/ID.txt, implement starters/ID.cjs, run node js-more/verify.cjs --starters --id=ID. Read tests before solutions. Fresh starters pass node --check but throw matching TODO exercise ID at runtime.\n\nVERIFY\nnode js-more/verify.cjs --inventory\nnode js-more/verify.cjs --id=1719\nnode js-more/verify.cjs --starters --id=1719\nnode js-more/verify.cjs\nnode js-more/verify.cjs --starters\nAlso supports --id ID. Exit0 success/inventory, exit1 grading or inventory failure, exit2 usage/unknown ID. Unknown and repeated flags are rejected. Every selected starter, solution and test passes node --check before runtime grading. Tests use multiple assertions per group. Runtime errors include phase and stack.\nReports verification-solution.json / verification-starter.json describe the latest run, including a single-ID run; per-ID runs additionally write verification-MODE-ID.json. Inspect groups before calling a report a full-suite result. Logs reference.log and blank.log describe latest run in that mode. Suites run sequentially; no installs, services, timers or wall-clock sleeps.\n\nDESIGN\nCommonJS module export follows js-rest architecture. Added explicit prompts, strict inventory/CLI, syntax phases, JSON reports and log files. Independent oracles use brute-force/reference mathematics and no solution imports. Structural/complexity constraints need code review as well as tests. Generator semantic gate requires unique family|active-policy JSON for every family. No inactive zero-bit knob for Huffman length; no tie knob for extrema values or LCS length.\n\nGENERATOR\nnode build-js-more.cjs creates js-more once. It refuses an existing js-more path; no overwrite flag. Never delete learner work to regenerate. Apply any future corrections surgically to generator and exact unchanged generated file. No grading suite is executed by generation or inventory.\n\nFAMILIES\n'+families.map((f,i)=>(1719+i*10)+'..'+(1728+i*10)+' '+f.name).join('\n')+'\n\nINDEX\n'+manifest.map(r=>r.id+' '+r.title).join('\n')+'\n',{flag:'wx'});
  console.log('Generated 250 exercises in js-more; IDs1719..1968. No grading suites run.');
}
const verifySource=String.raw`'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
let id,starters=false,inventory=false;const seen=new Set();
try{
 const args=process.argv.slice(2);
 for(let i=0;i<args.length;i++){
  const arg=args[i],name=arg==='--id'||arg.startsWith('--id=')?'--id':arg;
  if(seen.has(name))throw Error('Duplicate option '+name);seen.add(name);
  if(name==='--starters')starters=true;else if(name==='--inventory')inventory=true;
  else if(name==='--id'){const raw=arg==='--id'?args[++i]:arg.slice(5);if(!/^[0-9]+$/.test(raw||'')||!Number.isSafeInteger(Number(raw)))throw Error('Invalid id');id=Number(raw);}
  else throw Error('Unknown option '+arg);
 }
}catch(error){console.error(error.message);process.exit(2);}
let manifest;
try{
 manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'manifest.json'),'utf8'));
 assert.equal(manifest.length,250);assert.equal(new Set(manifest.map(x=>x.id)).size,250);assert.equal(new Set(manifest.map(x=>x.family)).size,25);
 const counts=new Map();
 manifest.forEach((row,i)=>{
  assert.equal(row.id,1719+i);assert.equal(row.tech,'js');assert.equal(row.scenario,i%10+1);counts.set(row.family,(counts.get(row.family)||0)+1);
  for(const field of ['family','variant','title','starter','solution','test','prompt'])assert.equal(typeof row[field],'string');
  for(const field of ['starter','solution','test','prompt']){const expected=(field==='prompt'?'prompts':field==='test'?'tests':field+'s')+'/'+row.id+(field==='prompt'?'.txt':'.cjs');assert.equal(row[field],expected);assert.ok(fs.statSync(path.join(__dirname,row[field])).isFile());}
 });
 for(const count of counts.values())assert.equal(count,10);
}catch(error){console.error('Inventory failure: '+error.stack);process.exit(1);}
if(id!==undefined&&!manifest.some(row=>row.id===id)){console.error('Unknown id '+id);process.exit(2);}
if(inventory){console.log('Inventory: 250 JS groups, 25 families, 250 prompts/starters/solutions/tests; IDs1719..1968. No grading run.');process.exit(0);}
const selected=id===undefined?manifest:manifest.filter(row=>row.id===id),mode=starters?'starter':'solution',results=[],logs=[];
const log=line=>{logs.push(line);console.log(line);};
(async()=>{
 for(const row of selected){let phase='syntax';try{
  for(const field of ['starter','solution','test']){const file=path.join(__dirname,row[field]);const checked=spawnSync(process.execPath,['--check',file],{encoding:'utf8',timeout:20000,windowsHide:true});if(checked.error)throw checked.error;if(checked.status!==0)throw Error('node --check '+row[field]+'\n'+checked.stderr+checked.stdout);}
  phase='runtime';const solve=require(path.join(__dirname,row[mode]));assert.equal(typeof solve,'function','CommonJS export must be function');await require(path.join(__dirname,row.test))(solve);
  results.push({id:row.id,passed:true,phase,error:null});log('PASS '+row.id+' '+row.title);
 }catch(error){results.push({id:row.id,passed:false,phase,error:error.stack||String(error)});log('FAIL '+row.id+' '+phase+' '+(error.stack||String(error)));}}
 const passed=results.filter(row=>row.passed).length,failed=results.length-passed;
 const report={track:'js-more',mode,groups:results.length,passed,failed,results};
 const text=JSON.stringify(report,null,2)+'\n';
 fs.writeFileSync(path.join(__dirname,'verification-'+mode+'.json'),text);
 if(id!==undefined)fs.writeFileSync(path.join(__dirname,'verification-'+mode+'-'+id+'.json'),text);
 log(mode+': '+passed+' passed, '+failed+' failed ('+results.length+' groups).');
 fs.writeFileSync(path.join(__dirname,starters?'blank.log':'reference.log'),logs.join('\n')+'\n');
 process.exitCode=failed?1:0;
})().catch(error=>{console.error(error);process.exitCode=1;});
`;
emit();
