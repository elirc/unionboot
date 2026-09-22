// 2748 Transition-backed route preview / scenario 10 — Boundary 10; urgent route replacement
// Render route content inside Suspense with fallback Loading route. Go navigates from home to next. Set route urgently: show fallback while waiting; Pending output remains no. resource.read(route) returns text or throws its pending promise. Use output Route inside the boundary; Home button returns home. Route result for this scenario is Route 10.
// Full prompt: ../prompts/2748.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
function RouteView({resource,route}){return <output aria-label="Route">{resource.read(route)}</output>;}
export default function Exercise({resource}) {
const [route,setRoute]=useState('home'),[pending,start]=useTransition();return <section><button onClick={()=>{setRoute('next');}} >Go</button><button onClick={()=>setRoute('home')}>Home</button><output aria-label="Pending">{pending?'yes':'no'}</output><Suspense fallback={<p>Loading route</p>}><RouteView resource={resource} route={route}/></Suspense></section>;
}
