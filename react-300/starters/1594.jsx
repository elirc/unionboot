// 1594 Abortable keyed resource / scenario 6 — Clear prior data; blank key skips load; fallback offline
// Injected load(resourceKey,signal) resolves string. Load on mount and resourceKey/load change. State output idle/loading/ready/error, Data initially empty. Blank trimmed key aborts current request and shows idle without calling load. Clear data when starting/skipping a request. Each effect owns AbortController, abort cleanup on replacement/unmount. Ignore stale success/rejection even when service ignores abort. Rejection alert uses nonempty Error.message or offline. Retry button reloads current key and clears error.
// Full prompt: ../prompts/1594.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({resourceKey="A",load}) {
  // TODO: independently implement the prompt.
  return null;
}
