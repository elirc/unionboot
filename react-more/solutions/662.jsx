// 662 Paged list controls / scenario 14 — size 1; start page 3; cyclic navigation; shrink permanently clamps
// List props.items with fixed page size 1, initial requested page 3. Clamp page to 1..max(1,ceil(length/size)), including on prop shrink; later growth must not resurrect an old out-of-range page. Output current page. Prev/Next wrap at ends and are disabled only when at most one page. First/Last jump to bounds and disable there. Empty shows page1 with no rows.
// Prompt: ../prompts/662.txt
// Run from unionboot: node react-more/verify.cjs --id=662 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';

export default function Exercise({items=[], rows=[], load=async()=>''}) {
const [page,set]=useState(3);const pages=Math.max(1,Math.ceil(items.length/1)),current=Math.min(page,pages);useEffect(()=>{set(p=>Math.min(p,pages));},[pages]);return <section><ul>{items.slice((current-1)*1,current*1).map((x,i)=><li key={i}>{x}</li>)}</ul><button disabled={current===1} onClick={()=>set(1)}>First</button><button disabled={pages===1} onClick={()=>set(current===1?pages:current-1)}>Prev</button><output>{current}</output><button disabled={pages===1} onClick={()=>set(current===pages?1:current+1)}>Next</button><button disabled={current===pages} onClick={()=>set(pages)}>Last</button></section>;
}
