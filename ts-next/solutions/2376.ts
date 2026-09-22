// 2376: Exhaustive handler-table dispatch / handled-variants=name+count
// mapped handler tables; complete coverage; return correlations
export type Payloads={ name: string; count: number };
export type Handlers={[K in keyof Payloads]:(value:Payloads[K])=>string};
export type Message={[K in keyof Payloads]:{kind:K;value:Payloads[K]}}[keyof Payloads];
export function solve(message:Message,handlers:Handlers): string {
  const kind=message.kind;switch(kind){case "name":return handlers.name(message.value);case "count":return handlers.count(message.value);default:{const impossible:never=kind;return impossible;}}
}
