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
eq(status(),"South:C");change('City',"C");eq(status(),"South:C");change('Region',"North");eq(status(),"North:B");change('City','Shared');change('Region','South');eq(status(),"South:Shared");change('Region','Empty');eq(status(),'Empty:-');eq(input('City').disabled,true);change('Region','North');eq(input('City').disabled,false);eq(status(),'North:B');deep(Array.from(input('City').options).map(x=>x.value),["Shared","A","B"]);click('Reset');eq(status(),"South:C");
} finally {for(const restore of after.reverse())restore();}
};
