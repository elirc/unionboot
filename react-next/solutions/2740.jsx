// 2740 Transition-backed route preview / scenario 2 — Boundary 2; urgent route replacement
// Render route content inside Suspense with fallback Loading route. Go navigates from home to next. Set route urgently: show fallback while waiting; Pending output remains no. resource.read(route) returns text or throws its pending promise. Use output Route inside the boundary; Home button returns home. Route result for this scenario is Route 2.
// Full prompt: ../prompts/2740.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
function RouteView({resource,route}){return <output aria-label="Route">{resource.read(route)}</output>;}
export default function Exercise({resource}) {
const [route,setRoute]=useState('home'),[pending,start]=useTransition();return <section><button onClick={()=>{setRoute('next');}} >Go</button><button onClick={()=>setRoute('home')}>Home</button><output aria-label="Pending">{pending?'yes':'no'}</output><Suspense fallback={<p>Loading route</p>}><RouteView resource={resource} route={route}/></Suspense></section>;
}
