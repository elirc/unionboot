// 1427 Faceted record search / scenario 9 — Any token match; exclude archived; score >=3
// Props rows {id,name,kind,score,archived}. Query splits trimmed lowercase whitespace tokens; match any token as case-insensitive name substring; empty matches all. Kind select all/fruit/home combines with search. Always require score>=3 and not archived. List names only in input order, Count output. Clear filters resets query and Kind, not fixed policy. Reflect prop updates without mutating them.
// Full prompt: ../prompts/1427.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({rows=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
