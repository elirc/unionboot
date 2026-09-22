// Exercise 20 — Async waterfall (promises & async/await)
// You get these fake API calls (they resolve after a short delay):
//
// Run with:  node 20-async-sequence.js

function fetchUser(id) {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ id, name: "Ada" }), 100)
  );
}
function fetchPosts(user) {
  return new Promise((resolve) =>
    setTimeout(() => resolve([`post by ${user.name} #1`, `post by ${user.name} #2`]), 100)
  );
}
function fetchComments(posts) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(posts.map((p) => `comment on "${p}"`)), 100)
  );
}

// YOUR TASK: log, in order:
//   [ 'comment on "post by Ada #1"', 'comment on "post by Ada #2"' ]
// Fetch the user 1 → fetch their posts → fetch comments on those posts.
// Then re-do it WITHOUT async/await, using .then() chaining only.
// Both versions must print the same array.
