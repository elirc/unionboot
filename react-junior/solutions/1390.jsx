// 1390 Interval ticker / changing-step debugging variant [effects / debugging]
// An interval every 100ms increments count by props.step, captured fresh on each tick (fix the stale-closure bug by using functional updates or including step in deps). Mount starts paused; Start/Stop toggle running; outputs labelled Count and Step show count and current step. Unmount must stop the interval: assert by unmounting and advancing timers without errors and no further updates. Test uses fake timers.
// Run: node react-junior/verify.cjs --id=1390 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({step=1}){const [count,setCount]=useState(0),[running,setRunning]=useState(false);useEffect(()=>{if(!running)return;const id=setInterval(()=>setCount(c=>c+step),100);return()=>clearInterval(id);},[running,step]);
return <section><output aria-label="Count">{count}</output><output aria-label="Step">{step}</output><button onClick={()=>setRunning(r=>!r)}>{running?'Stop':'Start'}</button></section>;}
