// 1592 Abortable keyed resource / scenario 4 — Clear prior data; blank key is valid; fallback retry
// Injected load(resourceKey,signal) resolves string. Load on mount and resourceKey/load change. State output idle/loading/ready/error, Data initially empty. Pass even blank keys to load. Clear data when starting/skipping a request. Each effect owns AbortController, abort cleanup on replacement/unmount. Ignore stale success/rejection even when service ignores abort. Rejection alert uses nonempty Error.message or retry. Retry button reloads current key and clears error.
// Full prompt: ../prompts/1592.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({resourceKey="A",load}) {
  // TODO: independently implement the prompt.
  return null;
}
