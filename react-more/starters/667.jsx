// 667 Editable label with cancel / scenario 9 — trim length 1..5; upper; unchanged allowed
// Initial output Abc and Edit button. Edit opens Name initialized from saved text and focuses it. Save trims and uppercases text; require 1..5 trimmed characters. Save disabled otherwise; guard submit. Submit/Enter saves, Escape and Cancel discard; return focus to Edit on exit. Invalid submission stays in edit mode.
// Prompt: ../prompts/667.txt
// Run from unionboot: node react-more/verify.cjs --id=667 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
