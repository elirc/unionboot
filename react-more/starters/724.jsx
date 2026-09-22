// 724 Keyboard escape cleanup / scenario 6 — Enter; allow text controls; initial closed
// Output open/closed, Open button, and labelled Notes input. Global document keydown closes the panel on Enter only without Ctrl/Alt/Meta. Ignore already-defaultPrevented events. Other keys ignored. Initial state closed. Render Panel content only while open. Register one listener in useEffect and remove the exact listener on unmount. Reopening must work repeatedly.
// Prompt: ../prompts/724.txt
// Run from unionboot: node react-more/verify.cjs --id=724 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
