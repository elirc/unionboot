// 1556 Reducer publishing workflow / scenario 8 — Direct publish; archive/restore; rejection retains draft; title minimum 4
// Use useReducer. State output begins draft; Title input initially empty, editable only in draft. Publish draft requires trimmed title length >=4, then enters published. Published exposes Edit returning to draft and Archive entering archived; archived exposes Restore returning to draft. Show only actions valid for current state. Title output echoes trimmed title.
// Full prompt: ../prompts/1556.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
