// 659 Paged list controls / scenario 11 — size 2; start page 3; cyclic navigation; shrink permanently clamps
// List props.items with fixed page size 2, initial requested page 3. Clamp page to 1..max(1,ceil(length/size)), including on prop shrink; later growth must not resurrect an old out-of-range page. Output current page. Prev/Next wrap at ends and are disabled only when at most one page. First/Last jump to bounds and disable there. Empty shows page1 with no rows.
// Prompt: ../prompts/659.txt
// Run from unionboot: node react-more/verify.cjs --id=659 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
