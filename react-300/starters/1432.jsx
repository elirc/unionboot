// 1432 Grouped totals view / scenario 4 — count aggregation; name ordering; retain zero groups; minimum amount 4
// Aggregate immutable props rows {id,group,amount} by group, count records. Positive only checkbox (false) keeps amount>=4 before grouping. Keep zero groups. Sort ascending group code-unit order. List GROUP:VALUE; Groups output count. Recompute for new props and empty lists.
// Full prompt: ../prompts/1432.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({rows=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
