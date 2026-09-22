// 1636 Sequential queue runner / scenario 8 — Continue after errors; restart whole queue; attempt limit 10
// Run processes A,B,C sequentially via injected runJob(id,AbortSignal), never overlapping. Output State idle/running/done/error, Current current id or none. List records ID:ok / ID:failed in attempt order. Continue after failure, finish State done. Run disabled while running. New Run clears results and starts at A. Cancel aborts current, keeps completed rows, idle, ignores late result. Unmount aborts. Permit at most 10 Run attempts per mount, including canceled attempts; Remaining output decrements each Run and Run disables at zero.
// Full prompt: ../prompts/1636.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({runJob}) {
  // TODO: independently implement the prompt.
  return null;
}
