'use strict';
const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual,after=[];
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}

freeze(props);
try {
const view=render(React.createElement(Component,props));
const button=name=>view.getByRole('button',{name,exact:true}),click=name=>fireEvent.click(button(name));
const input=label=>view.getByLabelText(label,{exact:true}),change=(label,value)=>fireEvent.change(input(label),{target:{value}});
const status=()=>view.getByRole('status').textContent,list=()=>view.queryAllByRole('listitem').map(x=>x.textContent);
const all=input('All');eq(status(),"");eq(all.indeterminate,false);eq(all.checked,false);eq(all.disabled,true);for(const i of [1,2,3,4]){eq(input('Item'+i).disabled,true);fireEvent.click(input('Item'+i));eq(input('Item'+i).checked,false);}click('Clear');fireEvent.click(all);eq(status(),'');eq(all.checked,false);eq(all.indeterminate,false);
} finally {for(const restore of after.reverse())restore();}
};
