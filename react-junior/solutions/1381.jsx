// 1381 Validate a date interval [forms]
// Start and End are date inputs initially empty. Reserve is enabled only when both have a date and End >= Start (same day allowed). If both provided but reversed, show role alert End must not precede start. Submission outputs START to END using ISO input values. Invalid edits must leave the last reservation unchanged. Do not use timezone conversion.
// Run: node react-junior/verify.cjs --id=1381 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){const [start,setStart]=useState(''),[end,setEnd]=useState(''),[saved,setSaved]=useState('');const reversed=!!start&&!!end&&end<start,valid=!!start&&!!end&&!reversed;
return <form onSubmit={e=>{e.preventDefault();if(valid)setSaved(start+' to '+end);}}><label>Start<input type="date" value={start} onChange={e=>setStart(e.target.value)}/></label><label>End<input type="date" value={end} onChange={e=>setEnd(e.target.value)}/></label>{reversed&&<p role="alert">End must not precede start</p>}<button disabled={!valid}>Reserve</button><output>{saved}</output></form>;}
