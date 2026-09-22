// 2818 Reactive media query predicates / scenario 20 — Boundary 10; invert media match
// Call injected matchMedia with (min-width: 1000px). Read .matches immediately; subscribe using addEventListener('change', listener) and remove the same listener on cleanup. Output Mode wide when false, compact when true. Matcher replacement must reread and resubscribe. No browser global matcher.
// Full prompt: ../prompts/2818.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({matchMedia}) {
const [match,set]=useState(false);useEffect(()=>{const m=matchMedia("(min-width: 1000px)");let live=true;set(m.matches);const listener=e=>{if(live)set(e.matches);};m.addEventListener('change',listener);return()=>{live=false;m.removeEventListener('change',listener);};},[matchMedia]);return <output aria-label="Mode">{!match?'wide':'compact'}</output>;
}
