// 2383: Exhaustive handler-table dispatch / handled-variants=count+tags
// mapped handler tables; complete coverage; return correlations
export type Payloads={ count: number; tags: readonly string[] };
export type Handlers={[K in keyof Payloads]:(value:Payloads[K])=>string};
export type Message={[K in keyof Payloads]:{kind:K;value:Payloads[K]}}[keyof Payloads];
export function solve(message:Message,handlers:Handlers): string {
  const kind=message.kind;switch(kind){case "count":return handlers.count(message.value);case "tags":return handlers.tags(message.value);default:{const impossible:never=kind;return impossible;}}
}
