// 1453 Compare selected records / scenario 5 — 3 compare slots; difference; retain hidden ids
// Pick ID checkboxes choose records in click order, cap 3; disable unchecked boxes at cap, selected remain removable. Selection output joins stored IDs by comma. Value output subtracts later existing values from the first selected existing value (0 if none). On prop disappearance retain ids/count toward cap but omit absent values from calculation. Clear resets selections. Preserve props.
// Full prompt: ../prompts/1453.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({rows=[]}) {
const [ids,set]=useState([]);const selected=ids.map(id=>rows.find(x=>x.id===id)).filter(Boolean),value=selected.length?selected.slice(1).reduce((n,x)=>n-x.value,selected[0].value):0;return <section>{rows.map(x=><label key={x.id}>Pick {x.id}<input type="checkbox" checked={ids.includes(x.id)} disabled={!ids.includes(x.id)&&ids.length>=3} onChange={()=>set(old=>old.includes(x.id)?old.filter(id=>id!==x.id):old.length<3?[...old,x.id]:old)}/></label>)}<output aria-label="Selection">{ids.join(',')}</output><output aria-label="Value">{value}</output><button onClick={()=>set([])}>Clear</button></section>;
}
