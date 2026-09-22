// 687 Reducer undoable text / scenario 9 — 5-entry bounded history; trim; allow blank commits
// Use useReducer for controlled Text history, initially 'start'. Normalize changes by trimming edges. Empty strings are valid entries. Identical normalized value does not create an entry. Retain at most 5 entries, dropping oldest. Undo/Redo navigate; new edit after undo drops redo. Output retained entry count. Clear history keeps the current text as the only entry. Buttons disable at boundaries.
// Prompt: ../prompts/687.txt
// Run from unionboot: node react-more/verify.cjs --id=687 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
