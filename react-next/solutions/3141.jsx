// 3141 Drag-transfer drop protocol / scenario 3 — Boundary 3; retain source after valid copy
// Draggable Source button carries transfer type application/x-exercise-item with ID item-3. On dragStart setData(type,id), effectAllowed=copy. Target data-testid=drop-zone handles dragOver by preventDefault and dropEffect=copy. On drop accept only matching ID, then output Dropped ID and leave Source mounted. Invalid transfer gives alert Invalid transfer, no source change. Valid drop clears error; prevent default on drop. No browser drag engine or network needed.
// Full prompt: ../prompts/3141.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
const [dropped,set]=useState(''),[error,fail]=useState(false),[gone,hide]=useState(false);return <section>{!gone&&<button draggable onDragStart={e=>{e.dataTransfer.setData('application/x-exercise-item','item-3');e.dataTransfer.effectAllowed='copy';}}>Source</button>}<div data-testid="drop-zone" onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect='copy';}} onDrop={e=>{e.preventDefault();const id=e.dataTransfer.getData('application/x-exercise-item');if(id!=='item-3'){fail(true);return;}fail(false);set(id);}}>Target</div><output aria-label="Dropped">{dropped}</output>{error&&<p role="alert">Invalid transfer</p>}</section>;
}
