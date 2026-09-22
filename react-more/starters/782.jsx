// 782 Two-stage form wizard / scenario 14 — name 3..6; uppercase saved name; review acknowledgment; start over
// Step1 controlled Name field; Next enabled only for trimmed length 3..6. Preserve draft whitespace across Back. Step2 shows Review: trimmed name. Agree checkbox required to enable Finish; returning Back clears agreement. Back returns to edit without losing draft. Finish removes name/review controls and shows output Saved: NAME (uppercase). Start over available at every stage resets draft, agreement and step. No network.
// Prompt: ../prompts/782.txt
// Run from unionboot: node react-more/verify.cjs --id=782 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
