// 1680 External subscription projection / scenario 2 — sum projection; always subscribed
// Injected source.subscribe(listener) returns unsubscribe. Messages are finite numbers. Output Value initially 0. Sum messages. Always subscribe while mounted. Reset clears accumulated value but not subscription. Source prop replacement unsubscribes old and subscribes new, preserving value. Ignore callbacks retained after unsubscribe/unmount.
// Full prompt: ../prompts/1680.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({source}) {
  // TODO: independently implement the prompt.
  return null;
}
