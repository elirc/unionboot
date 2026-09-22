// 3413 Scroll anchor prepend compensation / scenario 15 — Boundary 5; compensate prepended row heights
// Render viewport data-testid=viewport with initial five rows R1..R5. Every Prepend adds 5 distinct new rows at top, each fixed 10px: first batch N1..N5, next N6..N10, preserving existing row identities and DOM nodes. In useLayoutEffect increase viewport.scrollTop by 50 after prepend to preserve previously visible content. Output Rows count. Prepend may be used repeatedly; compensation must occur exactly once per prepend and not on unrelated render. Toggle marker only changes Marker yes/no, never scroll position. Tests inject scrollTop; no actual layout measurements.
// Full prompt: ../prompts/3413.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
