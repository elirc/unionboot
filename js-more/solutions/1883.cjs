// 1883 Sudoku candidate validation / scenario 5 — box=3; diagonal=false
// Prompt: ../prompts/1883.txt
'use strict';
const cfg={"box":3,"diagonal":false};
// Why this works:
// The board is n x n with n = cfg.box * cfg.box, and every digit 1..n must be
// unique inside each row, each column and each box (plus both diagonals when
// the policy asks for them).
// Phase one collects those groups and rejects the board if any group repeats a
// non-zero digit; filtering with Boolean drops the blanks, which are allowed to
// repeat. A conflicting board returns {valid:false,candidates:[]} before the
// coordinates are looked at, which is the order the prompt requires.
// Phase two gathers the digits already used in the chosen cell's row, column,
// box and - under policy diagonal - its diagonals into one Set, then lists the
// remaining digits in ascending order.
// Policy box=cfg.box sets the board size and the box geometry; policy
// diagonal=cfg.diagonal adds the two diagonals as extra groups. Nothing here
// writes to input.board, which the tests re-check after every call.
function sudoku(input) {
  const n = cfg.box * cfg.box;
  const board = input.board;
  if (board.length !== n || board.some(line => line.length !== n)) {
    throw new RangeError('Invalid board');
  }
  for (const line of board) {
    for (const cell of line) {
      if (!Number.isInteger(cell) || cell < 0 || cell > n) {
        throw new RangeError('Invalid cell');
      }
    }
  }

  const groups = [];
  for (let i = 0; i < n; i++) {
    groups.push(board[i]);
    groups.push(board.map(line => line[i]));
  }
  for (let top = 0; top < n; top += cfg.box) {
    for (let leftEdge = 0; leftEdge < n; leftEdge += cfg.box) {
      const box = [];
      for (let i = 0; i < cfg.box; i++) {
        for (let j = 0; j < cfg.box; j++) {
          box.push(board[top + i][leftEdge + j]);
        }
      }
      groups.push(box);
    }
  }
  if (cfg.diagonal) {
    groups.push(board.map((line, i) => line[i]));
    groups.push(board.map((line, i) => line[n - i - 1]));
  }
  const repeats = group => {
    const filled = group.filter(Boolean);
    return new Set(filled).size !== filled.length;
  };
  if (groups.some(repeats)) {
    return { valid: false, candidates: [] };
  }

  const { row, col } = input;
  if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || col < 0 || row >= n || col >= n) {
    throw new RangeError('Invalid coordinate');
  }
  if (board[row][col]) {
    return { valid: true, candidates: [] };
  }

  const used = new Set([...board[row], ...board.map(line => line[col])]);
  const boxRow = Math.floor(row / cfg.box) * cfg.box;
  const boxCol = Math.floor(col / cfg.box) * cfg.box;
  for (let i = 0; i < cfg.box; i++) {
    for (let j = 0; j < cfg.box; j++) {
      used.add(board[boxRow + i][boxCol + j]);
    }
  }
  if (cfg.diagonal && row === col) {
    board.forEach((line, i) => used.add(line[i]));
  }
  if (cfg.diagonal && row + col === n - 1) {
    board.forEach((line, i) => used.add(line[n - i - 1]));
  }
  return { valid: true, candidates: Array.from({ length: n }, (_, i) => i + 1).filter(digit => !used.has(digit)) };
}
module.exports=sudoku;
