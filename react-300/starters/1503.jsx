// 1503 Soft delete and restore / scenario 5 — One undo slot; restore original; locked row 5
// Initial active rows A..E, original rank order. E is locked: Remove button disabled. Remove NAME moves item to trash. Trash holds only the most recently deleted item; older trash is discarded permanently. Active and Trash are named lists with plain spans for row text. Trash rows have Restore NAME. Restore places item by original rank. Empty trash clears trash only. Outputs Active count and Trash count.
// Full prompt: ../prompts/1503.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
