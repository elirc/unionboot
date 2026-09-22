// 2843 Resize-derived packing layout / scenario 5 — Boundary 5; whole cells only
// Render data-testid=frame, observe it via injected observeResize(element,callback) returning cleanup. Entries contain contentRect.width. Each tile needs 100px. Output Columns is max(1,floor(width/100)), initially 1; ignore nonfinite or negative widths. Do not read actual jsdom layout. Show exactly Columns listitems labelled Slot 1 etc. Replacement observer and unmount clean up.
// Full prompt: ../prompts/2843.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({observeResize}) {
const [cols,set]=useState(1),ref=useRef(null);useEffect(()=>{let live=true;const off=observeResize(ref.current,e=>{const width=e.contentRect.width;if(live&&Number.isFinite(width)&&width>=0)set(Math.max(1,Math.floor(width/100)));});return()=>{live=false;off();};},[observeResize]);return <section ref={ref} data-testid="frame"><output aria-label="Columns">{cols}</output><ul>{Array.from({length:cols},(_,i)=><li key={i}>Slot {i+1}</li>)}</ul></section>;
}
