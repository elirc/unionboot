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
eq(button('Next').disabled,true);change('Name','xxxxx');eq(button('Next').disabled,true);click('Next');assert.ok(input('Name'));change('Name'," a ");eq(button('Next').disabled,false);click('Next');assert.ok(view.getByText("Review: a"));eq(view.queryByLabelText('Name'),null);click('Back');eq(input('Name').value," a ");click('Next');click('Finish');eq(status(),"Saved: A");eq(view.queryByLabelText('Name'),null);eq(view.queryByRole('button',{name:'Back'}),null);eq(view.queryByRole('button',{name:'Finish'}),null);click('Start over');eq(input('Name').value,'');eq(button('Next').disabled,true);change('Name','bbbb');eq(button('Next').disabled,false);click('Next');click('Start over');eq(input('Name').value,'');eq(button('Next').disabled,true);
} finally {for(const restore of after.reverse())restore();}
};
