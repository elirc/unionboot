// 1653 Dismissible dialog focus / scenario 5 — Escape closes; backdrop ignored; checkbox confirmation; initial focus Confirm
// Open opens role dialog labelled Remove draft, aria-modal=true. Focus Confirm on open; trap Tab/Shift+Tab across all enabled inputs/buttons. I understand checkbox enables Confirm. Confirm increments Removed output, closes, restores Open focus. Cancel closes without increment. Escape cancels. Backdrop clicks do nothing. Reopening clears confirmation. Initial focus target Confirm must instead focus confirmation field while Confirm is disabled.
// Full prompt: ../prompts/1653.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
