// 1448 Filter-aware pagination / scenario 10 — Page size 2; clamp on filtering; case-sensitive query
// Props items strings, list page size 2. Query substring matching case-sensitive. Page starts1, Page output. Prev/Next disable at boundaries. Filter edits permanently clamp to valid range (do not resurrect old page after clearing). Size select 2/3; changing size resets page1. Count shows filtered total. Empty list still Page1.
// Full prompt: ../prompts/1448.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({items=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
