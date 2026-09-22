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
const a=input('First'),b=input('Second'),target=input('Second'),other=input('First');eq(a.value,'alpha');eq(b.value,'beta');click('Focus');eq(document.activeElement,target);eq(target.selectionStart,0);eq(target.selectionEnd,4);eq(a.value,'alpha');eq(b.value,'beta');fireEvent.click(input('Lock target'));eq(target.disabled,true);eq(button('Focus').disabled,true);click('Clear');eq(a.value,"");eq(b.value,"");eq(document.activeElement,a);eq(input('Lock target').checked,true);fireEvent.click(input('Lock target'));change('First','one');change('Second','two');click('Focus');eq(document.activeElement,target);eq(a.value,'one');eq(b.value,'two');
} finally {for(const restore of after.reverse())restore();}
};
