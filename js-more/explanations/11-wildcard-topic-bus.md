# Wildcard topic bus — js-more 1819–1828

**What you practise:** a publish/subscribe bus with segment wildcards, a snapshotted dispatch that survives subscribers mutating the listener list mid-flight, and an error policy.
**Prerequisites:** closures over a shared array; default parameter values; `try`/`catch` around a callback; [10 JSON wildcard selection](10-json-wildcard-selection.md) for segment-by-segment matching.
**Exercises:** 1819: order=forward; live=false; errors=collect, 1820: order=forward; live=true; errors=collect, 1821: order=reverse; live=false; errors=collect, 1822: order=reverse; live=true; errors=collect, 1823: order=priority; live=false; errors=collect, 1824: order=priority; live=true; errors=collect, 1825: order=forward; live=false; errors=throw, 1826: order=forward; live=true; errors=throw, 1827: order=priority; live=false; errors=throw, 1828: order=priority; live=true; errors=throw.

## The problem in plain words

This family has no input value. `solve()` is a factory: it returns a fresh bus with two methods, `subscribe(pattern, callback, priority = 0)` and `emit(topic, value)`.

Topics are dotted strings such as `a.b.c`. A pattern is a topic with wildcards: `*` matches exactly one segment, and a terminal `**` matches zero or more remaining segments. So `a.*` matches `a.b` but not `a` and not `a.b.c`; `a.**` matches `a`, `a.b` and `a.b.c`; `**` matches everything.

`subscribe` returns an unsubscribe function, and calling it twice must be harmless. `emit` calls every matching listener with `(value, topic)` and returns `{delivered, errors}`.

"Policy" is three knobs. `order` is the dispatch order — registration order, reverse registration order, or priority descending with registration order as the tie-break. `live` decides what happens when a callback unsubscribes another listener *during* a dispatch: with `live: false` the listener still fires because it was in the snapshot, with `live: true` it is skipped. `errors` decides whether a throwing callback aborts the emit or has its message collected.

One rule holds in every variant: a listener subscribed during a dispatch never joins that dispatch.

## The contract you must honour

Taken from `prompts/1819.txt` and `tests/1819.cjs`:

- `solve()` takes no argument and returns `{subscribe, emit}`. Each call is a separate bus — the test ends with `deep(solve().emit('x',0),{delivered:0,errors:[]})`, a fresh bus with no listeners.
- `emit` returns `{delivered, errors}`: a count and an array of message strings. An emit with no matching listener is `{delivered:0,errors:[]}`.
- `delivered` counts the callbacks that were invoked, "including throwing callbacks". The error case asserts `{delivered:1,errors:['boom']}` for a single listener that throws.
- `errors` holds message strings, not `Error` objects. The reference builds them with `String(error.message || error)`.
- `priority` defaults to `0`.
- Unsubscribe is idempotent. The test calls `offB()` inside a callback and again afterwards.
- The wildcard rules are exercised by the registration list `[['a.*','single',1],['a.**','many',3],['**','all',2],['a','exact',0]]` against two topics, `a.b` and `a`.
- `check` is defined in the test but this family's assertions use `deep` directly, since there is no input object to clone.
- The prompt's CONTRACT adds the usual source-review clause. The structural requirement here is the snapshot: the listener set is fixed before the first callback runs.

## Approach

1. Keep `let serial = 0` and `const listeners = []`. A record is `{pattern, callback, priority, serial, active}`.
2. `subscribe` pushes a record and returns `() => { item.active = false; }`. Nothing is spliced out of `listeners`, which makes the unsubscribe idempotent by construction and keeps the serials meaning "registration order" forever.
3. `matches(pattern, topic)` splits both on `.` and walks the pattern segments:
   - `'**'` returns `true` immediately — it absorbs everything left, including nothing.
   - running past the end of the topic returns `false`.
   - a segment that is neither `'*'` nor equal to the topic's segment returns `false`.
   - falling out of the loop means every pattern segment matched, so the lengths must be equal for the match to be exact.
4. `emit` builds the snapshot first: `listeners.filter(item => item.active && matches(item.pattern, topic))`, then sorts it according to `cfg.order`. Both steps happen before any callback runs, which is what keeps a subscribing callback out of the current dispatch.
5. Walk the snapshot. Under `cfg.live`, re-check `item.active` and `continue` if it has been turned off since the snapshot. Otherwise increment `delivered` and call the callback inside a `try`. On a throw, either rethrow (`errors: 'throw'`) or push the message and carry on.

