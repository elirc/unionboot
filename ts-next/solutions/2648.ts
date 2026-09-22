// 2648: Cursor-page boundary metadata / cursor-key-fields=name+active
// cursor key projections; exact optional pagination unions
export type Row={ name: string; active: boolean }&{readonly payload:unknown};
export type Cursor={ readonly name: string; readonly active: boolean };
export type Page={items:readonly Row[];hasMore:false;next?:never}|{items:readonly Row[];hasMore:true;next:Cursor};
export function solve(rows:readonly Row[],limit:number): Page {
  if(!Number.isSafeInteger(limit)||limit<1)throw new Error('Invalid limit');const items=rows.slice(0,limit);if(rows.length<=limit)return {items,hasMore:false};const last=items[items.length-1]!;return {items,hasMore:true,next:{name:last.name,active:last.active}};
}
