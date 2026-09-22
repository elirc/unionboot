// 1597 Abortable keyed resource / scenario 9 — Retain prior data; blank key skips load; fallback retry
// Injected load(resourceKey,signal) resolves string. Load on mount and resourceKey/load change. State output idle/loading/ready/error, Data initially empty. Blank trimmed key aborts current request and shows idle without calling load. Retain prior data during loading and errors. Each effect owns AbortController, abort cleanup on replacement/unmount. Ignore stale success/rejection even when service ignores abort. Rejection alert uses nonempty Error.message or retry. Retry button reloads current key and clears error.
// Full prompt: ../prompts/1597.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({resourceKey="A",load}) {
  // TODO: independently implement the prompt.
  return null;
}
