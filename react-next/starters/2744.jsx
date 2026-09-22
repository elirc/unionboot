// 2744 Transition-backed route preview / scenario 6 — Boundary 6; urgent route replacement
// Render route content inside Suspense with fallback Loading route. Go navigates from home to next. Set route urgently: show fallback while waiting; Pending output remains no. resource.read(route) returns text or throws its pending promise. Use output Route inside the boundary; Home button returns home. Route result for this scenario is Route 6.
// Full prompt: ../prompts/2744.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({resource}) {
  // TODO: independently implement the prompt.
  return null;
}
