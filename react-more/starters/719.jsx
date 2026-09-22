// 719 Context preference provider / scenario 11 — light → dark → system; initial system; Previous + Next; synchronized nested readers
// Create a module Context and nested reader/control children that consume it, no preference prop drilling. Choices light, dark, system; initial system. Two nested outputs labelled Primary and Mirror always agree. Next cycles with wrap. Previous cycles backward with wrap. Disable-lock checkbox labelled Locked prevents all preference-changing buttons without losing state; unlocking resumes. Separate mounted Exercise instances are isolated.
// Prompt: ../prompts/719.txt
// Run from unionboot: node react-more/verify.cjs --id=719 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
