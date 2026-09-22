// 3291 Imperative editor handle / scenario 13 — Boundary 3; handle reads trimmed draft
// Child Editor owns Draft input, initially 3 x characters. Expose focus(),read(),clear() via useImperativeHandle and a ref. Parent Focus calls child handle, Snapshot stores read() in Saved, Clear editor calls clear() without changing Saved. read returns trimmed text. Parent must not own a duplicate draft state. Each mounted editor ref must reference the current draft, not the initial closure.
// Full prompt: ../prompts/3291.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
const Editor=forwardRef(function Editor(_,ref){const [text,set]=useState('xxx'),input=useRef(null);useImperativeHandle(ref,()=>({focus(){input.current.focus();},read(){return text.trim();},clear(){set('');}}),[text]);return <label>Draft<input ref={input} value={text} onChange={e=>set(e.target.value)}/></label>;});
export default function Exercise({}) {
const editor=useRef(null),[saved,set]=useState('');return <section><Editor ref={editor}/><button onClick={()=>editor.current.focus()}>Focus</button><button onClick={()=>set(editor.current.read())}>Snapshot</button><button onClick={()=>editor.current.clear()}>Clear editor</button><output aria-label="Saved">{saved}</output></section>;
}
