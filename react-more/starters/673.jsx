// 673 Editable label with cancel / scenario 15 — trim length 1..7; upper; unchanged cannot save
// Initial output Abc and Edit button. Edit opens Name initialized from saved text and focuses it. Save trims and uppercases text; require 1..7 trimmed characters and a transformed result different from saved text. Save disabled otherwise; guard submit. Submit/Enter saves, Escape and Cancel discard; return focus to Edit on exit. Invalid submission stays in edit mode.
// Prompt: ../prompts/673.txt
// Run from unionboot: node react-more/verify.cjs --id=673 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
