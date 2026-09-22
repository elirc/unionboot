// 695 Password visibility and length / scenario 7 — length 4..8; no digit rule; raw evaluation; blur re-hides
// Controlled Password field initially hidden and empty; Show/Hide is a type=button toggle preserving value, with aria-pressed. Blur always re-hides. Output short when evaluated length <4, long when >8, ready otherwise. Evaluate raw input value. Clear empties value and hides again.
// Prompt: ../prompts/695.txt
// Run from unionboot: node react-more/verify.cjs --id=695 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
