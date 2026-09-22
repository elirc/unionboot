// 1555 Reducer publishing workflow / scenario 7 — Independent review; archive/restore; rejection clears draft; title minimum 3
// Use useReducer. State output begins draft; Title input initially empty, editable only in draft. Publish draft requires trimmed title length >=3, then enters review (Approve publishes; Reject returns draft and clears title). Published exposes Edit returning to draft and Archive entering archived; archived exposes Restore returning to draft. Show only actions valid for current state. Title output echoes trimmed title.
// Full prompt: ../prompts/1555.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
