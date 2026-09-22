// 1453 Compare selected records / scenario 5 — 3 compare slots; difference; retain hidden ids
// Pick ID checkboxes choose records in click order, cap 3; disable unchecked boxes at cap, selected remain removable. Selection output joins stored IDs by comma. Value output subtracts later existing values from the first selected existing value (0 if none). On prop disappearance retain ids/count toward cap but omit absent values from calculation. Clear resets selections. Preserve props.
// Full prompt: ../prompts/1453.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({rows=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
