'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { validate } = require('./verify.cjs');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'unionboot-question-check-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const banks = ['frontend-web', 'backend-delivery'].map((name, bank) => ({
    name,
    rows: Array.from({ length: 260 }, (_, i) => ({
      id: 'FS' + String(bank * 260 + i + 1).padStart(3, '0'),
      section: 'Synthetic section ' + Math.floor(i / 10),
      question: 'Synthetic validator fixture question number ' + (bank * 260 + i + 1) + '?',
      answer: 'This is synthetic test data for checking the validator only. It is not curriculum content and it does not assert any factual teaching claim about web development.',
      level: 'test-fixture'
    }))
  }));
  function save() {
    for (const { name, rows } of banks) {
      fs.writeFileSync(path.join(root, name + '.json'), JSON.stringify(rows));
      fs.writeFileSync(path.join(root, name + '.txt'), rows.map(r => [r.id, r.question, r.answer].join('\n')).join('\n\n'));
    }
  }
  save();
  return { root, banks, save };
}

test('accepts complete inventory with matching text editions', t => {
  const { root } = fixture(t);
  assert.deepEqual(validate(root), { questions: 520, sections: 52, first: 'FS001', last: 'FS520' });
});
test('rejects missing content rather than reporting partial success', t => {
  const { root } = fixture(t);
  fs.unlinkSync(path.join(root, 'backend-delivery.json'));
  assert.throws(() => validate(root), /ENOENT/);
});
test('rejects duplicate questions across the two banks', t => {
  const f = fixture(t);
  f.banks[1].rows[0].question = f.banks[0].rows[0].question.toUpperCase();
  f.save();
  assert.throws(() => validate(f.root), /duplicate question/);
});
test('rejects missing IDs and short answers', t => {
  const f = fixture(t);
  f.banks[0].rows[0].id = 'FS002';
  f.save();
  assert.throws(() => validate(f.root), /Missing or out-of-order ID/);
  f.banks[0].rows[0].id = 'FS001';
  f.banks[0].rows[0].answer = 'Too brief.';
  f.save();
  assert.throws(() => validate(f.root), /answer too short/);
});
test('rejects text edition drift', t => {
  const f = fixture(t);
  fs.writeFileSync(path.join(f.root, 'frontend-web.txt'), 'Incomplete edition');
  assert.throws(() => validate(f.root), /text\/JSON mismatch/);
});
test('rejects incorrect section sizes even when total remains 260', t => {
  const f = fixture(t);
  f.banks[0].rows[0].section = f.banks[0].rows[10].section;
  f.save();
  assert.throws(() => validate(f.root), /expected 10 questions/);
});
