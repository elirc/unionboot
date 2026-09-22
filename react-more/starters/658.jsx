// 658 Paged list controls / scenario 10 — size 1; start page 2; bounded navigation; shrink permanently clamps
// List props.items with fixed page size 1, initial requested page 2. Clamp page to 1..max(1,ceil(length/size)), including on prop shrink; later growth must not resurrect an old out-of-range page. Output current page. Prev/Next stop and disable at their respective boundary. First/Last jump to bounds and disable there. Empty shows page1 with no rows.
// Prompt: ../prompts/658.txt
// Run from unionboot: node react-more/verify.cjs --id=658 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
