// 710 Select all checklist / scenario 12 — 5 items; eligible 1,3,4,5; initial 1; all ignores locked items
// Render All and Item1..Item5 checkboxes. Only items 1,3,4,5 are eligible; others disabled and always unchecked. Initial selection 1. All selects/deselects only eligible items; it is disabled if none exist, checked only if eligible set is nonempty and fully selected, indeterminate for partial eligible selection. Output selected item numbers sorted ascending joined by comma. Clear clears selection.
// Prompt: ../prompts/710.txt
// Run from unionboot: node react-more/verify.cjs --id=710 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const eligible=[1,3,4,5];const [selected,set]=useState([1]);const all=useRef(null);const checked=eligible.length>0&&selected.length===eligible.length;useEffect(()=>{all.current.indeterminate=selected.length>0&&!checked;},[selected,checked]);return <section><label>All<input ref={all} type="checkbox" checked={checked} disabled={!eligible.length} onChange={()=>set(checked?[]:eligible)}/></label>{Array.from({length:5},(_,i)=>i+1).map(i=><label key={i}>Item{i}<input type="checkbox" checked={selected.includes(i)} disabled={!eligible.includes(i)} onChange={()=>set(old=>!eligible.includes(i)?old:old.includes(i)?old.filter(x=>x!==i):[...old,i])}/></label>)}<button onClick={()=>set([])}>Clear</button><output>{[...selected].sort((a,b)=>a-b).join(',')}</output></section>;
}
