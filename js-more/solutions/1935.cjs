// 1935 Consistent-hash ring / scenario 7 — replicas=4; slots=97
// Prompt: ../prompts/1935.txt
'use strict';
const cfg={"replicas":4,"slots":97};
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
module.exports=hashRing;
