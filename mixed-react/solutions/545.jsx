// 545 Checklist selection cap / scenario 2
// Mixed integration variant: render with props.seed changing the component key in a parent to reset all local state; do not store state outside React. Render four checkboxes A–D. Allow at most 2 selections. Disable unchecked boxes when cap reached but keep selected boxes enabled. Output comma-separated selected labels in click order.
// Run: node mixed-react/verify.cjs --id=545 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [selected,set]=useState([]);return <section>{['A','B','C','D'].map(x=><label key={x}>{x}<input type="checkbox" checked={selected.includes(x)} disabled={!selected.includes(x)&&selected.length>=2} onChange={()=>set(old=>old.includes(x)?old.filter(y=>y!==x):[...old,x])}/></label>)}<output>{selected.join(',')}</output></section>;}
