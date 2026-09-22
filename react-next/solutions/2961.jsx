// 2961 Fixed-window event throttle / scenario 3 — Boundary 3; leading delivery only
// A renderless throttling effect subscribes source. First event in an idle window delivers immediately through onDeliver(value) and Delivered output. Suppress additional events for 75ms using scheduler.after, without restarting window. Drop suppressed values; become idle when window ends. Count counts deliveries. Clean up subscription and timer; retained canceled callbacks do nothing. This is fixed-window throttling, not quiet-period debouncing.
// Full prompt: ../prompts/2961.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({source,scheduler,onDeliver}) {
const [last,set]=useState(''),[count,setCount]=useState(0);useEffect(()=>{let live=true,busy=false,queued=null,cancel=null;const deliver=x=>{set(x);setCount(c=>c+1);onDeliver(x);};const off=source.subscribe(x=>{if(!live)return;if(busy){queued=x;return;}busy=true;deliver(x);cancel=scheduler.after(75,()=>{if(!live)return;queued=null;busy=false;});});return()=>{live=false;off();cancel?.();};},[source,scheduler,onDeliver]);return <section><output aria-label="Delivered">{last}</output><output aria-label="Count">{count}</output></section>;
}
