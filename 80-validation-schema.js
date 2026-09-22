// Exercise 80 — Schema validation without a framework
// Write validate(schema, data). Schema is a plain object; each own key is
// a rule {type, required, min, max}. Supported types: 'string', 'number',
// 'boolean'. type/required are optional; default type 'string', required
// false. Extra data keys are ignored. Check required BEFORE type rules.
// Constraints apply per type: string min/max = inclusive length bounds;
// number min/max = inclusive numeric bounds. null is never valid.
// Return {valid, errors} where valid is true iff errors is empty; errors
// holds 'key: message' strings in schema key order, at most one per field.
// Messages: required, wrong type, too short, too long, below min, above max.
// Missing/undefined optional fields are ignored; null and nonfinite numbers
// produce wrong type. If min and max both fail, report the min failure.
// Primitive data (or null) with a required key yields a required error.
// Hint: an absent key, null and wrong-type values each need their own
// branch; and undefined fails 'required' even when a default type exists.
// Run with: node 80-validation-schema.js
const assert = require("node:assert/strict");
function validate(schema, data) {
  // your code here
  throw new Error("TODO: validate");
}
const schema = {
  name: { type: "string", required: true, min: 2 },
  age: { type: "number", min: 0, max: 130 },
  email: {},
};
assert.deepEqual(validate(schema, { name: "Li", age: 30 }), { valid: true, errors: [] });
const bad = validate(schema, { name: "A", age: -1 });
assert.equal(bad.valid, false);
assert.deepEqual(bad.errors, ["name: too short", "age: below min"]);
assert.equal(validate(schema, null).valid, false);
console.log("80 sample checks passed");
