// 638 Checklist selection cap / scenario 10 — cap 2; click output; initial empty; locked B
// Checkboxes A–D; B is permanently disabled and unchecked. Initial selection empty, cap 2. Disable unchecked boxes at cap; checked boxes remain removable. Output comma-separated selected labels in click order. Unchecking then rechecking appends to selection history for click order.
// Prompt: ../prompts/638.txt
// Run from unionboot: node react-more/verify.cjs --id=638 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [selected,set]=useState([]);return <section>{['A','B','C','D'].map(x=><label key={x}>{x}<input type="checkbox" checked={selected.includes(x)} disabled={x==="B"||(!selected.includes(x)&&selected.length>=2)} onChange={()=>set(old=>x==="B"?old:old.includes(x)?old.filter(y=>y!==x):old.length>=2?old:[...old,x])}/></label>)}<output>{selected.join(',')}</output></section>;
}
