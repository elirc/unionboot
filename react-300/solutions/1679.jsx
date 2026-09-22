// 1679 External subscription projection / scenario 1 — latest projection; always subscribed
// Injected source.subscribe(listener) returns unsubscribe. Messages are finite numbers. Output Value initially none. Show latest message. Always subscribe while mounted. Reset clears accumulated value but not subscription. Source prop replacement unsubscribes old and subscribes new, preserving value. Ignore callbacks retained after unsubscribe/unmount.
// Full prompt: ../prompts/1679.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({source}) {
const [values,setValues]=useState([]),[active,setActive]=useState(true);useEffect(()=>{if(!active)return;let live=true;const off=source.subscribe(value=>{if(live)setValues(xs=>[...xs,value]);});return()=>{live=false;off();};},[source,active]);const value=values.length?values.at(-1):'none';return <section><output aria-label="Value">{value}</output><button onClick={()=>setValues([])}>Reset</button></section>;
}
