// 2651: Cursor-page boundary metadata / cursor-key-fields=tags
// cursor key projections; exact optional pagination unions
export type Row={ tags: readonly string[] }&{readonly payload:unknown};
export type Cursor={ readonly tags: readonly string[] };
export type Page={items:readonly Row[];hasMore:false;next?:never}|{items:readonly Row[];hasMore:true;next:Cursor};
export function solve(rows:readonly Row[],limit:number): Page {
  if(!Number.isSafeInteger(limit)||limit<1)throw new Error('Invalid limit');const items=rows.slice(0,limit);if(rows.length<=limit)return {items,hasMore:false};const last=items[items.length-1]!;return {items,hasMore:true,next:{tags:last.tags}};
}
