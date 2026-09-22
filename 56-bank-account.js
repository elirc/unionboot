// Exercise 56 — Bank account with private fields (classes, getters, errors)
// Build BankAccount with:
//   - a PRIVATE balance (#balance), starts at 0
//   - deposit(amount) / withdraw(amount) — throw Error on bad amounts
//   - a `balance` GETTER (read allowed, direct write impossible)
//   - a transaction history array of { type, amount, balance }
//   - static fromSnapshot({ balance, history }) to rebuild an account
//
// Run with:  node 56-bank-account.js

class BankAccount {
  // your code here
}

const acct = new BankAccount("Ada");
acct.deposit(100);
acct.withdraw(30);
console.log(acct.balance); // expected: 70
console.log(acct.history.length); // expected: 2
console.log(acct.history[0]); // expected: { type: 'deposit', amount: 100, balance: 100 }

try {
  acct.withdraw(1000);
} catch (e) {
  console.log("caught:", e.message); // expected: caught: Insufficient funds
}
try {
  acct.deposit(-5);
} catch (e) {
  console.log("caught:", e.message); // expected: caught: Amount must be positive
}

const restored = BankAccount.fromSnapshot({ balance: 70, history: acct.history });
console.log(restored.balance); // expected: 70
