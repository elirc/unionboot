// 2487: Completion-gated immutable builders / builder-required-fields=name+tags
// phantom missing-key sets; conditional method availability
export type Model={ name: string; tags: readonly string[] };
export type Builder<Missing extends keyof Model>={set:<K extends Missing>(key:K,value:Model[K])=>Builder<Exclude<Missing,K>>}&([Missing] extends [never]?{build:()=>Model}:{});
export function solve(): Builder<keyof Model> {
  function make(data:Partial<Model>):unknown{return {set:(key:keyof Model,value:Model[keyof Model])=>make({...data,[key]:value}),build:()=>{for(const key of ["name","tags"])if(!Object.hasOwn(data,key))throw new Error('Incomplete builder');return {...data};}};}return make({}) as Builder<keyof Model>;
}
