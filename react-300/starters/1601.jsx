// 1601 Latest validated async form / scenario 3 — Minimum 4 letters; restart only; lowercase request
// Handle text input. Check requires trimmed ASCII letters length>=4. Normalize request lowercase. Each Check starts check(normalized,AbortSignal), supersedes and aborts previous; keep Check enabled while valid pending. Editing invalidates/aborts request and resets Result idle. Output Result idle/checking/available/taken/error. Boolean true means available, false taken; current error alert Check failed.  Abort on unmount. Ignore stale results and sync throws are errors.
// Full prompt: ../prompts/1601.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({check}) {
  // TODO: independently implement the prompt.
  return null;
}
