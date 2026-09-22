// 1443 Filter-aware pagination / scenario 5 — Page size 3; reset on filtering; case-folded query
// Props items strings, list page size 3. Query substring matching case-insensitive. Page starts1, Page output. Prev/Next disable at boundaries. Filter edits reset to page1. Size select 3/4; changing size resets page1. Count shows filtered total. Empty list still Page1.
// Full prompt: ../prompts/1443.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({items=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
