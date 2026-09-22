// 624 Accessible tab selection / scenario 6 — horizontal; automatic activation; disabled Red; initial 1
// Red/Green/Blue tabs in a tablist with aria-orientation=horizontal. Red is disabled. Initially select and make focusable index 1. ArrowRight/ArrowLeft move focus, skip disabled tabs, wrap. Home/End focus first/last enabled tab. Navigation also selects the focused tab. Click selects and focuses. Ignore the other axis. Use roving tabIndex, aria-selected and one tabpanel showing the selected name.
// Prompt: ../prompts/624.txt
// Run from unionboot: node react-more/verify.cjs --id=624 [--starters]
import React, {useState, useEffect, useReducer, useRef} from 'react';
export default function Exercise(props) {
  // TODO: implement this scenario without importing the reference.
  return null;
}
