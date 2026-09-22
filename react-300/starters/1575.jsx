// 1575 Blackout-aware booking / scenario 7 — Short open interval
// Blank Start and End date inputs. Require End>=Start, inclusive UTC day count >=1. Reject blackout 2026-10-04..2026-10-05 with start<blackoutEnd AND end>blackoutStart (endpoint-only contact allowed). Validation output: incomplete, reversed, too short, blocked, available in that priority. Reserve disabled unless available and guarded on submit. Booking output stores START/END on success and survives invalid edits.
// Full prompt: ../prompts/1575.txt
import React,{useState,useEffect,useReducer,useRef,useMemo,useLayoutEffect,useId} from 'react';
export default function Exercise({}) {
  // TODO: independently implement the prompt.
  return null;
}
