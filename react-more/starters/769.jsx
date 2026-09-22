// 769 Tag editor with duplicate policy / scenario 11 — cap 4; maximum 4 chars; case-sensitive duplicates; sorted display
// Tag input, Add submits a form (Enter also submits), list tags as text plus Remove LABEL button. Trim tags; reject blank, tags longer than 4, case-sensitive duplicates, and additions above cap 4. Role alert says empty/long/duplicate/full in that priority. Successful add clears input and error; invalid leaves input unchanged. Display case-sensitive code-unit ascending order (do not reorder stored history). Removal clears error; Clear all clears tags/error but preserves draft. Output remaining capacity.
// Prompt: ../prompts/769.txt
// Run from unionboot: node react-more/verify.cjs --id=769 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
