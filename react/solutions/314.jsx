// 314 Stable sortable table / scenario 1
// Props rows {id,name,score}; default order by name ascending. Name/Score header buttons choose ascending column; clicking current reverses. Preserve original tie order. Display data in accessible table.
// Run: node react/verify.cjs --id=314 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [sort,set]=useState({key:'name',desc:false});const sorted=rows.map((row,i)=>({row,i})).sort((a,b)=>{const x=a.row[sort.key],y=b.row[sort.key];const c=x<y?-1:x>y?1:0;return c?(sort.desc?-c:c):a.i-b.i;});const choose=key=>set(s=>({key,desc:s.key===key?!s.desc:false}));return <table><thead><tr><th><button onClick={()=>choose('name')}>Name</button></th><th><button onClick={()=>choose('score')}>Score</button></th></tr></thead><tbody>{sorted.map(({row})=><tr key={row.id}><td>{row.name}</td><td>{row.score}</td></tr>)}</tbody></table>;}
