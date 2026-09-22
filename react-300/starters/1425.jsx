// 1425 Faceted record search / scenario 7 — Any token match; exclude archived; score >=1
// Props rows {id,name,kind,score,archived}. Query splits trimmed lowercase whitespace tokens; match any token as case-insensitive name substring; empty matches all. Kind select all/fruit/home combines with search. Always require score>=1 and not archived. List names only in input order, Count output. Clear filters resets query and Kind, not fixed policy. Reflect prop updates without mutating them.
// Full prompt: ../prompts/1425.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({rows=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
