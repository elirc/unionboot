// 3190 Permission request lifecycle / scenario 12 — Boundary 2; request permission from prompt state
// Query injected permissions.query('capability-2') returning {state,subscribe}. Output Permission prompt/granted/denied/requesting/error. Subscription changes update current state. Request button enabled only in prompt or error, calls permissions.request(name) promise; disable while pending; resolution granted/denied, rejection error. Use button only while granted, increments Uses output. External subscription change invalidates a pending request; stale completions must not override it. Clean up on unmount.
// Full prompt: ../prompts/3190.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({permissions}) {
  // TODO: independently implement the prompt.
  return null;
}
