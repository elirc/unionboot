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
eq(status(),'Abc');click('Edit');eq(input('Name').value,'Abc');eq(document.activeElement,input('Name'));for(const value of [' ',"xxxxxxxx"]){change('Name',value);eq(button('Save').disabled,true);fireEvent.submit(view.container.querySelector('form'));assert.ok(input('Name'));}change('Name','discard');fireEvent.keyDown(input('Name'),{key:'Escape'});eq(status(),'Abc');eq(document.activeElement,button('Edit'));click('Edit');eq(input('Name').value,'Abc');change('Name'," bb ");eq(button('Save').disabled,false);fireEvent.keyDown(input('Name'),{key:'Enter'});eq(status(),"bb");eq(document.activeElement,button('Edit'));click('Edit');eq(input('Name').value,"bb");eq(button('Save').disabled,true);change('Name','other');click('Cancel');eq(status(),"bb");eq(document.activeElement,button('Edit'));
} finally {for(const restore of after.reverse())restore();}
};
