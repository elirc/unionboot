// 1506 Soft delete and restore / scenario 8 — Multi-item trash; restore end; locked row 3
// Initial active rows A..E, original rank order. C is locked: Remove button disabled. Remove NAME moves item to trash. Trash retains all removed items in deletion order. Active and Trash are named lists with plain spans for row text. Trash rows have Restore NAME. Restore appends to active list. Empty trash clears trash only. Outputs Active count and Trash count.
// Full prompt: ../prompts/1506.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
