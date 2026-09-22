// 671 Editable label with cancel / scenario 13 — trim length 2..7; lower; unchanged cannot save
// Initial output Abc and Edit button. Edit opens Name initialized from saved text and focuses it. Save trims and lowercases text; require 2..7 trimmed characters and a transformed result different from saved text. Save disabled otherwise; guard submit. Submit/Enter saves, Escape and Cancel discard; return focus to Edit on exit. Invalid submission stays in edit mode.
// Prompt: ../prompts/671.txt
// Run from unionboot: node react-more/verify.cjs --id=671 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
