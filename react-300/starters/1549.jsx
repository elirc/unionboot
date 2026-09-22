// 1549 Reducer publishing workflow / scenario 1 — Independent review; edit only; rejection clears draft; title minimum 1
// Use useReducer. State output begins draft; Title input initially empty, editable only in draft. Publish draft requires trimmed title length >=1, then enters review (Approve publishes; Reject returns draft and clears title). Published exposes Edit returning to draft. Show only actions valid for current state. Title output echoes trimmed title.
// Full prompt: ../prompts/1549.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
