// 1454 Compare selected records / scenario 6 — 4 compare slots; sum; prune missing selection
// Pick ID checkboxes choose records in click order, cap 4; disable unchecked boxes at cap, selected remain removable. Selection output joins stored IDs by comma. Value output sums selected existing values (0 if none). On prop disappearance permanently remove missing ids. Clear resets selections. Preserve props.
// Full prompt: ../prompts/1454.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({rows=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
