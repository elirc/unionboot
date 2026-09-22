'use strict';
const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const eq=assert.equal,deep=assert.deepEqual,after=[];
const props={"items":["Item1","Item2","Item3","Item4","Item5","Item6","Item7","Item8","Item9","Item10","Item11"]};
function freeze(x){if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;}

freeze(props);
try {
const view=render(React.createElement(Component,props));
const button=name=>view.getByRole('button',{name,exact:true}),click=name=>fireEvent.click(button(name));
const input=label=>view.getByLabelText(label,{exact:true}),change=(label,value)=>fireEvent.change(input(label),{target:{value}});
const status=()=>view.getByRole('status').textContent,list=()=>view.queryAllByRole('listitem').map(x=>x.textContent);
eq(status(),'2');deep(list(),["Item5","Item6","Item7","Item8"]);click('Last');eq(status(),'3');deep(list(),["Item9","Item10","Item11"]);eq(button('Last').disabled,true);eq(button('Next').disabled,false);click('Next');eq(status(),'1');click('First');eq(status(),'1');eq(button('Prev').disabled,false);click('Prev');eq(status(),'3');click('Last');view.rerender(React.createElement(Component,{items:['only']}));eq(status(),'1');deep(list(),['only']);for(const name of ['First','Prev','Next','Last'])eq(button(name).disabled,true);view.rerender(React.createElement(Component,props));eq(status(),'1');view.rerender(React.createElement(Component,{items:[]}));eq(status(),'1');deep(list(),[]);eq(button('Next').disabled,true);
} finally {for(const restore of after.reverse())restore();}
};
