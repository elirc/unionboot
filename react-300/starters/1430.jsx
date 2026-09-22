// 1430 Grouped totals view / scenario 2 — count aggregation; value ordering; retain zero groups; minimum amount 2
// Aggregate immutable props rows {id,group,amount} by group, count records. Positive only checkbox (false) keeps amount>=2 before grouping. Keep zero groups. Sort descending aggregate with ascending group tie-break. List GROUP:VALUE; Groups output count. Recompute for new props and empty lists.
// Full prompt: ../prompts/1430.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({rows=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
