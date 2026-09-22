// 1644 Optimistic row toggle rollback / scenario 6 — Single global mutation; other-row errors retained; 1 initial active rows
// Rows A..E have Toggle NAME buttons; initially first 1 active. Each row output Active NAME is yes/no. Toggle optimistically flips value and calls persist(id,nextBoolean). Disable all row buttons while any request pending. Resolve true commits; false/rejection rolls back only affected row and shows alert Failed NAME. New attempt clears only that row error. Pending output is pending count. Ignore completion after unmount. Repeated click while pending cannot create duplicate calls.
// Full prompt: ../prompts/1644.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({persist}) {
  // TODO: independently implement the prompt.
  return null;
}