Matching is O(segments) per listener per emit, and the sort is O(k log k) in the number of matches. A production bus would index listeners by their literal prefix; the flat scan is the clearer statement of the matching rules.

## Worked example — 1819 Wildcard topic bus / scenario 1

The registrations, quoted from line 9 of `tests/1819.cjs`:

```js
const registrations=[['a.*','single',1],['a.**','many',3],['**','all',2],['a','exact',0]];
for(const [pattern,id,priority] of registrations)bus.subscribe(pattern,(value,topic)=>calls.push([id,value,topic]),priority);
```

So the bus holds four records with serials 0 to 3 and priorities 1, 3, 2, 0.

**First, `bus.emit('a.b',7)`.** The topic splits to `['a','b']`. Matching, one pattern at a time:

| Serial | Pattern | Segments | Walk | Match? |
| --- | --- | --- | --- | --- |
| 0 | `a.*` | `['a','*']` | `a` equals `a`; `*` matches `b`; lengths 2 and 2 agree | yes |
| 1 | `a.**` | `['a','**']` | `a` equals `a`; `**` returns true at once | yes |
| 2 | `**` | `['**']` | `**` returns true at once | yes |
| 3 | `a` | `['a']` | `a` equals `a`; loop ends; lengths 1 and 2 differ | no |

Three matches. Under `cfg.order: 'forward'` the snapshot sorts by `serial` ascending: `single`, `many`, `all`. The dispatch pushes

```js
[['single',7,'a.b'],['many',7,'a.b'],['all',7,'a.b']]
```

and `emit` returns `{delivered:3,errors:[]}`. The test asserts both, the second against `sorted(registrations.slice(0,3)).map(x=>[x[1],7,'a.b'])`.

**Then, `bus.emit('a',8)`.** The topic splits to `['a']`.

| Serial | Pattern | Walk | Match? |
| --- | --- | --- | --- |
| 0 | `a.*` | `a` equals `a`; at `i = 1` the topic has run out, so `i >= topicSegments.length` returns false | no |
| 1 | `a.**` | `a` equals `a`; `**` absorbs zero remaining segments | yes |
| 2 | `**` | true at once | yes |
| 3 | `a` | `a` equals `a`; lengths 1 and 1 agree | yes |

Three again, but a different three: `many`, `all`, `exact`. This pair of emits is what pins down the difference between `*` and `**` — `a.*` requires a second segment, `a.**` does not.

Under `cfg.order: 'priority'` (1823) the same two emits dispatch in a different order: for `a.b` it is `many`(3), `all`(2), `single`(1); for `a` it is `many`(3), `all`(2), `exact`(0).

**The mutation case**, quoted from line 10 of the test:

```js
const mutation=solve(),log=[];let offB;const a=()=>{log.push('A');offB();mutation.subscribe('x',()=>log.push('late'));};
if(cfg.order==='reverse'){offB=mutation.subscribe('x',()=>log.push('B'));mutation.subscribe('x',a);}
else{mutation.subscribe('x',a,9);offB=mutation.subscribe('x',()=>log.push('B'));}
mutation.emit('x',0);deep(log,cfg.live?['A']:['A','B']);
```

For scenario 1 the `else` branch runs: `a` is subscribed with priority 9 and serial 0, the `B` listener with serial 1. Both patterns are the literal `x`, so both match.

| Step | What happens |
| --- | --- |
| `emit('x',0)` | snapshot is built: `[a, B]`, both active, sorted forward by serial |
| dispatch `a` | `delivered` becomes 1; the callback pushes `'A'`, calls `offB()` — which sets the `B` record's `active` to `false` — and subscribes a third listener that would push `'late'` |
| dispatch `B` | `cfg.live` is `false`, so `item.active` is not re-read; `delivered` becomes 2 and `'B'` is pushed |
| return | `log` is `['A','B']` |

The `late` listener never runs, in any scenario: it was pushed onto `listeners` after the snapshot was taken, and the loop is walking the snapshot.

Under 1820 (`live: true`) the second row changes: `item.active` is `false`, so the listener is skipped by `continue` *before* `delivered++`, and `log` is `['A']`. That single `continue` is the whole difference between the two files.

**The error case**, on line 11:

