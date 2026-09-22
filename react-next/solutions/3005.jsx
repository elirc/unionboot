// 3005 Virtual window slicing / scenario 7 — Boundary 7; visible rows only
// Render data-testid=viewport; fixed row height 10px, visible capacity 8. onScroll derives first visible index floor(max(0,scrollTop)/10), clamped so a full final window remains (or zero for short lists). Render only slice [first-0,first+8+0), clipped to data. Outputs Start (zero-based rendered start), End (exclusive), Offset (start*10). Each listitem must have aria-posinset originalIndex+1 and aria-setsize full length. Prop shrink clamps immediately. This exercise tests virtualization math, not actual jsdom scrolling/layout.
// Full prompt: ../prompts/3005.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({items=[]}) {
const [top,setTop]=useState(0);const first=Math.min(Math.max(0,Math.floor(top/10)),Math.max(0,items.length-8)),start=Math.max(0,first-0),end=Math.min(items.length,first+8);return <section><div data-testid="viewport" onScroll={e=>setTop(Math.max(0,e.currentTarget.scrollTop))}><ul>{items.slice(start,end).map((x,i)=><li key={start+i} aria-posinset={start+i+1} aria-setsize={items.length}>{x}</li>)}</ul></div><output aria-label="Start">{start}</output><output aria-label="End">{end}</output><output aria-label="Offset">{start*10}</output></section>;
}
