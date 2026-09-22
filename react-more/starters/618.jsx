// 618 Exclusive accordion / scenario 10 — one must stay open; Two disabled; unmount closed content
// Sections One/Two/Three. Two is disabled and never opens. Initially Three open. Only one can be open. Clicking the open section keeps it open. Buttons expose aria-expanded and aria-controls pointing to content IDs. Unmount closed content.
// Prompt: ../prompts/618.txt
// Run from unionboot: node react-more/verify.cjs --id=618 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
