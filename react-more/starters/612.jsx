// 612 Filtered product list / scenario 14 — endsWith, case-folded, trim, deduplicate exact strings, limit 2
// Render props.items strings in a list. Search uses endsWith, case-insensitive matching; trim query. Remove exact duplicate result strings, keeping first occurrence. Show at most 2 matches after filtering/deduplication. Output visible count, not total matches. Empty query matches all. Preserve input order and props; respond to updated props.
// Prompt: ../prompts/612.txt
// Run from unionboot: node react-more/verify.cjs --id=612 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
