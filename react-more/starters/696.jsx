// 696 Password visibility and length / scenario 8 — length 5..9; digit required; raw evaluation; blur re-hides
// Controlled Password field initially hidden and empty; Show/Hide is a type=button toggle preserving value, with aria-pressed. Blur always re-hides. Output short when evaluated length <5, long when >9, digit when within length but no ASCII digit, ready otherwise. Evaluate raw input value. Clear empties value and hides again.
// Prompt: ../prompts/696.txt
// Run from unionboot: node react-more/verify.cjs --id=696 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
