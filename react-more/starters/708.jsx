// 708 Select all checklist / scenario 10 — 3 items; eligible 1,3; initial none; all ignores locked items
// Render All and Item1..Item3 checkboxes. Only items 1,3 are eligible; others disabled and always unchecked. Initial selection empty. All selects/deselects only eligible items; it is disabled if none exist, checked only if eligible set is nonempty and fully selected, indeterminate for partial eligible selection. Output selected item numbers sorted ascending joined by comma. Clear clears selection.
// Prompt: ../prompts/708.txt
// Run from unionboot: node react-more/verify.cjs --id=708 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
