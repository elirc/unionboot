// 1631 Sequential queue runner / scenario 3 — Stop on first error; restart whole queue; attempt limit 5
// Run processes A,B,C sequentially via injected runJob(id,AbortSignal), never overlapping. Output State idle/running/done/error, Current current id or none. List records ID:ok / ID:failed in attempt order. Stop on failure with State error. Run disabled while running. New Run clears results and starts at A. Cancel aborts current, keeps completed rows, idle, ignores late result. Unmount aborts. Permit at most 5 Run attempts per mount, including canceled attempts; Remaining output decrements each Run and Run disables at zero.
// Full prompt: ../prompts/1631.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({runJob}) {
  // TODO: independently implement the prompt.
  return null;
}
