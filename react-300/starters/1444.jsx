// 1444 Filter-aware pagination / scenario 6 — Page size 4; clamp on filtering; case-sensitive query
// Props items strings, list page size 4. Query substring matching case-sensitive. Page starts1, Page output. Prev/Next disable at boundaries. Filter edits permanently clamp to valid range (do not resurrect old page after clearing). Size select 4/5; changing size resets page1. Count shows filtered total. Empty list still Page1.
// Full prompt: ../prompts/1444.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({items=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
