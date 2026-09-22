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
const all=input('All');eq(status(),"");eq(all.indeterminate,false);eq(all.checked,false);eq(all.disabled,false);for(const i of [2]){eq(input('Item'+i).disabled,true);fireEvent.click(input('Item'+i));eq(input('Item'+i).checked,false);}click('Clear');fireEvent.click(input('Item3'));eq(all.indeterminate,true);eq(all.checked,false);fireEvent.click(all);eq(status(),"1,3");if(!all.checked)fireEvent.click(all);eq(all.checked,true);eq(all.indeterminate,false);for(const i of [1,3])eq(input('Item'+i).checked,true);fireEvent.click(all);eq(status(),'');eq(all.checked,false);eq(all.indeterminate,false);
} finally {for(const restore of after.reverse())restore();}
};
