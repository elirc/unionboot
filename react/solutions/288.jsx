// 288 Bounded quantity editor / scenario 5
// Start at 4, step 5, minimum0, maximum9. Buttons Add, Remove, Reset; clamp at bounds, disable Remove at0 and Add at maximum. Show quantity in output.
// Run: node react/verify.cjs --id=288 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [n,set]=useState(4);return <section><output>{n}</output><button disabled={n===9} onClick={()=>set(x=>Math.min(9,x+5))}>Add</button><button disabled={n===0} onClick={()=>set(x=>Math.max(0,x-5))}>Remove</button><button onClick={()=>set(4)}>Reset</button></section>;}
