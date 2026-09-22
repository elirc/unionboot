// Exercise 31 — Mini template engine (strings, regex, data lookup)
// Write render(template, data) that replaces {{ key }} placeholders.
// Support dotted paths: {{ user.name }}. Leave unknown keys as-is.
//
// Run with:  node 31-template-engine.js

function render(template, data) {
  // your code here
}

const data = {
  name: "Ada",
  user: { address: { city: "London" } },
};

console.log(render("Hello {{name}}!", data)); // expected: Hello Ada!
console.log(render("City: {{user.address.city}}", data)); // expected: City: London
console.log(render("Hi {{missing}}", data));              // expected: Hi {{missing}}
