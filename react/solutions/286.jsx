// 286 Bounded quantity editor / scenario 3
// Start at 2, step 3, minimum0, maximum7. Buttons Add, Remove, Reset; clamp at bounds, disable Remove at0 and Add at maximum. Show quantity in output.
// Run: node react/verify.cjs --id=286 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [n,set]=useState(2);return <section><output>{n}</output><button disabled={n===7} onClick={()=>set(x=>Math.min(7,x+3))}>Add</button><button disabled={n===0} onClick={()=>set(x=>Math.max(0,x-3))}>Remove</button><button onClick={()=>set(2)}>Reset</button></section>;}
