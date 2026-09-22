// 3168 Connectivity capability gate / scenario 10 — Boundary 10; reject actions while offline
// Read injected connection.read() on mount; subscribe to booleans. Sync action payload is 10. Output Network online/offline, Pending yes/no, Syncs count. Clicking Sync online calls onSync(10) immediately. Offline do not queue; show alert Offline. Going online clears alert. Duplicate online events must not replay queued work. Unmount unsubscribes and cancels pending intent.
// Full prompt: ../prompts/3168.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId,useCallback,useContext,useSyncExternalStore,useTransition,useDeferredValue,useImperativeHandle,forwardRef,Suspense} from 'react';
import {createPortal} from 'react-dom';
export default function Exercise({connection,onSync}) {
  // TODO: independently implement the prompt.
  return null;
}
