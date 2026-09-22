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
eq(input('Text').value,'start');eq(status(),'1');eq(button('Undo').disabled,true);eq(button('Redo').disabled,true);change('Text'," start ");eq(status(),'1');eq(input('Text').value,'start');change('Text','');eq(input('Text').value,"start");eq(status(),'1');click('Clear history');for(const text of ['a','b','c','d','e','f','g'])change('Text',text);eq(status(),'4');eq(input('Text').value,'g');for(let i=0;i<10;i++)click('Undo');eq(input('Text').value,'d');eq(button('Undo').disabled,true);click('Redo');eq(input('Text').value,'e');click('Undo');change('Text','branch');eq(input('Text').value,'branch');eq(button('Redo').disabled,true);eq(status(),'2');click('Clear history');eq(status(),'1');eq(input('Text').value,'branch');eq(button('Undo').disabled,true);eq(button('Redo').disabled,true);
} finally {for(const restore of after.reverse())restore();}
};
