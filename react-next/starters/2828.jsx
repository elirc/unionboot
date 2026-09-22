// 2828 Intersection exposure latch / scenario 10 — Boundary 10; track current exposure
// Render a div data-testid=target and output Exposure initially hidden. In an effect call injected observe(element,1,callback); it returns disconnect. Callback entries {isIntersecting,intersectionRatio} qualify only when intersecting AND ratio>=1. Track visible/hidden after each entry, retaining subscription. Ignore retained callbacks after disconnect or unmount.
// Full prompt: ../prompts/2828.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({observe}) {
  // TODO: independently implement the prompt.
  return null;
}
