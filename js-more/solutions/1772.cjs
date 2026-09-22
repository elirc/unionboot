// 1772 Dijkstra route policies / scenario 4 — toll=1; tie=fewest
// Prompt: ../prompts/1772.txt
'use strict';
const cfg={"toll":1,"tie":"fewest"};
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
module.exports=dijkstra;
