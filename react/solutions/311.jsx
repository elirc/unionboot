// 311 Checklist selection cap / scenario 3
// Render four checkboxes A–D. Allow at most 3 selections. Disable unchecked boxes when cap reached but keep selected boxes enabled. Output comma-separated selected labels in click order.
// Run: node react/verify.cjs --id=311 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [selected,set]=useState([]);return <section>{['A','B','C','D'].map(x=><label key={x}>{x}<input type="checkbox" checked={selected.includes(x)} disabled={!selected.includes(x)&&selected.length>=3} onChange={()=>set(old=>old.includes(x)?old.filter(y=>y!==x):[...old,x])}/></label>)}<output>{selected.join(',')}</output></section>;}
