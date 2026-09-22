// 1434 Grouped totals view / scenario 6 — count aggregation; value ordering; hide zero groups; minimum amount 6
// Aggregate immutable props rows {id,group,amount} by group, count records. Positive only checkbox (false) keeps amount>=6 before grouping. Omit zero-valued groups. Sort descending aggregate with ascending group tie-break. List GROUP:VALUE; Groups output count. Recompute for new props and empty lists.
// Full prompt: ../prompts/1434.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({rows=[]}) {
const [positive,set]=useState(false);const groups=new Map();for(const r of rows){if(positive&&r.amount<6)continue;groups.set(r.group,(groups.get(r.group)||0)+1);}const shown=[...groups].filter(([,n])=>n!==0).sort((a,b)=>b[1]-a[1]||(a[0]<b[0]?-1:a[0]>b[0]?1:0));return <section><label>Positive only<input type="checkbox" checked={positive} onChange={e=>set(e.target.checked)}/></label><ul>{shown.map(([g,n])=><li key={g}>{g}:{n}</li>)}</ul><output aria-label="Groups">{shown.length}</output></section>;
}
