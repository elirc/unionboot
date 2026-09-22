// 1426 Faceted record search / scenario 8 — Every token match; exclude archived; score >=2
// Props rows {id,name,kind,score,archived}. Query splits trimmed lowercase whitespace tokens; match every token as case-insensitive name substring; empty matches all. Kind select all/fruit/home combines with search. Always require score>=2 and not archived. List names only in input order, Count output. Clear filters resets query and Kind, not fixed policy. Reflect prop updates without mutating them.
// Full prompt: ../prompts/1426.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({rows=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
