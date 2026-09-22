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
const check=value=>{eq(view.getByLabelText('Primary').textContent,value);eq(view.getByLabelText('Mirror').textContent,value);};check("low");for(const expected of ["normal","high","low","normal"]){click('Next');check(expected);}fireEvent.click(input('Locked'));eq(button('Next').disabled,true);eq(button('Reset').disabled,true);click('Next');check("normal");fireEvent.click(input('Locked'));click('Reset');check("low");const fresh=render(React.createElement(Component));eq(fresh.container.querySelector('output').textContent,"low");fireEvent.click(view.container.querySelector('button'));eq(fresh.container.querySelector('output').textContent,"low");fresh.unmount();
} finally {for(const restore of after.reverse())restore();}
};
