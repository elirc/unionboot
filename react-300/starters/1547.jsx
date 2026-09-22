// 1547 Staged transaction ledger / scenario 9 — Tight balance window
// Amount text field accepts nonzero finite integer adjustments keeping balance in 1..3. Initial Balance=2. Note is optional. Stage disabled when invalid, also guard submit. Stage hides form and shows Confirm/Cancel; Pending output is adjustment or none. Confirm commits once, clears drafts; Cancel discards pending but keeps drafts. Reset restores balance and clears drafts. Balance output never changes merely by staging.
// Full prompt: ../prompts/1547.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
