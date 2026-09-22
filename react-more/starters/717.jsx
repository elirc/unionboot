// 717 Context preference provider / scenario 9 — low → normal → high; initial low; Next + Reset; synchronized nested readers
// Create a module Context and nested reader/control children that consume it, no preference prop drilling. Choices low, normal, high; initial low. Two nested outputs labelled Primary and Mirror always agree. Next cycles with wrap. Reset returns to the initial preference. Disable-lock checkbox labelled Locked prevents all preference-changing buttons without losing state; unlocking resumes. Separate mounted Exercise instances are isolated.
// Prompt: ../prompts/717.txt
// Run from unionboot: node react-more/verify.cjs --id=717 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
