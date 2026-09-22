// 665 Editable label with cancel / scenario 7 — trim length 2..5; lower; unchanged allowed
// Initial output Abc and Edit button. Edit opens Name initialized from saved text and focuses it. Save trims and lowercases text; require 2..5 trimmed characters. Save disabled otherwise; guard submit. Submit/Enter saves, Escape and Cancel discard; return focus to Edit on exit. Invalid submission stays in edit mode.
// Prompt: ../prompts/665.txt
// Run from unionboot: node react-more/verify.cjs --id=665 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
