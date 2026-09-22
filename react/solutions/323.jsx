// 323 Paged list controls / scenario 5
// Render props.items with page size 5; page starts1. Prev/Next disabled at boundaries, page output. Empty input shows page1 and no rows.
// Run: node react/verify.cjs --id=323 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [page,set]=useState(1);const pages=Math.max(1,Math.ceil(items.length/5));const current=Math.min(page,pages);return <section><ul>{items.slice((current-1)*5,current*5).map((x,i)=><li key={i}>{x}</li>)}</ul><button disabled={current===1} onClick={()=>set(current-1)}>Prev</button><output>{current}</output><button disabled={current===pages} onClick={()=>set(current+1)}>Next</button></section>;}
