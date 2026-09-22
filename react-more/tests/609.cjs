'use strict';
const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual,after=[];
const props={"items":["Alpha","Beta","Alphabet","alpha","Delta","Alpha"]};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}

freeze(props);
try {
const view=render(React.createElement(Component,props));
const button=name=>view.getByRole('button',{name,exact:true}),click=name=>fireEvent.click(button(name));
const input=label=>view.getByLabelText(label,{exact:true}),change=(label,value)=>fireEvent.change(input(label),{target:{value}});
const status=()=>view.getByRole('status').textContent,list=()=>view.queryAllByRole('listitem').map(x=>x.textContent);
for(const [q,expected] of [["",["Alpha","Beta","Alphabet","alpha","Delta"]],["Al",[]],["a",["Alpha","Beta","alpha","Delta"]],[" AL ",[]],["zz",[]]]){change('Search',q);deep(list(),expected);eq(status(),String(expected.length));}change('Search','');view.rerender(React.createElement(Component,{items:[]}));deep(list(),[]);eq(status(),'0');view.rerender(React.createElement(Component,props));deep(list(),["Alpha","Beta","Alphabet","alpha","Delta"]);deep(props.items,["Alpha","Beta","Alphabet","alpha","Delta","Alpha"]);
} finally {for(const restore of after.reverse())restore();}
};
