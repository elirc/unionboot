// 619 Exclusive accordion / scenario 11 — all may close; Three disabled; hide closed content
// Sections One/Two/Three. Three is disabled and never opens. Initially all closed. Only one can be open. Clicking the open section closes it. Buttons expose aria-expanded and aria-controls pointing to content IDs. Keep content in the DOM with hidden=true while closed.
// Prompt: ../prompts/619.txt
// Run from unionboot: node react-more/verify.cjs --id=619 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
