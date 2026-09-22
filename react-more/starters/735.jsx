// 735 Fake async request state / scenario 7 — latest request wins; clear data while loading; error fallback Unavailable
// Injected props.load():Promise<string>, no network. Load starts request. Allow concurrent requests; only latest-started may update status/data/error. Status output labelled State is idle/loading/done/error; output labelled Data initially empty. Clear data when starting a request. Show role alert on rejection, using nonempty Error.message else 'Unavailable'. Clear prior error on retry. Cancel invalidates pending work, sets State idle, and leaves current data; disable Cancel when not loading. Ignore stale success/failure and completion after unmount.
// Prompt: ../prompts/735.txt
// Run from unionboot: node react-more/verify.cjs --id=735 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
