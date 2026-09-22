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
const check=selected=>{for(let i=0;i<3;i++){const name=['One','Two','Three'][i];eq(button(name).getAttribute('aria-expanded'),String(i===selected));const panel=view.queryByText(name+' content');eq(!!panel,i===selected);if(i===selected)eq(button(name).getAttribute('aria-controls'),panel.id);}};check(null);eq(button('One').disabled,true);click('One');check(null);click('Two');check(1);click('Three');check(2);click('Three');check(null);click('Two');check(1);
} finally {for(const restore of after.reverse())restore();}
};
