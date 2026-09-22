// 1526 Ranked list reordering / scenario 8 — Bounded moves; all movable; 10 rows
// Initial list A,B,C,D,E,F,G,H,I,J. Up NAME and Down NAME swap the item with its neighbor, stopping at ends.  Disable impossible buttons; guard updates. Ordered listitem text is NAME with move buttons; use span for NAME. Reset restores original ordering. Output Order joins names with >.
// Full prompt: ../prompts/1526.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
const initial=["A","B","C","D","E","F","G","H","I","J"];const [rows,set]=useState(initial);const target=(i,d)=>i+d;const allowed=(i,d)=>{const j=target(i,d);return j>=0&&j<rows.length&&rows[i]!==null&&rows[j]!==null;};const move=(i,d)=>{if(!allowed(i,d))return;const j=target(i,d);set(old=>{const n=[...old];[n[i],n[j]]=[n[j],n[i]];return n;});};return <section><ol>{rows.map((x,i)=><li key={x}><span>{x}</span>{[-1,1].map(d=><button key={d} aria-label={(d<0?'Up ':'Down ')+x} disabled={!allowed(i,d)} onClick={()=>move(i,d)}>{d<0?'Up':'Down'}</button>)}</li>)}</ol><output aria-label="Order">{rows.join('>')}</output><button onClick={()=>set(initial)}>Reset</button></section>;
}
