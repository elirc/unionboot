// 641 Checklist selection cap / scenario 13 — cap 2; alphabetical output; initial D; locked none
// Checkboxes A–D; All are eligible. Initial selection D, cap 2. Disable unchecked boxes at cap; checked boxes remain removable. Output comma-separated selected labels in alphabetical order. Unchecking then rechecking appends to selection history for click order.
// Prompt: ../prompts/641.txt
// Run from unionboot: node react-more/verify.cjs --id=641 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [selected,set]=useState(["D"]);return <section>{['A','B','C','D'].map(x=><label key={x}>{x}<input type="checkbox" checked={selected.includes(x)} disabled={x===null||(!selected.includes(x)&&selected.length>=2)} onChange={()=>set(old=>x===null?old:old.includes(x)?old.filter(y=>y!==x):old.length>=2?old:[...old,x])}/></label>)}<output>{[...selected].sort().join(',')}</output></section>;
}
