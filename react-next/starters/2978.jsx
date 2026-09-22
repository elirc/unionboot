// 2978 Fixed-window event throttle / scenario 20 — Boundary 10; leading and latest trailing delivery
// A renderless throttling effect subscribes source. First event in an idle window delivers immediately through onDeliver(value) and Delivered output. Suppress additional events for 250ms using scheduler.after, without restarting window. At window end also deliver the latest suppressed value, if any, then become idle. Count counts deliveries. Clean up subscription and timer; retained canceled callbacks do nothing. This is fixed-window throttling, not quiet-period debouncing.
// Full prompt: ../prompts/2978.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({source,scheduler,onDeliver}) {
  // TODO: independently implement the prompt.
  return null;
}
