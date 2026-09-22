// 1536 Shared quota allocation / scenario 8 — Oversized partial batch
// A and B share 5 units, initially A=0, B=0. Take A/B requests 6; take remaining free units for oversized requests. Release A/B returns up to 6 owned units. Label outputs A, B, Free. Keep action buttons enabled, guard state updates. Reset restores initial counts.
// Full prompt: ../prompts/1536.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
