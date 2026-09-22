// 1437 Grouped totals view / scenario 9 — sum aggregation; name ordering; hide zero groups; minimum amount 9
// Aggregate immutable props rows {id,group,amount} by group, sum amount. Positive only checkbox (false) keeps amount>=9 before grouping. Omit zero-valued groups. Sort ascending group code-unit order. List GROUP:VALUE; Groups output count. Recompute for new props and empty lists.
// Full prompt: ../prompts/1437.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({rows=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
