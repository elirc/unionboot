// 2722 Atomic external-store snapshots / scenario 4 — Boundary 4; raw selector
// Use useSyncExternalStore with injected store.subscribe/getSnapshot. Snapshot is an immutable {value,revision} object with stable identity until publish. Two sibling readers must show the same snapshot, outputs Left and Right; display value. Revision output shows revision. Do not copy snapshots into effect-managed state. Unsubscribe on store replacement and unmount.
// Full prompt: ../prompts/2722.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({store}) {
  // TODO: independently implement the prompt.
  return null;
}
