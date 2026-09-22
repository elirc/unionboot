// 2963 Fixed-window event throttle / scenario 5 — Boundary 5; leading delivery only
// A renderless throttling effect subscribes source. First event in an idle window delivers immediately through onDeliver(value) and Delivered output. Suppress additional events for 125ms using scheduler.after, without restarting window. Drop suppressed values; become idle when window ends. Count counts deliveries. Clean up subscription and timer; retained canceled callbacks do nothing. This is fixed-window throttling, not quiet-period debouncing.
// Full prompt: ../prompts/2963.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({source,scheduler,onDeliver}) {
  // TODO: independently implement the prompt.
  return null;
}
