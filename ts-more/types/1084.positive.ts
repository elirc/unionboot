import {solve, Settings, Patch} from '../solutions/1084';
type Assert<T extends true> = T;
type NotAny<T> = 0 extends (1 & T) ? false : true;
type SafeFunction = Assert<NotAny<typeof solve>>;
const settings:Settings={name:'a',retries:2,enabled:true};const patch:Patch={enabled:false};const out:Settings=solve(settings,patch);solve(settings,{});void out;
