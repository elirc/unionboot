// 720 Context preference provider / scenario 12 — compact → comfortable; initial compact; Previous + Next; synchronized nested readers
// Create a module Context and nested reader/control children that consume it, no preference prop drilling. Choices compact, comfortable; initial compact. Two nested outputs labelled Primary and Mirror always agree. Next cycles with wrap. Previous cycles backward with wrap. Disable-lock checkbox labelled Locked prevents all preference-changing buttons without losing state; unlocking resumes. Separate mounted Exercise instances are isolated.
// Prompt: ../prompts/720.txt
// Run from unionboot: node react-more/verify.cjs --id=720 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
