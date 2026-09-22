// 753 Ref focus controls / scenario 15 — focus Second; clear target; select text; fallback when locked
// Controlled First and Second inputs initially 'alpha' and 'beta'. Lock target checkbox disables Second. Focus button falls back to the other input when target is locked. Focusing selects all text without changing either value. Clear empties only Second, then focuses target if enabled, otherwise the other input. Clear does not alter locking. Use refs; no querySelector in component.
// Prompt: ../prompts/753.txt
// Run from unionboot: node react-more/verify.cjs --id=753 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
