// 611 Filtered product list / scenario 13 — startsWith, case-folded, literal spaces, deduplicate exact strings, limit none
// Render props.items strings in a list. Search uses startsWith, case-insensitive matching; preserve query whitespace. Remove exact duplicate result strings, keeping first occurrence. Show every match. Output visible count, not total matches. Empty query matches all. Preserve input order and props; respond to updated props.
// Prompt: ../prompts/611.txt
// Run from unionboot: node react-more/verify.cjs --id=611 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
