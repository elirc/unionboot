// 1452 Compare selected records / scenario 4 — 2 compare slots; sum; retain hidden ids
// Pick ID checkboxes choose records in click order, cap 2; disable unchecked boxes at cap, selected remain removable. Selection output joins stored IDs by comma. Value output sums selected existing values (0 if none). On prop disappearance retain ids/count toward cap but omit absent values from calculation. Clear resets selections. Preserve props.
// Full prompt: ../prompts/1452.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({rows=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
