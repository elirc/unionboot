// 620 Exclusive accordion / scenario 12 — one must stay open; One disabled; hide closed content
// Sections One/Two/Three. One is disabled and never opens. Initially Two open. Only one can be open. Clicking the open section keeps it open. Buttons expose aria-expanded and aria-controls pointing to content IDs. Keep content in the DOM with hidden=true while closed.
// Prompt: ../prompts/620.txt
// Run from unionboot: node react-more/verify.cjs --id=620 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
