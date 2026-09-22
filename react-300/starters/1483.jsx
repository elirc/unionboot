// 1483 Line-item draft editor / scenario 5 — Zero permitted; cap 3; cancel retains drafts
// Start with saved rows A:2 and B:3. Edit opens Quantity A/B text fields copied from saved rows. Require finite integers >=0 <=6. Save all disabled if any invalid, guarded on submit; commits both atomically and exits edit. Cancel exits without saving and next Edit restores abandoned drafts. Outputs A and B always show saved quantities.
// Full prompt: ../prompts/1483.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
