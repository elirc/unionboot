// 751 Ref focus controls / scenario 13 — focus Second; clear target; caret at end; fallback when locked
// Controlled First and Second inputs initially 'alpha' and 'beta'. Lock target checkbox disables Second. Focus button falls back to the other input when target is locked. Focusing moves caret to end without changing either value. Clear empties only Second, then focuses target if enabled, otherwise the other input. Clear does not alter locking. Use refs; no querySelector in component.
// Prompt: ../prompts/751.txt
// Run from unionboot: node react-more/verify.cjs --id=751 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
