'use strict';
const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual,after=[];
const props={};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}
const added=[],removed=[];const add=document.addEventListener,remove=document.removeEventListener;document.addEventListener=function(type,fn,...rest){if(type==='keydown')added.push(fn);return add.call(this,type,fn,...rest);};document.removeEventListener=function(type,fn,...rest){if(type==='keydown')removed.push(fn);return remove.call(this,type,fn,...rest);};after.push(()=>{document.addEventListener=add;document.removeEventListener=remove;});
freeze(props);
try {
const view=render(React.createElement(Component,props));
const button=name=>view.getByRole('button',{name,exact:true}),click=name=>fireEvent.click(button(name));
const input=label=>view.getByLabelText(label,{exact:true}),change=(label,value)=>fireEvent.change(input(label),{target:{value}});
const status=()=>view.getByRole('status').textContent,list=()=>view.queryAllByRole('listitem').map(x=>x.textContent);
eq(status(),'closed');eq(added.length,1);click('Open');eq(status(),'open');fireEvent.keyDown(document,{key:'x'});eq(status(),'open');fireEvent.keyDown(document,{key:'Escape',ctrlKey:true});eq(status(),'open');const blocked=new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true});blocked.preventDefault();fireEvent(document,blocked);eq(status(),'open');fireEvent.keyDown(input('Notes'),{key:'Escape'});eq(status(),'closed');click('Open');for(let i=0;i<3;i++){fireEvent.keyDown(document,{key:'Escape'});eq(status(),'closed');eq(view.queryByText('Panel content'),null);click('Open');eq(status(),'open');}eq(added.length,1);view.unmount();eq(removed.length,1);eq(removed[0],added[0]);fireEvent.keyDown(document,{key:'Escape'});
} finally {for(const restore of after.reverse())restore();}
};
