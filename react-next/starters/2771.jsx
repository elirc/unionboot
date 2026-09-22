// 2771 Reset-key error boundaries / scenario 13 — Boundary 3; reset when resetKey changes
// A class error boundary catches descendant render errors, shows alert Panel unavailable and Retry panel. Child starts Count=3; Increment adds one. broken prop makes child throw. Recovery remounts child with original Count. A changed resetKey clears the boundary error automatically. An error must not remove a sibling output Shell with text stable. Tests intentionally trigger React error logging.
// Full prompt: ../prompts/2771.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({resetKey="A",broken=false}) {
  // TODO: independently implement the prompt.
  return null;
}
