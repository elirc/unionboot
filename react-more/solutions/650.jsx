// 650 Stable sortable table / scenario 12 — initial name descending; case-folded names; null always last
// Props rows {id,name,score}, score may be null. Accessible table columns ID, Name, Score. Initially name descending. Name/Score header buttons select ascending for a new column, toggle current. Compare names case-insensitively using < and > (not locale order). Null scores always last in both directions; show an em dash for null. Keep original prop order for ties, even descending. Set aria-sort on active th; inactive th uses none. Never mutate rows.
// Prompt: ../prompts/650.txt
// Run from unionboot: node react-more/verify.cjs --id=650 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [sort,set]=useState({key:'name',desc:true});const choose=key=>set(s=>({key,desc:s.key===key?!s.desc:false}));const sorted=rows.map((row,i)=>({row,i})).sort((a,b)=>{let x=a.row[sort.key],y=b.row[sort.key];if(x===null||y===null)return x===y?a.i-b.i:x===null?1:-1;if(sort.key==='name'){x=x.toLowerCase();y=y.toLowerCase();}const c=x<y?-1:x>y?1:0;return c?(sort.desc?-c:c):a.i-b.i;});return <table><thead><tr><th>ID</th>{['name','score'].map(key=><th key={key} aria-sort={sort.key===key?(sort.desc?'descending':'ascending'):'none'}><button onClick={()=>choose(key)}>{key==='name'?'Name':'Score'}</button></th>)}</tr></thead><tbody>{sorted.map(({row})=><tr key={row.id}><td>{row.id}</td><td>{row.name}</td><td>{row.score===null?'—':row.score}</td></tr>)}</tbody></table>;
}
