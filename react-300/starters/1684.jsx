// 1684 External subscription projection / scenario 6 — latest projection; pause/resume supported
// Injected source.subscribe(listener) returns unsubscribe. Messages are finite numbers. Output Value initially none. Show latest message. Pause unsubscribes and ignores messages; Resume resubscribes preserving accumulated value. Reset clears accumulated value but not subscription. Source prop replacement unsubscribes old and subscribes new, preserving value. Ignore callbacks retained after unsubscribe/unmount.
// Full prompt: ../prompts/1684.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({source}) {
  // TODO: independently implement the prompt.
  return null;
}
