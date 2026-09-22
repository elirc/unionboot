// 1685 External subscription projection / scenario 7 — sum projection; pause/resume supported
// Injected source.subscribe(listener) returns unsubscribe. Messages are finite numbers. Output Value initially 0. Sum messages. Pause unsubscribes and ignores messages; Resume resubscribes preserving accumulated value. Reset clears accumulated value but not subscription. Source prop replacement unsubscribes old and subscribes new, preserving value. Ignore callbacks retained after unsubscribe/unmount.
// Full prompt: ../prompts/1685.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({source}) {
const [values,setValues]=useState([]),[active,setActive]=useState(true);useEffect(()=>{if(!active)return;let live=true;const off=source.subscribe(value=>{if(live)setValues(xs=>[...xs,value]);});return()=>{live=false;off();};},[source,active]);const value=values.reduce((n,x)=>n+x,0);return <section><output aria-label="Value">{value}</output><button onClick={()=>setActive(x=>!x)}>{active?'Pause':'Resume'}</button><button onClick={()=>setValues([])}>Reset</button></section>;
}
