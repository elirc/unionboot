// 1622 Ordered batch loader / scenario 4 — atomic result policy; order A,C,B
// Load starts all injected loadOne(id,shared AbortSignal) concurrently in ids order, disabled while loading. State output idle/loading/done/error. Results list in input order, not response order. Any rejected slot makes whole batch State error with no result rows, after all settle. Alert lists failed IDs comma-joined in input order. Cancel aborts batch, clears rows/errors, idle; late settlements ignored. New load clears prior output/error. Empty ids => done, no requests. Unmount aborts.
// Full prompt: ../prompts/1622.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({loadOne,ids=["A","C","B"]}) {
  // TODO: independently implement the prompt.
  return null;
}
