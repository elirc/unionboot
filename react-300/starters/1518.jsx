// 1518 Bulk table actions / scenario 10 — Visible-only deletion retains hidden picks
// Rows A(open), B(done), C(open), D(locked). Filter select all/open; row checkboxes Pick NAME, locked D disabled. Changing filter retains hidden selected ids. Selected output counts selections, including hidden ones. Apply disabled unless at least one selected row is currently visible. Apply opens Confirm/Cancel review; Confirm performs action; Cancel preserves selection. Action removes selected records, but only rows visible at Confirm time; hidden selected ids are released and not acted on. Successful action clears selection. Rows have text NAME:STATE. Props not required.
// Full prompt: ../prompts/1518.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
