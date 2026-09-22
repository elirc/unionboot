// 3151 Drag-transfer drop protocol / scenario 13 — Boundary 3; consume source after valid drop
// Draggable Source button carries transfer type application/x-exercise-item with ID item-3. On dragStart setData(type,id), effectAllowed=move. Target data-testid=drop-zone handles dragOver by preventDefault and dropEffect=move. On drop accept only matching ID, then output Dropped ID and hide Source. Invalid transfer gives alert Invalid transfer, no source change. Valid drop clears error; prevent default on drop. No browser drag engine or network needed.
// Full prompt: ../prompts/3151.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
