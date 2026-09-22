// 3327 Context menu anchor geometry / scenario 9 — Boundary 9; preserve requested coordinates
// Contextmenu event on Target opens role=menu labelled Context. Prevent native menu. Menu size 45px square; use event clientX/clientY. Use event coordinates unchanged, even beyond viewport. Position output left,top or closed. Render inline style left/top/width/height in px; width and height must both be 45, even for unbounded positioning. Escape on menu closes; another contextmenu repositions. No focus navigation or action items required: this is positioning/event behavior.
// Full prompt: ../prompts/3327.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({viewport={width:200,height:100}}) {
const [point,set]=useState(null);return <section><div data-testid="target" onContextMenu={e=>{e.preventDefault();set({x:e.clientX,y:e.clientY});}}>Target</div>{point&&<div role="menu" aria-label="Context" tabIndex={-1} style={{position:'absolute',left:point.x,top:point.y,width:45,height:45}} onKeyDown={e=>{if(e.key==='Escape')set(null);}}>Context actions</div>}<output aria-label="Position">{point?point.x+','+point.y:'closed'}</output></section>;
}
