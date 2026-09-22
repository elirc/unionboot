// 758 Dependent option selection / scenario 10 — initial North; always reset city; first-option reset; empty region
// Region select North/South/Empty; choices North: Shared,A,B; South: Shared,C; Empty: none. Initially North, city Shared. Reset chooses first city, or empty if none. On Region change always reset city. City select disabled for Empty. Output Region:City (use '-' for no selection). Reset button restores original region/city.
// Prompt: ../prompts/758.txt
// Run from unionboot: node react-more/verify.cjs --id=758 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
