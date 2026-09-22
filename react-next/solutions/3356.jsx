// 3356 Image fallback source ladder / scenario 18 — Boundary 8; source replacement resets fallback index
// Render img alt=Preview using first source. Each DOM error event advances to next source. When exhausted, remove image and show alert No image. Output Index is attempted index, starting 0. When sources prop identity changes, reset index to 0. DOM load event shows output Loaded yes; changing attempted source clears Loaded to no. Do not fetch images from tests.
// Full prompt: ../prompts/3356.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({sources=[]}) {
const [index,set]=useState(0),[loaded,setLoaded]=useState(false);useEffect(()=>{set(0);setLoaded(false);},[sources]);useEffect(()=>setLoaded(false),[sources,index]);return <section>{index<sources.length?<img alt="Preview" src={sources[index]} onError={()=>{set(i=>i+1);setLoaded(false);}} onLoad={()=>setLoaded(true)}/>:<p role="alert">No image</p>}<output aria-label="Index">{index}</output><output aria-label="Loaded">{loaded?'yes':'no'}</output></section>;
}
