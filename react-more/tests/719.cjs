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
const check=value=>{eq(view.getByLabelText('Primary').textContent,value);eq(view.getByLabelText('Mirror').textContent,value);};check("system");for(const expected of ["light","dark","system","light"]){click('Next');check(expected);}fireEvent.click(input('Locked'));eq(button('Next').disabled,true);eq(button('Previous').disabled,true);click('Next');check("light");fireEvent.click(input('Locked'));click('Previous');check("system");const fresh=render(React.createElement(Component));eq(fresh.container.querySelector('output').textContent,"system");fireEvent.click(view.container.querySelector('button'));eq(fresh.container.querySelector('output').textContent,"system");fresh.unmount();
} finally {for(const restore of after.reverse())restore();}
};
