// 3182 Permission request lifecycle / scenario 4 — Boundary 4; prompt state is view only
// Query injected permissions.query('capability-4') returning {state,subscribe}. Output Permission prompt/granted/denied/requesting/error. Subscription changes update current state. Request button always disabled; permission may change only by subscription. Use button only while granted, increments Uses output. External subscription change invalidates a pending request; stale completions must not override it. Clean up on unmount.
// Full prompt: ../prompts/3182.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({permissions}) {
  // TODO: independently implement the prompt.
  return null;
}
