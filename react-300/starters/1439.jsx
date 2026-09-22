// 1439 Filter-aware pagination / scenario 1 — Page size 2; reset on filtering; case-folded query
// Props items strings, list page size 2. Query substring matching case-insensitive. Page starts1, Page output. Prev/Next disable at boundaries. Filter edits reset to page1. Size select 2/3; changing size resets page1. Count shows filtered total. Empty list still Page1.
// Full prompt: ../prompts/1439.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({items=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
