// 1532 Shared quota allocation / scenario 4 — Reclaim then allocate
// A and B share 8 units, initially A=3, B=2. Take A/B requests 2; reject an entire request when free units are insufficient. Release A/B returns up to 2 owned units. Label outputs A, B, Free. Keep action buttons enabled, guard state updates. Reset restores initial counts.
// Full prompt: ../prompts/1532.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
