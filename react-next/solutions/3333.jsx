// 3333 Context menu anchor geometry / scenario 15 — Boundary 5; clamp menu inside viewport
// Contextmenu event on Target opens role=menu labelled Context. Prevent native menu. Menu size 25px square; use event clientX/clientY. Clamp left/top to [0,viewport dimension-menu size]. Position output left,top or closed. Render inline style left/top/width/height in px; width and height must both be 25, even for unbounded positioning. Escape on menu closes; another contextmenu repositions. No focus navigation or action items required: this is positioning/event behavior.
// Full prompt: ../prompts/3333.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({viewport={width:200,height:100}}) {
const [point,set]=useState(null);return <section><div data-testid="target" onContextMenu={e=>{e.preventDefault();set({x:Math.max(0,Math.min(viewport.width-25,e.clientX)),y:Math.max(0,Math.min(viewport.height-25,e.clientY))});}}>Target</div>{point&&<div role="menu" aria-label="Context" tabIndex={-1} style={{position:'absolute',left:point.x,top:point.y,width:25,height:25}} onKeyDown={e=>{if(e.key==='Escape')set(null);}}>Context actions</div>}<output aria-label="Position">{point?point.x+','+point.y:'closed'}</output></section>;
}
