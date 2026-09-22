// 742 Fake async request state / scenario 14 — one pending request; retain data while loading; error fallback Error
// Injected props.load():Promise<string>, no network. Load starts request. Disable Load while pending; do not start duplicate requests. Status output labelled State is idle/loading/done/error; output labelled Data initially empty. Keep prior successful data during loading and failure. Show role alert on rejection, using nonempty Error.message else 'Error'. Clear prior error on retry. Cancel invalidates pending work, sets State idle, and leaves current data; disable Cancel when not loading. Ignore stale success/failure and completion after unmount.
// Prompt: ../prompts/742.txt
// Run from unionboot: node react-more/verify.cjs --id=742 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
