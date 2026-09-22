// 3409 Scroll anchor prepend compensation / scenario 11 — Boundary 1; compensate prepended row heights
// Render viewport data-testid=viewport with initial five rows R1..R5. Every Prepend adds 1 distinct new rows at top, each fixed 10px: first batch N1..N1, next N2..N2, preserving existing row identities and DOM nodes. In useLayoutEffect increase viewport.scrollTop by 10 after prepend to preserve previously visible content. Output Rows count. Prepend may be used repeatedly; compensation must occur exactly once per prepend and not on unrelated render. Toggle marker only changes Marker yes/no, never scroll position. Tests inject scrollTop; no actual layout measurements.
// Full prompt: ../prompts/3409.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
