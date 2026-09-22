// 656 Paged list controls / scenario 8 — size 3; start page 3; bounded navigation; shrink permanently clamps
// List props.items with fixed page size 3, initial requested page 3. Clamp page to 1..max(1,ceil(length/size)), including on prop shrink; later growth must not resurrect an old out-of-range page. Output current page. Prev/Next stop and disable at their respective boundary. First/Last jump to bounds and disable there. Empty shows page1 with no rows.
// Prompt: ../prompts/656.txt
// Run from unionboot: node react-more/verify.cjs --id=656 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [page,set]=useState(3);const pages=Math.max(1,Math.ceil(items.length/3)),current=Math.min(page,pages);useEffect(()=>{set(p=>Math.min(p,pages));},[pages]);return <section><ul>{items.slice((current-1)*3,current*3).map((x,i)=><li key={i}>{x}</li>)}</ul><button disabled={current===1} onClick={()=>set(1)}>First</button><button disabled={current===1} onClick={()=>set(current-1)}>Prev</button><output>{current}</output><button disabled={current===pages} onClick={()=>set(current+1)}>Next</button><button disabled={current===pages} onClick={()=>set(pages)}>Last</button></section>;
}
