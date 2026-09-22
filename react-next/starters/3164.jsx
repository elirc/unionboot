// 3164 Connectivity capability gate / scenario 6 — Boundary 6; reject actions while offline
// Read injected connection.read() on mount; subscribe to booleans. Sync action payload is 6. Output Network online/offline, Pending yes/no, Syncs count. Clicking Sync online calls onSync(6) immediately. Offline do not queue; show alert Offline. Going online clears alert. Duplicate online events must not replay queued work. Unmount unsubscribes and cancels pending intent.
// Full prompt: ../prompts/3164.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({connection,onSync}) {
  // TODO: independently implement the prompt.
  return null;
}
