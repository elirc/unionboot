// 764 Tag editor with duplicate policy / scenario 6 — cap 2; maximum 3 chars; case-insensitive duplicates; insertion-order display
// Tag input, Add submits a form (Enter also submits), list tags as text plus Remove LABEL button. Trim tags; reject blank, tags longer than 3, case-insensitive duplicates, and additions above cap 2. Role alert says empty/long/duplicate/full in that priority. Successful add clears input and error; invalid leaves input unchanged. Display in insertion order. Removal clears error; Clear all clears tags/error but preserves draft. Output remaining capacity.
// Prompt: ../prompts/764.txt
// Run from unionboot: node react-more/verify.cjs --id=764 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
