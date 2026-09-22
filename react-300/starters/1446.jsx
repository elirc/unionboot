// 1446 Filter-aware pagination / scenario 8 — Page size 3; clamp on filtering; case-sensitive query
// Props items strings, list page size 3. Query substring matching case-sensitive. Page starts1, Page output. Prev/Next disable at boundaries. Filter edits permanently clamp to valid range (do not resurrect old page after clearing). Size select 3/4; changing size resets page1. Count shows filtered total. Empty list still Page1.
// Full prompt: ../prompts/1446.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({items=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
