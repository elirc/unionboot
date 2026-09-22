// 2375: Exhaustive handler-table dispatch / handled-variants=count
// mapped handler tables; complete coverage; return correlations
export type Payloads={ count: number };
export type Handlers={[K in keyof Payloads]:(value:Payloads[K])=>string};
export type Message={[K in keyof Payloads]:{kind:K;value:Payloads[K]}}[keyof Payloads];
export function solve(message:Message,handlers:Handlers): string {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2375');
}
