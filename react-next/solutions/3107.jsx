// 3107 Keyboard split-pane separator / scenario 9 — Boundary 9; vertical separator uses left/right
// Focusable role=separator labelled Resize panes. aria-orientation=vertical, aria-valuemin=10, max=90, now initial 50. ArrowLeft decreases and ArrowRight increases by 9, Shift multiplies step by 5, clamped to 10..90. Home=10, End=90. Ignore perpendicular arrows. Outputs First and Second sum to 100. Prevent default on handled keys, no pointer behavior required.
// Full prompt: ../prompts/3107.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
const [size,set]=useState(50);return <section><div role="separator" aria-label="Resize panes" tabIndex={0} aria-orientation="vertical" aria-valuemin={10} aria-valuemax={90} aria-valuenow={size} onKeyDown={e=>{let next;if(e.key==='Home')next=10;else if(e.key==='End')next=90;else if(e.key==='ArrowLeft')next=size-9*(e.shiftKey?5:1);else if(e.key==='ArrowRight')next=size+9*(e.shiftKey?5:1);if(next!==undefined){e.preventDefault();set(Math.max(10,Math.min(90,next)));}}}/><output aria-label="First">{size}</output><output aria-label="Second">{100-size}</output></section>;
}
