import {solve} from '../solutions/1283';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
type Event={kind:'text';text:string}|{kind:'count';count:number};const rows:Event[]=[{kind:'text',text:'a'},{kind:'count',count:1}];const out=solve(rows,'text');const exact:{kind:'text';text:string}[]=out;void exact;
