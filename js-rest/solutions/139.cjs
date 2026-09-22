// 139: Robot navigation starting west
// Input string of L,R,F commands; invalid character throws Error('Invalid command'). Start at (0,0) facing west. L/R turn90 degrees; F moves one unit; north increases y, east increases x. Return {x,y,direction} using N/E/S/W.
// Tests: node js-rest/verify.cjs --id=139 [--starters]
// Study tests/139.cjs for examples.
// Why this works:
// The four headings are stored in clockwise order, N E S W, so a right turn
// is +1 and a left turn is +3 modulo 4. Adding 3 avoids a negative index.
// moveByHeading holds the [dx, dy] step for each heading in the same order,
// so moving forward is one table lookup.
// Policy starting west: the heading index starts at 3.
// Any character that is not L, R or F throws Error('Invalid command'), which
// happens mid-walk, so earlier commands have already been applied to the
// local variables only, never to the caller's string.
function solve(input) {
  const moveByHeading = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  const nameByHeading = 'NESW';
  let x = 0;
  let y = 0;
  let heading = 3;
  for (const command of input) {
    if (command === 'L') {
      heading = (heading + 3) % 4;
    } else if (command === 'R') {
      heading = (heading + 1) % 4;
    } else if (command === 'F') {
      x += moveByHeading[heading][0];
      y += moveByHeading[heading][1];
    } else {
      throw new Error('Invalid command');
    }
  }
  return { x, y, direction: nameByHeading[heading] };
}
module.exports=solve;
