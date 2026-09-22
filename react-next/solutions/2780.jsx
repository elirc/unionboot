// 2780 Portal event ownership / scenario 2 — Boundary 2; bubble through React parent
// Use createPortal from react-dom to place a Send button in injected host, never in the render root. Each Send adds 2 to Local. Parent React section onClick adds one to Parent for bubbled clicks. Portal clicks bubble through React ownership to parent despite separate DOM ancestry. Local/Parent outputs stay in root. Changing host moves the portal without resetting counters. Unmount removes portal DOM, not the host.
// Full prompt: ../prompts/2780.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({host}) {
const [local,setLocal]=useState(0),[parent,setParent]=useState(0);return <section onClick={()=>setParent(c=>c+1)}><output aria-label="Local">{local}</output><output aria-label="Parent">{parent}</output>{createPortal(<button onClick={e=>{setLocal(c=>c+2);}}>Send</button>,host)}</section>;
}
