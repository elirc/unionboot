// 776 Two-stage form wizard / scenario 8 — name 3..6; uppercase saved name; no acknowledgment; start over
// Step1 controlled Name field; Next enabled only for trimmed length 3..6. Preserve draft whitespace across Back. Step2 shows Review: trimmed name. Finish immediately available. Back returns to edit without losing draft. Finish removes name/review controls and shows output Saved: NAME (uppercase). Start over available at every stage resets draft, agreement and step. No network.
// Prompt: ../prompts/776.txt
// Run from unionboot: node react-more/verify.cjs --id=776 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
