// 2867 IME-safe command submission / scenario 9 — Boundary 9; commit only on noncomposing Enter
// Controlled Command field. During compositionStart..compositionEnd never commit on Enter; guard native isComposing too. Commit requires trimmed text length>=9, updates Saved and increments Commits. compositionEnd updates draft only, then Enter commits. Plain changes do not commit. Do not count intermediate IME strings.
// Full prompt: ../prompts/2867.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
const [text,set]=useState(''),[saved,save]=useState(''),[count,setCount]=useState(0),composing=useRef(false);function commit(raw){const x=raw.trim();if(x.length>=9){save(x);setCount(c=>c+1);}}return <section><label>Command<input value={text} onChange={e=>set(e.target.value)} onCompositionStart={()=>{composing.current=true;}} onCompositionEnd={e=>{composing.current=false;set(e.currentTarget.value);}} onKeyDown={e=>{if(e.key==='Enter'&&!composing.current&&!e.nativeEvent.isComposing){e.preventDefault();commit(e.currentTarget.value);}}}/></label><output aria-label="Saved">{saved}</output><output aria-label="Commits">{count}</output></section>;
}
