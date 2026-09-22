// 1434 Grouped totals view / scenario 6 — count aggregation; value ordering; hide zero groups; minimum amount 6
// Aggregate immutable props rows {id,group,amount} by group, count records. Positive only checkbox (false) keeps amount>=6 before grouping. Omit zero-valued groups. Sort descending aggregate with ascending group tie-break. List GROUP:VALUE; Groups output count. Recompute for new props and empty lists.
// Full prompt: ../prompts/1434.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({rows=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
