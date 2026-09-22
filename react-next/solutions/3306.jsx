// 3306 Paste replacement transaction / scenario 8 — Boundary 8; preserve pasted case
// Draft textarea starts abcdef. Intercept paste using clipboardData.getData('text/plain'), remove CR/LF, preserve case, truncate PASTED text to 8 characters, and replace current selection (selectionStart..selectionEnd), leaving unselected text untouched. Prevent default and restore caret just after inserted text using a layout effect. Changes by ordinary typing stay untouched. Output Text echoes full draft.
// Full prompt: ../prompts/3306.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
const [text,set]=useState('abcdef'),input=useRef(null),caret=useRef(null);useLayoutEffect(()=>{if(caret.current!==null){input.current.setSelectionRange(caret.current,caret.current);caret.current=null;}},[text]);return <section><label>Draft<textarea ref={input} value={text} onChange={e=>set(e.target.value)} onPaste={e=>{e.preventDefault();const node=e.currentTarget,start=node.selectionStart,end=node.selectionEnd;const value=e.clipboardData.getData('text/plain').replace(/[\r\n]/g,'').slice(0,8);caret.current=start+value.length;set(text.slice(0,start)+value+text.slice(end));}}/></label><output aria-label="Text">{text}</output></section>;
}
