// 1888 Sudoku candidate validation / scenario 10 — box=5; diagonal=true
// Prompt: ../prompts/1888.txt
'use strict';
const cfg={"box":5,"diagonal":true};
function sudoku(input) {
  const n=cfg.box*cfg.box,board=input.board;
  if(board.length!==n||board.some(r=>r.length!==n))throw new RangeError('Invalid board');
  for(const row of board)for(const x of row)if(!Number.isInteger(x)||x<0||x>n)throw new RangeError('Invalid cell');
  const groups=[];
  for(let i=0;i<n;i++){groups.push(board[i]);groups.push(board.map(r=>r[i]));}
  for(let r=0;r<n;r+=cfg.box)for(let c=0;c<n;c+=cfg.box){const g=[];for(let i=0;i<cfg.box;i++)for(let j=0;j<cfg.box;j++)g.push(board[r+i][c+j]);groups.push(g);}
  if(cfg.diagonal){groups.push(board.map((row,i)=>row[i]));groups.push(board.map((row,i)=>row[n-i-1]));}
  if(groups.some(g=>new Set(g.filter(Boolean)).size!==g.filter(Boolean).length))return {valid:false,candidates:[]};
  const {row:r,col:c}=input;if(!Number.isInteger(r)||!Number.isInteger(c)||r<0||c<0||r>=n||c>=n)throw new RangeError('Invalid coordinate');
  if(board[r][c])return {valid:true,candidates:[]};
  const used=new Set([...board[r],...board.map(row=>row[c])]);
  const br=Math.floor(r/cfg.box)*cfg.box,bc=Math.floor(c/cfg.box)*cfg.box;
  for(let i=0;i<cfg.box;i++)for(let j=0;j<cfg.box;j++)used.add(board[br+i][bc+j]);
  if(cfg.diagonal&&r===c)board.forEach((row,i)=>used.add(row[i]));
  if(cfg.diagonal&&r+c===n-1)board.forEach((row,i)=>used.add(row[n-i-1]));
  return {valid:true,candidates:Array.from({length:n},(_,i)=>i+1).filter(x=>!used.has(x))};
}
module.exports=sudoku;
