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
eq(status(),'');for(const invalid of ['   ',"aaa","aaaaaaaaa","7777"]){change('Name',invalid);eq(button('Submit').disabled,true);fireEvent.submit(view.container.querySelector('form'));eq(status(),'');}change('Name'," aaaa ");eq(button('Submit').disabled,false);click('Submit');eq(status(),"aaaa");eq(input('Name').value,'');eq(button('Submit').disabled,true);change('Name',"aaaaaaaa");eq(button('Submit').disabled,false);click('Submit');eq(status(),"aaaaaaaa");change('Name',' ');fireEvent.submit(view.container.querySelector('form'));eq(status(),"aaaaaaaa");
} finally {for(const restore of after.reverse())restore();}
};
