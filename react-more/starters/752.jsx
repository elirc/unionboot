// 752 Ref focus controls / scenario 14 — focus First; clear target; caret at start; fallback when locked
// Controlled First and Second inputs initially 'alpha' and 'beta'. Lock target checkbox disables First. Focus button falls back to the other input when target is locked. Focusing moves caret to start without changing either value. Clear empties only First, then focuses target if enabled, otherwise the other input. Clear does not alter locking. Use refs; no querySelector in component.
// Prompt: ../prompts/752.txt
// Run from unionboot: node react-more/verify.cjs --id=752 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
