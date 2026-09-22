// 692 Reducer undoable text / scenario 14 — 5-entry bounded history; lower; reject blank commits
// Use useReducer for controlled Text history, initially 'start'. Normalize changes by lowercasing (preserve whitespace). Reject empty normalized strings. Identical normalized value does not create an entry. Retain at most 5 entries, dropping oldest. Undo/Redo navigate; new edit after undo drops redo. Output retained entry count. Clear history keeps the current text as the only entry. Buttons disable at boundaries.
// Prompt: ../prompts/692.txt
// Run from unionboot: node react-more/verify.cjs --id=692 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
