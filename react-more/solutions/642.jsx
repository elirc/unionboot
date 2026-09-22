// 642 Checklist selection cap / scenario 14 — cap 3; click output; initial D; locked B
// Checkboxes A–D; B is permanently disabled and unchecked. Initial selection D, cap 3. Disable unchecked boxes at cap; checked boxes remain removable. Output comma-separated selected labels in click order. Unchecking then rechecking appends to selection history for click order.
// Prompt: ../prompts/642.txt
// Run from unionboot: node react-more/verify.cjs --id=642 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [selected,set]=useState(["D"]);return <section>{['A','B','C','D'].map(x=><label key={x}>{x}<input type="checkbox" checked={selected.includes(x)} disabled={x==="B"||(!selected.includes(x)&&selected.length>=3)} onChange={()=>set(old=>x==="B"?old:old.includes(x)?old.filter(y=>y!==x):old.length>=3?old:[...old,x])}/></label>)}<output>{selected.join(',')}</output></section>;
}
