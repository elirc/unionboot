// 3263 Deferred resource display / scenario 5 — Boundary 5; urgent suspended preview
// Controlled Text input updates immediately. Preview reads injected resource.read(text), which may throw a promise, inside Suspense fallback Waiting. Pass current text directly: preview suspends urgently; Stale output always no. Preview output echoes resource result. Resource for target5 is pending in tests. This is render-priority behavior, not debounce: no timer or request effect.
// Full prompt: ../prompts/3263.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
function Preview({resource,text}){return <output aria-label="Preview">{resource.read(text)}</output>;}
export default function Exercise({resource}) {
const [text,set]=useState('');const preview=text;return <section><label>Text<input value={text} onChange={e=>set(e.target.value)}/></label><output aria-label="Stale">{text!==preview?'yes':'no'}</output><Suspense fallback={<p>Waiting</p>}><Preview resource={resource} text={preview}/></Suspense></section>;
}
