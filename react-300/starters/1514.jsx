// 1514 Bulk table actions / scenario 6 — Delete across filter
// Rows A(open), B(done), C(open), D(locked). Filter select all/open; row checkboxes Pick NAME, locked D disabled. Changing filter retains hidden selected ids. Selected output counts selections, including hidden ones. Apply disabled with no selection. Apply immediately performs action. Action removes selected records. Successful action clears selection. Rows have text NAME:STATE. Props not required.
// Full prompt: ../prompts/1514.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
