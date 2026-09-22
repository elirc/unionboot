// 674 Confirm destructive local action / scenario 6 — 2 records; remove all; phrase DELETE; case-insensitive; phrase only
// Local-only records count 2 in output. Delete opens dialog labelled Confirm removal and focuses Confirmation input. Confirm disabled until trimmed phrase equals DELETE (case-insensitive). Confirm removes all records, closes dialog and restores focus to Delete. Cancel or Escape closes without changing count. Reopening clears phrase/acknowledgment. Disable Delete at zero. No server actions.
// Prompt: ../prompts/674.txt
// Run from unionboot: node react-more/verify.cjs --id=674 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
