// 3203 URL query writeback / scenario 5 — Boundary 5; push history entry
// Read injected history.read() query string; Query field uses parameter q, default empty. Editing writes q using URLSearchParams, preserves unrelated parameters, deletes q when empty, and calls history.push(search) with leading ? (or empty if no parameters). Subscribe to pop notifications and reread without writing back. Initial query is seed5. Cleanup subscription.
// Full prompt: ../prompts/3203.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({history}) {
const read=()=>new URLSearchParams(history.read()).get('q')||'';const [q,set]=useState(read);useEffect(()=>{let live=true;const off=history.subscribe(()=>{if(live)set(read());});return()=>{live=false;off();};},[history]);return <label>Query<input value={q} onChange={e=>{const value=e.target.value;set(value);const p=new URLSearchParams(history.read());if(value)p.set('q',value);else p.delete('q');const s=p.toString();history.push(s?'?'+s:'');}}/></label>;
}
