// 583 Select all checklist / scenario 5
// Mixed integration variant: render with props.seed changing the component key in a parent to reset all local state; do not store state outside React. Render 6 item checkboxes labelled Item1..N, plus All. All selects/deselects every item. All checkbox indeterminate when partially selected, checked only when all selected.
// Run: node mixed-react/verify.cjs --id=583 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [selected,set]=useState([]);const allRef=useRef(null);const count=6;useEffect(()=>{allRef.current.indeterminate=selected.length>0&&selected.length<count;},[selected,count]);return <section><label>All<input ref={allRef} type="checkbox" checked={selected.length===count} onChange={()=>set(selected.length===count?[]:Array.from({length:count},(_,i)=>i))}/></label>{Array.from({length:count},(_,i)=><label key={i}>Item{i+1}<input type="checkbox" checked={selected.includes(i)} onChange={()=>set(old=>old.includes(i)?old.filter(x=>x!==i):[...old,i])}/></label>)}</section>;}