```js
const broken=solve();broken.subscribe('x',()=>{throw Error('boom');});
if(cfg.errors==='throw')assert.throws(()=>broken.emit('x',1),/boom/);
else deep(broken.emit('x',1),{delivered:1,errors:['boom']});
```

Under `errors: 'collect'`, `delivered` is incremented before the call, the `catch` pushes `String(error.message || error)` — `'boom'` — and the loop continues to the (empty) rest of the snapshot. Under 1825 the same `catch` rethrows and `emit` never returns.

The reference solution, as it now reads in `solutions/1819.cjs`:

```js
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
```

## Policy matrix — what changes between the variants

Three knobs, ten of the twelve combinations: `errors: 'throw'` ships only with `order` `forward` or `priority`.

| ID | Variant | What differs in the prompt | What differs in the code |
| --- | --- | --- | --- |
| 1819 | order=forward; live=false; errors=collect | `{"errors":"collect","live":false,"order":"forward"}` | sort by `serial` ascending; snapshot honoured; `catch` pushes the message |
| 1820 | order=forward; live=true; errors=collect | `…"live":true` | same sort; `if (cfg.live && !item.active) continue` now skips |
| 1821 | order=reverse; live=false; errors=collect | `…"order":"reverse"` | sort by `serial` descending |
| 1822 | order=reverse; live=true; errors=collect | `…"order":"reverse","live":true` | descending serial, and the live skip |
| 1823 | order=priority; live=false; errors=collect | `…"order":"priority"` | sort by `priority` descending, `serial` ascending as the tie-break |
| 1824 | order=priority; live=true; errors=collect | `…"order":"priority","live":true` | priority sort, and the live skip |
| 1825 | order=forward; live=false; errors=throw | `…"errors":"throw"` | `catch` rethrows, so `emit` propagates and returns nothing |
| 1826 | order=forward; live=true; errors=throw | `…"live":true,"errors":"throw"` | live skip, and the rethrow |
| 1827 | order=priority; live=false; errors=throw | `…"order":"priority","errors":"throw"` | priority sort, and the rethrow |
| 1828 | order=priority; live=true; errors=throw | `…"order":"priority","live":true,"errors":"throw"` | priority sort, live skip, rethrow |

The test file adapts to `order`: under `reverse` it registers the mutating callback *second* so that it still runs first, which is why the mutation case exercises the same behaviour in every scenario.

## Pitfalls the tests are designed to catch

- **Dispatching over `listeners` directly.** A callback that subscribes would then extend the array being iterated and join the current dispatch, pushing `'late'` into the log. The snapshot is the fix.
- **Splicing on unsubscribe.** Removing the record shifts the array during a dispatch, and a second call to the unsubscribe function would remove an innocent listener. Flip a flag instead.
- **Filtering after sorting, or sorting `listeners` itself.** The sort must be on the snapshot; sorting the live array permanently reorders registration order and breaks the `serial` tie-break.
- **Counting `delivered` after the callback.** A throwing callback must still be counted — the error case asserts `delivered: 1`.
- **Counting a live-skipped listener.** Under `live: true` the `continue` comes before `delivered++`; `log` being `['A']` with `delivered` 2 would be wrong.
- **Pushing the `Error` object into `errors`.** The assertion is `errors:['boom']`, an array of strings.
- **Letting `a.*` match `a`.** The pattern has two segments and the topic has one; the `i >= topicSegments.length` guard is what rejects it. Without that check, `patternSegments[1] !== topicSegments[1]` compares `'*'` against `undefined` and the `'*'` branch would wave it through.
- **Letting `a.**` fail to match `a`.** `**` matches zero or more segments, so it returns `true` at the point it is reached, before any length check.
- **Sharing state between buses.** `listeners` and `serial` live inside `topicBus`, so each `solve()` call gets its own. A module-level array would make the final `solve().emit('x',0)` report a non-zero `delivered`.

## Try it yourself

1. Add a `once(pattern, callback)` that unsubscribes itself after its first delivery. Does it need to behave differently under `live: true`?
2. Make `emit` return the ids of the listeners that threw, alongside the messages. Where does the id have to come from, given that `subscribe` does not take one?
3. Index the listeners by their first literal segment so that `emit('a.b')` does not scan patterns that start with another literal. Which patterns have to stay in a catch-all bucket?
4. In words: `subscribe` never removes anything from `listeners`, so the array grows forever. Describe what would have to change to reclaim unsubscribed records without breaking the snapshot rule or the `serial` ordering.
