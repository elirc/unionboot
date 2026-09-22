// 693 Reducer undoable text / scenario 15 — 6-entry bounded history; lower; allow blank commits
// Use useReducer for controlled Text history, initially 'start'. Normalize changes by lowercasing (preserve whitespace). Empty strings are valid entries. Identical normalized value does not create an entry. Retain at most 6 entries, dropping oldest. Undo/Redo navigate; new edit after undo drops redo. Output retained entry count. Clear history keeps the current text as the only entry. Buttons disable at boundaries.
// Prompt: ../prompts/693.txt
// Run from unionboot: node react-more/verify.cjs --id=693 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
