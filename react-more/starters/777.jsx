// 777 Two-stage form wizard / scenario 9 — name 1..4; preserved saved name; no acknowledgment; start over
// Step1 controlled Name field; Next enabled only for trimmed length 1..4. Preserve draft whitespace across Back. Step2 shows Review: trimmed name. Finish immediately available. Back returns to edit without losing draft. Finish removes name/review controls and shows output Saved: NAME (preserved case). Start over available at every stage resets draft, agreement and step. No network.
// Prompt: ../prompts/777.txt
// Run from unionboot: node react-more/verify.cjs --id=777 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
