// 741 Fake async request state / scenario 13 — one pending request; clear data while loading; error fallback Try again
// Injected props.load():Promise<string>, no network. Load starts request. Disable Load while pending; do not start duplicate requests. Status output labelled State is idle/loading/done/error; output labelled Data initially empty. Clear data when starting a request. Show role alert on rejection, using nonempty Error.message else 'Try again'. Clear prior error on retry. Cancel invalidates pending work, sets State idle, and leaves current data; disable Cancel when not loading. Ignore stale success/failure and completion after unmount.
// Prompt: ../prompts/741.txt
// Run from unionboot: node react-more/verify.cjs --id=741 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
