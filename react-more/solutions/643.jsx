// 643 Checklist selection cap / scenario 15 — cap 1; alphabetical output; initial D; locked none
// Checkboxes A–D; All are eligible. Initial selection D, cap 1. Disable unchecked boxes at cap; checked boxes remain removable. Output comma-separated selected labels in alphabetical order. Unchecking then rechecking appends to selection history for click order.
// Prompt: ../prompts/643.txt
// Run from unionboot: node react-more/verify.cjs --id=643 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [selected,set]=useState(["D"]);return <section>{['A','B','C','D'].map(x=><label key={x}>{x}<input type="checkbox" checked={selected.includes(x)} disabled={x===null||(!selected.includes(x)&&selected.length>=1)} onChange={()=>set(old=>x===null?old:old.includes(x)?old.filter(y=>y!==x):old.length>=1?old:[...old,x])}/></label>)}<output>{[...selected].sort().join(',')}</output></section>;
}
