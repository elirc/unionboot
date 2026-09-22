// 522 Bounded quantity editor / scenario 4
// Mixed integration variant: render with props.seed changing the component key in a parent to reset all local state; do not store state outside React. Start at 3, step 4, minimum0, maximum8. Buttons Add, Remove, Reset; clamp at bounds, disable Remove at0 and Add at maximum. Show quantity in output.
// Run: node mixed-react/verify.cjs --id=522 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [n,set]=useState(3);return <section><output>{n}</output><button disabled={n===8} onClick={()=>set(x=>Math.min(8,x+4))}>Add</button><button disabled={n===0} onClick={()=>set(x=>Math.max(0,x-4))}>Remove</button><button onClick={()=>set(3)}>Reset</button></section>;}
