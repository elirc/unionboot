'use strict';
// Structural checks for a study question bank, not an executable-skills grader.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

function validate(root = __dirname) {
  const specs = [
    { name: 'frontend-web', first: 1 },
    { name: 'backend-delivery', first: 261 }
  ];
  const questions = new Set();
  let total = 0;
  const sections = new Set();
  for (const spec of specs) {
    const rows = JSON.parse(fs.readFileSync(path.join(root, spec.name + '.json'), 'utf8'));
    const text = fs.readFileSync(path.join(root, spec.name + '.txt'), 'utf8').replace(/\s+/g, ' ');
    assert.ok(Array.isArray(rows), spec.name + ': expected an array');
    assert.equal(rows.length, 260, spec.name + ': expected 260 questions');
    const counts = new Map();
    for (const [index, row] of rows.entries()) {
      const expected = 'FS' + String(spec.first + index).padStart(3, '0');
      assert.equal(row.id, expected, 'Missing or out-of-order ID');
      for (const key of ['section', 'question', 'answer', 'level']) {
        assert.equal(typeof row[key], 'string', expected + ': missing ' + key);
        assert.ok(row[key].trim().length > 0, expected + ': empty ' + key);
      }
      assert.ok(row.question.trim().length >= 20, expected + ': question too short');
      assert.ok(row.answer.trim().split(/\s+/).length >= 25, expected + ': answer too short');
      const normalized = row.question.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
      assert.ok(!questions.has(normalized), expected + ': duplicate question');
      questions.add(normalized);
      counts.set(row.section, (counts.get(row.section) || 0) + 1);
      sections.add(spec.name + '/' + row.section);
      for (const value of [row.id, row.question, row.answer]) {
        // Whitespace-only layout differences are allowed in the readable edition.
        assert.ok(text.includes(value.replace(/\s+/g, ' ')), expected + ': text/JSON mismatch');
      }
      total++;
    }
    assert.equal(counts.size, 26, spec.name + ': expected 26 sections');
    for (const [section, count] of counts) assert.equal(count, 10, section + ': expected 10 questions');
  }
  assert.equal(total, 520);
  return { questions: total, sections: sections.size, first: 'FS001', last: 'FS520' };
}

module.exports = { validate };
if (require.main === module) {
  if (process.argv.length !== 2) {
    console.error('Usage: node fullstack-questions/verify.cjs');
    process.exitCode = 2;
  } else {
    try {
      console.log(JSON.stringify(validate(), null, 2));
      console.log('Structural validation passed. This does not prove factual correctness or grade learner answers.');
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
