// Exercise 29 — CSV parser (strings → objects)
// Write parseCSV(text) that turns CSV text (with a header row)
// into an array of objects. Trim cell whitespace.
//
// Run with:  node 29-csv-parse.js

const csv = `
name, age , city
Ada, 36 , London
Linus,25, Helsinki
`;

function parseCSV(text) {
  // your code here
}

console.log(parseCSV(csv));
// expected: [
//   { name: 'Ada', age: '36', city: 'London' },
//   { name: 'Linus', age: '25', city: 'Helsinki' }
// ]

console.log(parseCSV("")); // expected: []
