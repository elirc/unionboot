// 621 Exclusive accordion / scenario 13 — all may close; Two disabled; hide closed content
// Sections One/Two/Three. Two is disabled and never opens. Initially all closed. Only one can be open. Clicking the open section closes it. Buttons expose aria-expanded and aria-controls pointing to content IDs. Keep content in the DOM with hidden=true while closed.
// Prompt: ../prompts/621.txt
// Run from unionboot: node react-more/verify.cjs --id=621 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
