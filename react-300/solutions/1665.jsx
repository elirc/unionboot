// 1665 Injected interval budget / scenario 7 — Tick 2, cap 11; auto-start
// Injected scheduler provides every(callback) returning cancel function. Start registers one repeating callback; start on mount. Each tick increases Count by 2, clamped to 11. At cap stop subscription automatically and display done in State. Start/Stop disabled appropriately. Stop pauses, Start resumes. Reset sets Count=0 and stops even auto-start variants. Clean up exact subscription on unmount; a callback retained by test after cancellation must not update state. No real timers.
// Full prompt: ../prompts/1665.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({scheduler}) {
const [count,setCount]=useState(0),[running,setRunning]=useState(true);const done=count>=11;useEffect(()=>{if(!running||done)return;let live=true;const cancel=scheduler.every(()=>{if(live)setCount(n=>Math.min(11,n+2));});return()=>{live=false;cancel();};},[scheduler,running,done]);return <section><output aria-label="Count">{count}</output><output aria-label="State">{done?'done':running?'running':'stopped'}</output><button disabled={running||done} onClick={()=>setRunning(true)}>Start</button><button disabled={!running||done} onClick={()=>setRunning(false)}>Stop</button><button onClick={()=>{setCount(0);setRunning(false);}}>Reset</button></section>;
}
