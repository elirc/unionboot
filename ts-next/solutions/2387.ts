// 2387: Exhaustive handler-table dispatch / handled-variants=count+active+tags
// mapped handler tables; complete coverage; return correlations
export type Payloads={ count: number; active: boolean; tags: readonly string[] };
export type Handlers={[K in keyof Payloads]:(value:Payloads[K])=>string};
export type Message={[K in keyof Payloads]:{kind:K;value:Payloads[K]}}[keyof Payloads];
export function solve(message:Message,handlers:Handlers): string {
  const kind=message.kind;switch(kind){case "count":return handlers.count(message.value);case "active":return handlers.active(message.value);case "tags":return handlers.tags(message.value);default:{const impossible:never=kind;return impossible;}}
}
