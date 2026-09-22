// 2824 Intersection exposure latch / scenario 6 — Boundary 6; track current exposure
// Render a div data-testid=target and output Exposure initially hidden. In an effect call injected observe(element,0.6,callback); it returns disconnect. Callback entries {isIntersecting,intersectionRatio} qualify only when intersecting AND ratio>=0.6. Track visible/hidden after each entry, retaining subscription. Ignore retained callbacks after disconnect or unmount.
// Full prompt: ../prompts/2824.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({observe}) {
const [visible,set]=useState(false),target=useRef(null);useEffect(()=>{let live=true;const off=observe(target.current,0.6,entry=>{if(!live)return;const yes=entry.isIntersecting&&entry.intersectionRatio>=0.6;set(yes);});return()=>{live=false;off();};},[observe]);return <section><div ref={target} data-testid="target">Watch me</div><output aria-label="Exposure">{visible?'visible':'hidden'}</output></section>;
}
