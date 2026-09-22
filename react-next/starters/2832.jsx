// 2832 Intersection exposure latch / scenario 14 — Boundary 4; latch first qualifying exposure
// Render a div data-testid=target and output Exposure initially hidden. In an effect call injected observe(element,0.4,callback); it returns disconnect. Callback entries {isIntersecting,intersectionRatio} qualify only when intersecting AND ratio>=0.4. Latch visible forever after first qualifying entry and disconnect immediately. Ignore retained callbacks after disconnect or unmount.
// Full prompt: ../prompts/2832.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({observe}) {
  // TODO: independently implement the prompt.
  return null;
}
