// 2795 Portal event ownership / scenario 17 — Boundary 7; stop React bubbling at portal child
// Use createPortal from react-dom to place a Send button in injected host, never in the render root. Each Send adds 7 to Local. Parent React section onClick adds one to Parent for bubbled clicks. Send stops propagation, so Parent stays unchanged. Local/Parent outputs stay in root. Changing host moves the portal without resetting counters. Unmount removes portal DOM, not the host.
// Full prompt: ../prompts/2795.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({host}) {
const [local,setLocal]=useState(0),[parent,setParent]=useState(0);return <section onClick={()=>setParent(c=>c+1)}><output aria-label="Local">{local}</output><output aria-label="Parent">{parent}</output>{createPortal(<button onClick={e=>{e.stopPropagation();setLocal(c=>c+7);}}>Send</button>,host)}</section>;
}
