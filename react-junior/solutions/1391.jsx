// 1391 Debounced search indicator [effects]
// Query input updates output immediately with echo. While waiting, output is the query followed by an ellipsis (…). After 300ms without edits, remove the ellipsis. Initial empty query is settled. Clearing a nonempty query also waits 300ms. Use setTimeout inside useEffect keyed on the query with proper cleanup. Test uses fake timers to advance time.
// Run: node react-junior/verify.cjs --id=1391 [--starters]
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useContext,createContext} from 'react';
export default function Exercise({}){const [text,setText]=useState(''),[settled,setSettled]=useState(true);const mounted=useRef(false);useEffect(()=>{if(!mounted.current){mounted.current=true;return;}setSettled(false);const id=setTimeout(()=>setSettled(true),300);return()=>clearTimeout(id);},[text]);
return <section><label>Query<input value={text} onChange={e=>setText(e.target.value)}/></label><output>{text}{settled?'':'…'}</output></section>;}
