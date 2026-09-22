// 2657: Cursor-page boundary metadata / cursor-key-fields=count+active+tags
// cursor key projections; exact optional pagination unions
export type Row={ count: number; active: boolean; tags: readonly string[] }&{readonly payload:unknown};
export type Cursor={ readonly count: number; readonly active: boolean; readonly tags: readonly string[] };
export type Page={items:readonly Row[];hasMore:false;next?:never}|{items:readonly Row[];hasMore:true;next:Cursor};
export function solve(rows:readonly Row[],limit:number): Page {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2657');
}
