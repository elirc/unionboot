// 760 Dependent option selection / scenario 12 — initial North; preserve still-valid city; placeholder reset; empty region
// Region select North/South/Empty; choices North: Shared,A,B; South: Shared,C; Empty: none. Initially North, city (none). Include an empty City option labelled Choose city; reset uses it. On Region change preserve selected nonempty city if valid in new region; otherwise reset. City select disabled for Empty. Output Region:City (use '-' for no selection). Reset button restores original region/city.
// Prompt: ../prompts/760.txt
// Run from unionboot: node react-more/verify.cjs --id=760 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
