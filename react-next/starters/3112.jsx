// 3112 Keyboard split-pane separator / scenario 14 — Boundary 4; horizontal separator uses up/down
// Focusable role=separator labelled Resize panes. aria-orientation=horizontal, aria-valuemin=10, max=90, now initial 50. ArrowUp decreases and ArrowDown increases by 4, Shift multiplies step by 5, clamped to 10..90. Home=10, End=90. Ignore perpendicular arrows. Outputs First and Second sum to 100. Prevent default on handled keys, no pointer behavior required.
// Full prompt: ../prompts/3112.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
