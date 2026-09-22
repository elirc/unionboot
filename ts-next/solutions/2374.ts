// 2374: Exhaustive handler-table dispatch / handled-variants=name
// mapped handler tables; complete coverage; return correlations
export type Payloads={ name: string };
export type Handlers={[K in keyof Payloads]:(value:Payloads[K])=>string};
export type Message={[K in keyof Payloads]:{kind:K;value:Payloads[K]}}[keyof Payloads];
export function solve(message:Message,handlers:Handlers): string {
  const kind=message.kind;switch(kind){case "name":return handlers.name(message.value);default:{const impossible:never=kind;return impossible;}}
}
