// 3388 Native listener phase contract / scenario 10 — Boundary 10; bubble-phase native listener
// Attach native click listener to data-testid=outer via useEffect with capture=false. Child Inner button has its own React onClick. Output Trace appends N10 when native outer fires and R when React child fires. With delegation at root, native outer listener runs before child React bubble handler in both modes. Stop checkbox controls a native INNER listener which stopPropagation() before outer bubble; capture outer still fires. Reset clears trace. Cleanup exact listener/options on unmount. This tests native vs delegated event phases, not menu keyboard behavior.
// Full prompt: ../prompts/3388.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
