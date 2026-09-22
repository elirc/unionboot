// 653 Stable sortable table / scenario 15 — initial score descending; case-folded names; null always first
// Props rows {id,name,score}, score may be null. Accessible table columns ID, Name, Score. Initially score descending. Name/Score header buttons select ascending for a new column, toggle current. Compare names case-insensitively using < and > (not locale order). Null scores always first in both directions; show an em dash for null. Keep original prop order for ties, even descending. Set aria-sort on active th; inactive th uses none. Never mutate rows.
// Prompt: ../prompts/653.txt
// Run from unionboot: node react-more/verify.cjs --id=653 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
