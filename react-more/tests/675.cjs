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
eq(status(),'3');click('Delete');assert.ok(view.getByRole('dialog',{name:'Confirm removal'}));eq(document.activeElement,input('Confirmation'));eq(button('Confirm').disabled,true);change('Confirmation','wrong');click('Confirm');eq(status(),'3');change('Confirmation'," DELETE ");eq(button('Confirm').disabled,false);click('Cancel');eq(status(),'3');eq(document.activeElement,button('Delete'));click('Delete');eq(input('Confirmation').value,'');fireEvent.keyDown(input('Confirmation'),{key:'Escape'});eq(view.queryByRole('dialog'),null);click('Delete');change('Confirmation',"delete");eq(button('Confirm').disabled,true);change('Confirmation',"DELETE");click('Confirm');eq(status(),'2');eq(view.queryByRole('dialog'),null);for(let i=0;i<3;i++){if(button('Delete').disabled)break;click('Delete');change('Confirmation',"DELETE");click('Confirm');}eq(status(),'0');eq(button('Delete').disabled,true);
} finally {for(const restore of after.reverse())restore();}
};
