// 657 Paged list controls / scenario 9 — size 4; start page 1; bounded navigation; shrink permanently clamps
// List props.items with fixed page size 4, initial requested page 1. Clamp page to 1..max(1,ceil(length/size)), including on prop shrink; later growth must not resurrect an old out-of-range page. Output current page. Prev/Next stop and disable at their respective boundary. First/Last jump to bounds and disable there. Empty shows page1 with no rows.
// Prompt: ../prompts/657.txt
// Run from unionboot: node react-more/verify.cjs --id=657 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
