// 3402 Scroll anchor prepend compensation / scenario 4 — Boundary 4; leave scroll position unchanged
// Render viewport data-testid=viewport with initial five rows R1..R5. Every Prepend adds 4 distinct new rows at top, each fixed 10px: first batch N1..N4, next N5..N8, preserving existing row identities and DOM nodes. Do not adjust scrollTop after prepend. Output Rows count. Prepend may be used repeatedly; compensation must occur exactly once per prepend and not on unrelated render. Toggle marker only changes Marker yes/no, never scroll position. Tests inject scrollTop; no actual layout measurements.
// Full prompt: ../prompts/3402.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
