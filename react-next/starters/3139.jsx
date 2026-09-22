// 3139 Drag-transfer drop protocol / scenario 1 — Boundary 1; retain source after valid copy
// Draggable Source button carries transfer type application/x-exercise-item with ID item-1. On dragStart setData(type,id), effectAllowed=copy. Target data-testid=drop-zone handles dragOver by preventDefault and dropEffect=copy. On drop accept only matching ID, then output Dropped ID and leave Source mounted. Invalid transfer gives alert Invalid transfer, no source change. Valid drop clears error; prevent default on drop. No browser drag engine or network needed.
// Full prompt: ../prompts/3139.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
