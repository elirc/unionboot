// 2840 Resize-derived packing layout / scenario 2 — Boundary 2; whole cells only
// Render data-testid=frame, observe it via injected observeResize(element,callback) returning cleanup. Entries contain contentRect.width. Each tile needs 40px. Output Columns is max(1,floor(width/40)), initially 1; ignore nonfinite or negative widths. Do not read actual jsdom layout. Show exactly Columns listitems labelled Slot 1 etc. Replacement observer and unmount clean up.
// Full prompt: ../prompts/2840.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({observeResize}) {
  // TODO: independently implement the prompt.
  return null;
}
