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
const tags=()=>view.queryAllByRole('listitem').map(x=>x.querySelector('span').textContent);const add=value=>{change('Tag',value);fireEvent.submit(view.container.querySelector('form'));};eq(status(),'4');add(' ');eq(view.getByRole('alert').textContent,'empty');eq(input('Tag').value,' ');add('xxxxx');eq(view.getByRole('alert').textContent,'long');add(' zo ');deep(tags(),['zo']);eq(input('Tag').value,'');eq(view.queryByRole('alert'),null);add('ZO');deep(tags(),["ZO","zo"]);click('Clear all');deep(tags(),[]);eq(view.queryByRole('alert'),null);for(const value of ["z","b","a","c"])add(value);deep(tags(),["a","b","c","z"]);eq(status(),'0');add('new');eq(view.getByRole('alert').textContent,'full');eq(input('Tag').value,'new');add('z');eq(view.getByRole('alert').textContent,'duplicate');fireEvent.click(view.getByRole('button',{name:'Remove z'}));eq(status(),'1');eq(view.queryByRole('alert'),null);add('new');eq(status(),'0');change('Tag','draft');click('Clear all');eq(input('Tag').value,'draft');deep(tags(),[]);eq(status(),'4');
} finally {for(const restore of after.reverse())restore();}
};
