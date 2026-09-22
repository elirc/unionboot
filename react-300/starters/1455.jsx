// 1455 Compare selected records / scenario 7 — 2 compare slots; difference; prune missing selection
// Pick ID checkboxes choose records in click order, cap 2; disable unchecked boxes at cap, selected remain removable. Selection output joins stored IDs by comma. Value output subtracts later existing values from the first selected existing value (0 if none). On prop disappearance permanently remove missing ids. Clear resets selections. Preserve props.
// Full prompt: ../prompts/1455.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({rows=[]}) {
  // TODO: independently implement the prompt.
  return null;
}
