// 2648: Cursor-page boundary metadata / cursor-key-fields=name+active
// cursor key projections; exact optional pagination unions
export type Row={ name: string; active: boolean }&{readonly payload:unknown};
export type Cursor={ readonly name: string; readonly active: boolean };
export type Page={items:readonly Row[];hasMore:false;next?:never}|{items:readonly Row[];hasMore:true;next:Cursor};
export function solve(rows:readonly Row[],limit:number): Page {
  // TODO: implement the public contract without changing its signature.
  throw new Error('TODO exercise 2648');
}
