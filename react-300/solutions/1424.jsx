// 1424 Faceted record search / scenario 6 — Every token match; exclude archived; score >=0
// Props rows {id,name,kind,score,archived}. Query splits trimmed lowercase whitespace tokens; match every token as case-insensitive name substring; empty matches all. Kind select all/fruit/home combines with search. Always require score>=0 and not archived. List names only in input order, Count output. Clear filters resets query and Kind, not fixed policy. Reflect prop updates without mutating them.
// Full prompt: ../prompts/1424.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({rows=[]}) {
const [q,setQ]=useState(''),[kind,setKind]=useState('all');const tokens=q.trim().toLowerCase().split(/\s+/).filter(Boolean);const shown=rows.filter(x=>!x.archived&&x.score>=0&&(kind==='all'||x.kind===kind)&&(!tokens.length||tokens.every(t=>x.name.toLowerCase().includes(t))));return <section><label>Query<input value={q} onChange={e=>setQ(e.target.value)}/></label><label>Kind<select value={kind} onChange={e=>setKind(e.target.value)}><option>all</option><option>fruit</option><option>home</option></select></label><button onClick={()=>{setQ('');setKind('all');}}>Clear filters</button><ul>{shown.map(x=><li key={x.id}>{x.name}</li>)}</ul><output aria-label="Count">{shown.length}</output></section>;
}
