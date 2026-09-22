// 520 Bounded quantity editor / scenario 2
// Mixed integration variant: render with props.seed changing the component key in a parent to reset all local state; do not store state outside React. Start at 1, step 2, minimum0, maximum6. Buttons Add, Remove, Reset; clamp at bounds, disable Remove at0 and Add at maximum. Show quantity in output.
// Run: node mixed-react/verify.cjs --id=520 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [n,set]=useState(1);return <section><output>{n}</output><button disabled={n===6} onClick={()=>set(x=>Math.min(6,x+2))}>Add</button><button disabled={n===0} onClick={()=>set(x=>Math.max(0,x-2))}>Remove</button><button onClick={()=>set(1)}>Reset</button></section>;}
