// 678 Confirm destructive local action / scenario 10 — 6 records; remove all; phrase DELETE; case-sensitive; phrase only
// Local-only records count 6 in output. Delete opens dialog labelled Confirm removal and focuses Confirmation input. Confirm disabled until trimmed phrase equals DELETE (case-sensitive). Confirm removes all records, closes dialog and restores focus to Delete. Cancel or Escape closes without changing count. Reopening clears phrase/acknowledgment. Disable Delete at zero. No server actions.
// Prompt: ../prompts/678.txt
// Run from unionboot: node react-more/verify.cjs --id=678 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
