// 748 Ref focus controls / scenario 10 — focus First; clear both; caret at end; disable focus when locked
// Controlled First and Second inputs initially 'alpha' and 'beta'. Lock target checkbox disables First. Focus button is disabled when target is locked. Focusing moves caret to end without changing either value. Clear empties both inputs, then focuses First if enabled, otherwise Second. Clear does not alter locking. Use refs; no querySelector in component.
// Prompt: ../prompts/748.txt
// Run from unionboot: node react-more/verify.cjs --id=748 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
