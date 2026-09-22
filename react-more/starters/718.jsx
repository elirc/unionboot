// 718 Context preference provider / scenario 10 — quiet → verbose; initial quiet; Next + Reset; synchronized nested readers
// Create a module Context and nested reader/control children that consume it, no preference prop drilling. Choices quiet, verbose; initial quiet. Two nested outputs labelled Primary and Mirror always agree. Next cycles with wrap. Reset returns to the initial preference. Disable-lock checkbox labelled Locked prevents all preference-changing buttons without losing state; unlocking resumes. Separate mounted Exercise instances are isolated.
// Prompt: ../prompts/718.txt
// Run from unionboot: node react-more/verify.cjs --id=718 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
