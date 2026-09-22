// 1264: Key-correlated event publisher / scenario 01
// keyof event maps; NoInfer payloads; callbacks
// Publish exactly once to the supplied transport callback. Event names constrain their payload shape; a closed event still requires the explicit undefined argument. Preserve payload reference. No external effects except invoking send; propagate send errors.
// Scenario family repetition is intentional; see prompts/1264.txt and tests/1264.cjs.
export type Events={saved:{id:string}; progress:{completed:number;total:number}; closed:undefined};
export function solve<K extends keyof Events>(event:K, payload:NoInfer<Events[K]>, send:(event:K,payload:Events[K])=>void): void {
  send(event,payload);
}
