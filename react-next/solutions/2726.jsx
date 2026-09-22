// 2726 Atomic external-store snapshots / scenario 8 — Boundary 8; raw selector
// Use useSyncExternalStore with injected store.subscribe/getSnapshot. Snapshot is an immutable {value,revision} object with stable identity until publish. Two sibling readers must show the same snapshot, outputs Left and Right; display value. Revision output shows revision. Do not copy snapshots into effect-managed state. Unsubscribe on store replacement and unmount.
// Full prompt: ../prompts/2726.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
function Reader({store,name}){const s=useSyncExternalStore(store.subscribe,store.getSnapshot,store.getSnapshot);return <output aria-label={name}>{s.value}</output>;}
export default function Exercise({store}) {
const s=useSyncExternalStore(store.subscribe,store.getSnapshot,store.getSnapshot);return <section><Reader store={store} name="Left"/><Reader store={store} name="Right"/><output aria-label="Revision">{s.revision}</output></section>;
}
