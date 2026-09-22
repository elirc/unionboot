// 664 Editable label with cancel / scenario 6 — trim length 1..4; upper; unchanged allowed
// Initial output Abc and Edit button. Edit opens Name initialized from saved text and focuses it. Save trims and uppercases text; require 1..4 trimmed characters. Save disabled otherwise; guard submit. Submit/Enter saves, Escape and Cancel discard; return focus to Edit on exit. Invalid submission stays in edit mode.
// Prompt: ../prompts/664.txt
// Run from unionboot: node react-more/verify.cjs --id=664 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
