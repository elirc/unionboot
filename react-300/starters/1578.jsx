// 1578 Blackout-aware booking / scenario 10 — Month-end closure
// Blank Start and End date inputs. Require End>=Start, inclusive UTC day count >=1. Reject blackout 2026-10-29..2026-10-31 with start<=blackoutEnd AND end>=blackoutStart. Validation output: incomplete, reversed, too short, blocked, available in that priority. Reserve disabled unless available and guarded on submit. Booking output stores START/END on success and survives invalid edits.
// Full prompt: ../prompts/1578.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
