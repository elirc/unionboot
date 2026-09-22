// 1431 Grouped totals view / scenario 3 — sum aggregation; name ordering; retain zero groups; minimum amount 3
// Aggregate immutable props rows {id,group,amount} by group, sum amount. Positive only checkbox (false) keeps amount>=3 before grouping. Keep zero groups. Sort ascending group code-unit order. List GROUP:VALUE; Groups output count. Recompute for new props and empty lists.
// Full prompt: ../prompts/1431.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({rows=[]}) {
const [positive,set]=useState(false);const groups=new Map();for(const r of rows){if(positive&&r.amount<3)continue;groups.set(r.group,(groups.get(r.group)||0)+r.amount);}const shown=[...groups].filter(([,n])=>true).sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0);return <section><label>Positive only<input type="checkbox" checked={positive} onChange={e=>set(e.target.checked)}/></label><ul>{shown.map(([g,n])=><li key={g}>{g}:{n}</li>)}</ul><output aria-label="Groups">{shown.length}</output></section>;
}
