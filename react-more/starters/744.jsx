// 744 Ref focus controls / scenario 6 — focus First; clear both; select text; disable focus when locked
// Controlled First and Second inputs initially 'alpha' and 'beta'. Lock target checkbox disables First. Focus button is disabled when target is locked. Focusing selects all text without changing either value. Clear empties both inputs, then focuses First if enabled, otherwise Second. Clear does not alter locking. Use refs; no querySelector in component.
// Prompt: ../prompts/744.txt
// Run from unionboot: node react-more/verify.cjs --id=744 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
