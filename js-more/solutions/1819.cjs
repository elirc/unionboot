// 1819 Wildcard topic bus / scenario 1 — order=forward; live=false; errors=collect
// Prompt: ../prompts/1819.txt
'use strict';
const cfg={"order":"forward","live":false,"errors":"collect"};
// Why this works:
// A publish/subscribe bus. listeners is one flat array of records; each record
// carries its pattern, callback, priority, a registration serial and an active
// flag. Nothing is ever removed from the array: unsubscribing flips active to
// false, which makes the returned function idempotent and keeps the serials
// stable as registration order.
// matches() walks the pattern segments against the topic segments. A '*' segment
// matches any single segment; a '**' segment matches everything from there on,
// so it returns true immediately. Falling out of the loop means every segment
// matched, and the lengths must then agree for the pattern to match exactly.
// emit() takes a snapshot first: it filters and sorts the matching listeners
// before calling any of them. That is what makes dispatch stable -- a callback
// that subscribes during the dispatch cannot join it, because the new record is
// pushed onto listeners and not onto the snapshot.
// cfg.order decides the dispatch order: registration order, reverse registration
// order, or priority descending with registration order as the tie-break.
// cfg.live decides what a mid-dispatch unsubscribe means: with live false the
// snapshot is honoured and an already-snapshotted listener still fires; with
// live true its active flag is re-read and it is skipped.
// cfg.errors decides what a throwing callback does: 'throw' propagates out of
// emit, 'collect' records the message and continues. Either way the throwing
// callback has already been counted in delivered.
function topicBus() {
  let serial = 0;
  const listeners = [];
  const matches = (pattern, topic) => {
    const patternSegments = pattern.split('.');
    const topicSegments = topic.split('.');
    for (let i = 0; i < patternSegments.length; i++) {
      if (patternSegments[i] === '**') return true;
      if (i >= topicSegments.length) return false;
      if (patternSegments[i] !== '*' && patternSegments[i] !== topicSegments[i]) return false;
    }
    return patternSegments.length === topicSegments.length;
  };
  return {
    subscribe(pattern, callback, priority = 0) {
      const item = {pattern, callback, priority, serial: serial++, active: true};
      listeners.push(item);
      return () => { item.active = false; };
    },
    emit(topic, value) {
      const snapshot = listeners.filter(item => item.active && matches(item.pattern, topic));
      snapshot.sort((left, right) =>
        cfg.order === 'priority' ? right.priority - left.priority || left.serial - right.serial :
        cfg.order === 'reverse' ? right.serial - left.serial :
        left.serial - right.serial);
      const errors = [];
      let delivered = 0;
      for (const item of snapshot) {
        if (cfg.live && !item.active) continue;
        delivered++;
        try {
          item.callback(value, topic);
        } catch (error) {
          if (cfg.errors === 'throw') throw error;
          errors.push(String(error.message || error));
        }
      }
      return {delivered, errors};
    },
  };
}
module.exports=topicBus;
