// 680 Confirm destructive local action / scenario 12 — 8 records; remove all; phrase remove; case-insensitive; acknowledgment required
// Local-only records count 8 in output. Delete opens dialog labelled Confirm removal and focuses Confirmation input. Confirm disabled until trimmed phrase equals remove (case-insensitive) and I understand checkbox is checked. Confirm removes all records, closes dialog and restores focus to Delete. Cancel or Escape closes without changing count. Reopening clears phrase/acknowledgment. Disable Delete at zero. No server actions.
// Prompt: ../prompts/680.txt
// Run from unionboot: node react-more/verify.cjs --id=680 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
