// 3410 Scroll anchor prepend compensation / scenario 12 — Boundary 2; compensate prepended row heights
// Render viewport data-testid=viewport with initial five rows R1..R5. Every Prepend adds 2 distinct new rows at top, each fixed 10px: first batch N1..N2, next N3..N4, preserving existing row identities and DOM nodes. In useLayoutEffect increase viewport.scrollTop by 20 after prepend to preserve previously visible content. Output Rows count. Prepend may be used repeatedly; compensation must occur exactly once per prepend and not on unrelated render. Toggle marker only changes Marker yes/no, never scroll position. Tests inject scrollTop; no actual layout measurements.
// Full prompt: ../prompts/3410.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
