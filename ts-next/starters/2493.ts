// 2493: Completion-gated immutable builders / builder-required-fields=name+count+active+tags
// phantom missing-key sets; conditional method availability
export type Model={ name: string; count: number; active: boolean; tags: readonly string[] };
export type Builder<Missing extends keyof Model>={set:<K extends Missing>(key:K,value:Model[K])=>Builder<Exclude<Missing,K>>}&([Missing] extends [never]?{build:()=>Model}:{});
export function solve(): Builder<keyof Model> {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2493');
}
