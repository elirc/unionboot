// 1704 Range selection anchor / scenario 6 — Shift range replaces; skip locked C; 1-based initial anchor
// Buttons Pick A..E, aria-pressed indicates selection. Initial selection empty, anchor A. Normal click toggles item and sets anchor. Shift-click selects inclusive range from anchor to clicked item, replace previous picks, does not move anchor. C is disabled and ranges skip it. Selection output sorted A..E joined comma. Clear clears picks and restores initial anchor; Anchor output.
// Full prompt: ../prompts/1704.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
const names=['A','B','C','D','E'];const [ids,set]=useState([]),[anchor,setAnchor]=useState(0);function pick(i,shift){if(names[i]==="C")return;if(shift){const range=names.slice(Math.min(i,anchor),Math.max(i,anchor)+1).filter(x=>x!=="C");set(old=>range);}else{set(old=>old.includes(names[i])?old.filter(x=>x!==names[i]):[...old,names[i]]);setAnchor(i);}}return <section>{names.map((x,i)=><button key={x} disabled={x==="C"} aria-pressed={ids.includes(x)} onClick={e=>pick(i,e.shiftKey)}>Pick {x}</button>)}<output aria-label="Selection">{[...ids].sort().join(',')}</output><output aria-label="Anchor">{names[anchor]}</output><button onClick={()=>{set([]);setAnchor(0);}}>Clear</button></section>;
}
