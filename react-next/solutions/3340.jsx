// 3340 Image fallback source ladder / scenario 2 — Boundary 2; source replacement retains fallback index
// Render img alt=Preview using first source. Each DOM error event advances to next source. When exhausted, remove image and show alert No image. Output Index is attempted index, starting 0. On new sources keep index; if it fits render that source, otherwise remain exhausted. DOM load event shows output Loaded yes; changing attempted source clears Loaded to no. Do not fetch images from tests.
// Full prompt: ../prompts/3340.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({sources=[]}) {
const [index,set]=useState(0),[loaded,setLoaded]=useState(false);useEffect(()=>setLoaded(false),[sources,index]);return <section>{index<sources.length?<img alt="Preview" src={sources[index]} onError={()=>{set(i=>i+1);setLoaded(false);}} onLoad={()=>setLoaded(true)}/>:<p role="alert">No image</p>}<output aria-label="Index">{index}</output><output aria-label="Loaded">{loaded?'yes':'no'}</output></section>;
}
