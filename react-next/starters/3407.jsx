// 3407 Scroll anchor prepend compensation / scenario 9 — Boundary 9; leave scroll position unchanged
// Render viewport data-testid=viewport with initial five rows R1..R5. Every Prepend adds 9 distinct new rows at top, each fixed 10px: first batch N1..N9, next N10..N18, preserving existing row identities and DOM nodes. Do not adjust scrollTop after prepend. Output Rows count. Prepend may be used repeatedly; compensation must occur exactly once per prepend and not on unrelated render. Toggle marker only changes Marker yes/no, never scroll position. Tests inject scrollTop; no actual layout measurements.
// Full prompt: ../prompts/3407.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
