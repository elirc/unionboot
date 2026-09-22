// 1539 Staged transaction ledger / scenario 1 — Reject overdraft
// Amount text field accepts nonzero finite integer adjustments keeping balance in 0..20. Initial Balance=10. Note is optional. Stage disabled when invalid, also guard submit. Stage hides form and shows Confirm/Cancel; Pending output is adjustment or none. Confirm commits once, clears drafts; Cancel discards pending but keeps drafts. Reset restores balance and clears drafts. Balance output never changes merely by staging.
// Full prompt: ../prompts/1539.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
