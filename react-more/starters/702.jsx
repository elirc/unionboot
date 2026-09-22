// 702 Password visibility and length / scenario 14 — length 6..10; digit required; trim for evaluation; blur re-hides
// Controlled Password field initially hidden and empty; Show/Hide is a type=button toggle preserving value, with aria-pressed. Blur always re-hides. Output short when evaluated length <6, long when >10, digit when within length but no ASCII digit, ready otherwise. Evaluate a trimmed copy but keep original input value. Clear empties value and hides again.
// Prompt: ../prompts/702.txt
// Run from unionboot: node react-more/verify.cjs --id=702 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
