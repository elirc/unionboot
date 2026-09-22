// 2751 Transition-backed route preview / scenario 13 — Boundary 3; retain old route during transition
// Render route content inside Suspense with fallback Loading route. Go navigates from home to next. Wrap route state change in useTransition startTransition: keep Home visible until the injected resource settles; Pending output yes during wait. resource.read(route) returns text or throws its pending promise. Use output Route inside the boundary; Home button returns home. Route result for this scenario is Route 3.
// Full prompt: ../prompts/2751.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({resource}) {
  // TODO: independently implement the prompt.
  return null;
}
