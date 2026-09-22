// 710 Select all checklist / scenario 12 — 5 items; eligible 1,3,4,5; initial 1; all ignores locked items
// Render All and Item1..Item5 checkboxes. Only items 1,3,4,5 are eligible; others disabled and always unchecked. Initial selection 1. All selects/deselects only eligible items; it is disabled if none exist, checked only if eligible set is nonempty and fully selected, indeterminate for partial eligible selection. Output selected item numbers sorted ascending joined by comma. Clear clears selection.
// Prompt: ../prompts/710.txt
// Run from unionboot: node react-more/verify.cjs --id=710 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
