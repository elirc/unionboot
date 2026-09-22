// 3401 Scroll anchor prepend compensation / scenario 3 — Boundary 3; leave scroll position unchanged
// Render viewport data-testid=viewport with initial five rows R1..R5. Every Prepend adds 3 distinct new rows at top, each fixed 10px: first batch N1..N3, next N4..N6, preserving existing row identities and DOM nodes. Do not adjust scrollTop after prepend. Output Rows count. Prepend may be used repeatedly; compensation must occur exactly once per prepend and not on unrelated render. Toggle marker only changes Marker yes/no, never scroll position. Tests inject scrollTop; no actual layout measurements.
// Full prompt: ../prompts/3401.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
const [rows,set]=useState(['R1','R2','R3','R4','R5']),[marker,toggle]=useState(false),viewport=useRef(null),delta=useRef(0),serial=useRef(0);const count=rows.length;useLayoutEffect(()=>{delta.current=0;},[count]);return <section><div data-testid="viewport" ref={viewport}><ul>{rows.map(id=><li key={id} style={{height:10}}>{id}</li>)}</ul></div><button onClick={()=>{delta.current+=30;const batch=Array.from({length:3},()=> 'N'+(++serial.current));set(xs=>[...batch,...xs]);}}>Prepend</button><button onClick={()=>toggle(x=>!x)}>Toggle marker</button><output aria-label="Marker">{marker?'yes':'no'}</output><output aria-label="Rows">{count}</output></section>;
}
