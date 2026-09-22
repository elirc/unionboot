// 2886 Pointer capture drag intent / scenario 8 — Boundary 8; x axis threshold
// A Drag handle button tracks the first primary pointer only, captures its pointerId on down, releases on matching up/cancel. Ignore other IDs and nonprimary buttons. Measure absolute clientX distance from start; threshold 40px enters dragging. Output Gesture idle/pressed/dragging/dropped/canceled; pointerup gives dropped only after dragging, otherwise idle. pointercancel gives canceled. Capture methods are injected on DOM node by tests.
// Full prompt: ../prompts/2886.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
