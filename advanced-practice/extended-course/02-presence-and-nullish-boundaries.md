# 02. Presence is a separate question from value

Read [own-property path lookup](../../69-object-path.js), [the three-way merge prompt](../../js-capstones/prompts/3439.txt), and [the existing boundary lab](../merge-boundaries.test.cjs). These files intentionally have different value domains. Exercise 69 allows an existing final property containing undefined, null, or false. Capstone 3439 restricts stored values to strings. An absence representation that is safe for one domain can collide with a valid value in the other.

## Four questions hidden in one expression

When you evaluate record[key], you perform property lookup. Ordinary lookup can consult the prototype chain. When you ask Object.hasOwn(record, key), you ask whether that particular object owns a property. When you use a truthiness check, you classify the retrieved value as truthy or falsy. When you apply nullish coalescing, you ask whether the value is null or undefined. These operations answer different questions even when simple examples produce the same result.

The empty string is falsy but not nullish. Therefore an empty string survives nullish coalescing but is replaced by the fallback of logical OR. Zero and false behave the same way in this respect. Undefined is nullish whether it came from a missing property or an explicitly stored value. Nullish coalescing cannot recover the ownership information that was lost when those cases became the same read result.

The inherited name toString is another useful counterexample. An empty ordinary object does not own that property, yet ordinary lookup usually reaches a function on Object.prototype. A path lookup restricted to own properties must reject that step. A check that only asks whether the retrieved value is undefined accidentally treats inherited members as legitimate data.

## Worked trace: a final undefined is not a missing step

Use root equal to an object containing profile, where profile owns middle with value undefined. For path profile then middle, the first step reaches an owned object. The second step reaches an owned property whose value is undefined. There are no remaining path segments, so exercise 69 returns undefined exactly. The fallback is not used.

Now append initial as a third segment. After the second step, the traversal value is undefined. It is not a non-null object or array, so it cannot be traversed. The third step fails and the fallback is returned. The difference is not the existence of the middle property; it exists in both calls. The difference is whether an additional traversal is required after reading its value.

An empty path returns root itself. This matters for primitive roots too: no traversal takes place. Do not reject a primitive at function entry if the path is empty. Validate traversability at each required step. Exercise 69 also excludes functions from traversal even though functions can have own properties in JavaScript. Respect the stated boundary instead of broadening it because a language feature makes a broader implementation possible.

## Choosing an absence representation

For the string-only merge, undefined can represent missing internally if every read first checks ownership. Stored undefined is outside that capstone's domain. A fresh symbol is another unambiguous internal representation. A string such as absent is unsafe because the domain permits that exact string as stored data. Choosing a longer or more unusual string only makes the collision less common; it does not remove it.

For path lookup, a returned undefined may be a valid result, so a caller cannot infer failure solely by inspecting the result. The specified API lets the caller provide a fallback. A caller that needs a guaranteed distinction can provide a fresh symbol outside its expected data domain. A different application might return an object with found and value fields. That is a possible redesign, not the signature demanded by exercise 69.

Presence also interacts with dangerous-looking property names. Capstone 3439 says that an own enumerable __proto__ key is ordinary data. Reading it safely is only half the problem. Writing it onto an ordinary object with a simple assignment can invoke inherited setter behavior instead of creating the intended own data property. A correct implementation must choose a safe construction technique and then verify ownership in the output. An empty-looking printed object does not prove the key was retained.

## Laboratory: build a presence matrix

In a scratch file create four records: one without the key, one with an empty string, one with the literal absent, and one with an inherited property but no own property. Keep the inherited example out of any test that claims to represent an allowed own stored value. Compare ordinary lookup, Object.hasOwn, logical OR, and nullish coalescing. Your table should have four rows and four observations per row.

Add a separate exercise 69 table for own undefined, own null, own false, own zero, an empty path, and a path attempting to continue through a primitive. Use a fresh symbol as the fallback so failure cannot be confused with a common string value. Assert equality by identity for the symbol. For empty path on an object, assert that the exact root reference is returned, not a clone.

Finally, parse a JSON object containing an own __proto__ string key. Confirm ownership before and after your independently implemented string-only merge. Do not write to Object.prototype. This test is about representing a legitimate property, not modifying shared language globals. Compare output keys and descriptors if a failure is confusing.

## Debugging case: a fallback that seems to work

An implementation reads each side of a merge using record[key] followed by nullish coalescing to the string absent. A tester changes a value from hello to an empty string and sees the expected result. They conclude the absence encoding is safe. The test only establishes that nullish coalescing preserves the empty string. Replace hello with the literal absent on one side and remove the property on another. The representation now collapses distinct states. The diagnosis must name the actual collision; blaming empty strings would teach the wrong language rule.

## Graded exercises

**C02-A:** Complete the two matrices and explain three pairs of operations that disagree. Six points require accurate observations and reasons, including ownership versus lookup.

**C02-B:** Implement the exercise 69 contract independently. Five points require correct final undefined, rejection of inherited traversal, identity on empty path, and nonmutation. Add two points for a test involving a primitive root with an empty path.

**C02-C:** Construct the smallest string-sentinel collision in a three-way merge. Four points require a predicted wrong result, an observed failure, and a repair that does not change the string-only contract.

**C02-D:** Design a new path API returning found and value. Compare its caller behavior with the existing fallback signature. Three points require explaining a benefit and a cost without pretending that one interface is universally best.

## Hints, before the review

For C02-B, check traversability before every requested step, then ownership, then read. For C02-C, absence must participate in equality comparisons as a real state. For C02-D, consider destructuring, allocation, and a caller that already owns an impossible fallback marker. Consult [the review](reviews/02-presence-and-nullish-boundaries.md) after committing to your own answers.
