// 731 Keyboard escape cleanup / scenario 13 — ctrlKey + Escape; ignore text controls; initial open
// Output open/closed, Open button, and labelled Notes input. Global document keydown closes the panel on Escape only with ctrlKey true. Ignore already-defaultPrevented events and events originating in INPUT or TEXTAREA. Other keys ignored. Initial state open. Render Panel content only while open. Register one listener in useEffect and remove the exact listener on unmount. Reopening must work repeatedly.
// Prompt: ../prompts/731.txt
// Run from unionboot: node react-more/verify.cjs --id=731 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
