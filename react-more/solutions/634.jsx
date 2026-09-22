// 634 Checklist selection cap / scenario 6 — cap 1; click output; initial empty; locked B
// Checkboxes A–D; B is permanently disabled and unchecked. Initial selection empty, cap 1. Disable unchecked boxes at cap; checked boxes remain removable. Output comma-separated selected labels in click order. Unchecking then rechecking appends to selection history for click order.
// Prompt: ../prompts/634.txt
// Run from unionboot: node react-more/verify.cjs --id=634 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [selected,set]=useState([]);return <section>{['A','B','C','D'].map(x=><label key={x}>{x}<input type="checkbox" checked={selected.includes(x)} disabled={x==="B"||(!selected.includes(x)&&selected.length>=1)} onChange={()=>set(old=>x==="B"?old:old.includes(x)?old.filter(y=>y!==x):old.length>=1?old:[...old,x])}/></label>)}<output>{selected.join(',')}</output></section>;
}
