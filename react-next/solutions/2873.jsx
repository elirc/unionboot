// 2873 IME-safe command submission / scenario 15 — Boundary 5; commit at composition end
// Controlled Command field. During compositionStart..compositionEnd never commit on Enter; guard native isComposing too. Commit requires trimmed text length>=5, updates Saved and increments Commits. compositionEnd commits its final event target value once if valid; later Enter is a separate commit. Plain changes do not commit. Do not count intermediate IME strings.
// Full prompt: ../prompts/2873.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
const [text,set]=useState(''),[saved,save]=useState(''),[count,setCount]=useState(0),composing=useRef(false);function commit(raw){const x=raw.trim();if(x.length>=5){save(x);setCount(c=>c+1);}}return <section><label>Command<input value={text} onChange={e=>set(e.target.value)} onCompositionStart={()=>{composing.current=true;}} onCompositionEnd={e=>{composing.current=false;set(e.currentTarget.value);commit(e.currentTarget.value);}} onKeyDown={e=>{if(e.key==='Enter'&&!composing.current&&!e.nativeEvent.isComposing){e.preventDefault();commit(e.currentTarget.value);}}}/></label><output aria-label="Saved">{saved}</output><output aria-label="Commits">{count}</output></section>;
}
