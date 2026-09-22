// 2752 Transition-backed route preview / scenario 14 — Boundary 4; retain old route during transition
// Render route content inside Suspense with fallback Loading route. Go navigates from home to next. Wrap route state change in useTransition startTransition: keep Home visible until the injected resource settles; Pending output yes during wait. resource.read(route) returns text or throws its pending promise. Use output Route inside the boundary; Home button returns home. Route result for this scenario is Route 4.
// Full prompt: ../prompts/2752.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
function RouteView({resource,route}){return <output aria-label="Route">{resource.read(route)}</output>;}
export default function Exercise({resource}) {
const [route,setRoute]=useState('home'),[pending,start]=useTransition();return <section><button onClick={()=>{start(()=>setRoute('next'));}} >Go</button><button onClick={()=>setRoute('home')}>Home</button><output aria-label="Pending">{pending?'yes':'no'}</output><Suspense fallback={<p>Loading route</p>}><RouteView resource={resource} route={route}/></Suspense></section>;
}
