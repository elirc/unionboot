// 734 Fake async request state / scenario 6 — latest request wins; retain data while loading; error fallback Failed
// Injected props.load():Promise<string>, no network. Load starts request. Allow concurrent requests; only latest-started may update status/data/error. Status output labelled State is idle/loading/done/error; output labelled Data initially empty. Keep prior successful data during loading and failure. Show role alert on rejection, using nonempty Error.message else 'Failed'. Clear prior error on retry. Cancel invalidates pending work, sets State idle, and leaves current data; disable Cancel when not loading. Ignore stale success/failure and completion after unmount.
// Prompt: ../prompts/734.txt
// Run from unionboot: node react-more/verify.cjs --id=734 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
