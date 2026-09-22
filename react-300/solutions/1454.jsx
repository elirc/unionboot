// 1454 Compare selected records / scenario 6 — 4 compare slots; sum; prune missing selection
// Pick ID checkboxes choose records in click order, cap 4; disable unchecked boxes at cap, selected remain removable. Selection output joins stored IDs by comma. Value output sums selected existing values (0 if none). On prop disappearance permanently remove missing ids. Clear resets selections. Preserve props.
// Full prompt: ../prompts/1454.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({rows=[]}) {
const [ids,set]=useState([]);useEffect(()=>set(old=>old.filter(id=>rows.some(x=>x.id===id))),[rows]);const selected=ids.map(id=>rows.find(x=>x.id===id)).filter(Boolean),value=selected.reduce((n,x)=>n+x.value,0);return <section>{rows.map(x=><label key={x.id}>Pick {x.id}<input type="checkbox" checked={ids.includes(x.id)} disabled={!ids.includes(x.id)&&ids.length>=4} onChange={()=>set(old=>old.includes(x.id)?old.filter(id=>id!==x.id):old.length<4?[...old,x.id]:old)}/></label>)}<output aria-label="Selection">{ids.join(',')}</output><output aria-label="Value">{value}</output><button onClick={()=>set([])}>Clear</button></section>;
}
