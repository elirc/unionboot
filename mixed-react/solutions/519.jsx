// 519 Bounded quantity editor / scenario 1
// Mixed integration variant: render with props.seed changing the component key in a parent to reset all local state; do not store state outside React. Start at 0, step 1, minimum0, maximum5. Buttons Add, Remove, Reset; clamp at bounds, disable Remove at0 and Add at maximum. Show quantity in output.
// Run: node mixed-react/verify.cjs --id=519 [--starters]
import React,{useState,useEffect,useReducer,useRef} from 'react';

export default function Exercise({items=[],rows=[],load=async()=>'',seed=0}){const [n,set]=useState(0);return <section><output>{n}</output><button disabled={n===5} onClick={()=>set(x=>Math.min(5,x+1))}>Add</button><button disabled={n===0} onClick={()=>set(x=>Math.max(0,x-1))}>Remove</button><button onClick={()=>set(0)}>Reset</button></section>;}
