// 3157 Drag-transfer drop protocol / scenario 19 — Boundary 9; consume source after valid drop
// Draggable Source button carries transfer type application/x-exercise-item with ID item-9. On dragStart setData(type,id), effectAllowed=move. Target data-testid=drop-zone handles dragOver by preventDefault and dropEffect=move. On drop accept only matching ID, then output Dropped ID and hide Source. Invalid transfer gives alert Invalid transfer, no source change. Valid drop clears error; prevent default on drop. No browser drag engine or network needed.
// Full prompt: ../prompts/3157.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({}) {
const [dropped,set]=useState(''),[error,fail]=useState(false),[gone,hide]=useState(false);return <section>{!gone&&<button draggable onDragStart={e=>{e.dataTransfer.setData('application/x-exercise-item','item-9');e.dataTransfer.effectAllowed='move';}}>Source</button>}<div data-testid="drop-zone" onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect='move';}} onDrop={e=>{e.preventDefault();const id=e.dataTransfer.getData('application/x-exercise-item');if(id!=='item-9'){fail(true);return;}fail(false);set(id);hide(true);}}>Target</div><output aria-label="Dropped">{dropped}</output>{error&&<p role="alert">Invalid transfer</p>}</section>;
}
