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
let expected=-2;eq(status(),String(expected));for(const action of ['Add','Add','Add','Add','Remove','Remove','Remove','Remove','Remove','Remove','Remove']){click(action);const next=expected+(action==='Add'?3:-3);expected=Math.max(-5,Math.min(0,next));eq(status(),String(expected));eq(button('Add').disabled,expected===0);eq(button('Remove').disabled,expected===-5);}click('Reset');eq(status(),'-2');
} finally {for(const restore of after.reverse())restore();}
};
