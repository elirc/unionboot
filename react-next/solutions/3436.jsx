// 3436 Selection-aware text formatting / scenario 18 — Boundary 8; wrap selected text in brackets
// Text textarea starts aaaaaaaabc. Format operates on current DOM selection. Wrap nonempty selected text in [brackets]. Empty selection leaves text unchanged and shows alert Select text. On success clear alert and restore selection around transformed text via layout effect; do not select surrounding text. Output Text mirrors draft. Plain typing is unmodified. This is selection/caret management, not clipboard access.
// Full prompt: ../prompts/3436.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
const [text,set]=useState('aaaaaaaabc'),[error,fail]=useState(false),input=useRef(null),selection=useRef(null);useLayoutEffect(()=>{if(selection.current){input.current.focus();input.current.setSelectionRange(...selection.current);selection.current=null;}},[text]);return <section><label>Text<textarea ref={input} value={text} onChange={e=>set(e.target.value)}/></label><button onClick={()=>{const {selectionStart:a,selectionEnd:b}=input.current;if(a===b){fail(true);return;}const value='['+text.slice(a,b)+']';selection.current=[a,a+value.length];fail(false);set(text.slice(0,a)+value+text.slice(b));}}>Format</button><output aria-label="Text">{text}</output>{error&&<p role="alert">Select text</p>}</section>;
}
