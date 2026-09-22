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
eq(status(),'');for(const invalid of ['   ',"a","aaaaaa","77"]){change('Name',invalid);eq(button('Submit').disabled,true);fireEvent.submit(view.container.querySelector('form'));eq(status(),'');}change('Name'," aa ");eq(button('Submit').disabled,false);click('Submit');eq(status(),"AA");eq(input('Name').value,'');eq(button('Submit').disabled,true);change('Name',"aaaaa");eq(button('Submit').disabled,false);click('Submit');eq(status(),"AAAAA");change('Name',' ');fireEvent.submit(view.container.querySelector('form'));eq(status(),"AAAAA");
} finally {for(const restore of after.reverse())restore();}
};
