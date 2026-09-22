// 1431 Grouped totals view / scenario 3 — sum aggregation; name ordering; retain zero groups; minimum amount 3
// Aggregate immutable props rows {id,group,amount} by group, sum amount. Positive only checkbox (false) keeps amount>=3 before grouping. Keep zero groups. Sort ascending group code-unit order. List GROUP:VALUE; Groups output count. Recompute for new props and empty lists.
// Full prompt: ../prompts/1431.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({rows=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
