// 2856 Resize-derived packing layout / scenario 18 — Boundary 8; allow partial final cell
// Render data-testid=frame, observe it via injected observeResize(element,callback) returning cleanup. Entries contain contentRect.width. Each tile needs 160px. Output Columns is max(1,ceil(width/160)), initially 1; ignore nonfinite or negative widths. Do not read actual jsdom layout. Show exactly Columns listitems labelled Slot 1 etc. Replacement observer and unmount clean up.
// Full prompt: ../prompts/2856.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({observeResize}) {
const [cols,set]=useState(1),ref=useRef(null);useEffect(()=>{let live=true;const off=observeResize(ref.current,e=>{const width=e.contentRect.width;if(live&&Number.isFinite(width)&&width>=0)set(Math.max(1,Math.ceil(width/160)));});return()=>{live=false;off();};},[observeResize]);return <section ref={ref} data-testid="frame"><output aria-label="Columns">{cols}</output><ul>{Array.from({length:cols},(_,i)=><li key={i}>Slot {i+1}</li>)}</ul></section>;
}
