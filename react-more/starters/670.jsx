// 670 Editable label with cancel / scenario 12 — trim length 1..6; upper; unchanged cannot save
// Initial output Abc and Edit button. Edit opens Name initialized from saved text and focuses it. Save trims and uppercases text; require 1..6 trimmed characters and a transformed result different from saved text. Save disabled otherwise; guard submit. Submit/Enter saves, Escape and Cancel discard; return focus to Edit on exit. Invalid submission stays in edit mode.
// Prompt: ../prompts/670.txt
// Run from unionboot: node react-more/verify.cjs --id=670 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
