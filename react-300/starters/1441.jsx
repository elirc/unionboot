// 1441 Filter-aware pagination / scenario 3 — Page size 4; reset on filtering; case-folded query
// Props items strings, list page size 4. Query substring matching case-insensitive. Page starts1, Page output. Prev/Next disable at boundaries. Filter edits reset to page1. Size select 4/5; changing size resets page1. Count shows filtered total. Empty list still Page1.
// Full prompt: ../prompts/1441.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({items=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
