// 1686 External subscription projection / scenario 8 — unique projection; pause/resume supported
// Injected source.subscribe(listener) returns unsubscribe. Messages are finite numbers. Output Value initially empty. Show unique numbers in first-seen order joined comma, or empty. Pause unsubscribes and ignores messages; Resume resubscribes preserving accumulated value. Reset clears accumulated value but not subscription. Source prop replacement unsubscribes old and subscribes new, preserving value. Ignore callbacks retained after unsubscribe/unmount.
// Full prompt: ../prompts/1686.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({source}) {
  // TODO: independently implement the prompt.
  return null;
}
