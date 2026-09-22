// 1662 Injected interval budget / scenario 4 — Tick 4, cap 8; manual start
// Injected scheduler provides every(callback) returning cancel function. Start registers one repeating callback; initially stopped. Each tick increases Count by 4, clamped to 8. At cap stop subscription automatically and display done in State. Start/Stop disabled appropriately. Stop pauses, Start resumes. Reset sets Count=0 and stops even auto-start variants. Clean up exact subscription on unmount; a callback retained by test after cancellation must not update state. No real timers.
// Full prompt: ../prompts/1662.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({scheduler}) {
  // TODO: independently implement the prompt.
  return null;
}
