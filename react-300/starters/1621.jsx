// 1621 Ordered batch loader / scenario 3 — partial result policy; order A,B,C; failed-slot copy/output variant unavailable
// Load starts all injected loadOne(id,shared AbortSignal) concurrently in ids order, disabled while loading. State output idle/loading/done/error. Results list in input order, not response order. Resolve all settlements; fulfilled strings render, failed slots show unavailable; State done even with failures. Alert lists failed IDs comma-joined in input order. Cancel aborts batch, clears rows/errors, idle; late settlements ignored. New load clears prior output/error. Empty ids => done, no requests. Unmount aborts.
// Full prompt: ../prompts/1621.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({loadOne,ids=["A","B","C"]}) {
  // TODO: independently implement the prompt.
  return null;
}
