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
const check=value=>{eq(view.getByLabelText('Primary').textContent,value);eq(view.getByLabelText('Mirror').textContent,value);};check("quiet");for(const expected of ["verbose","quiet","verbose"]){click('Next');check(expected);}fireEvent.click(input('Locked'));eq(button('Next').disabled,true);eq(button('Reset').disabled,true);click('Next');check("verbose");fireEvent.click(input('Locked'));click('Reset');check("quiet");const fresh=render(React.createElement(Component));eq(fresh.container.querySelector('output').textContent,"quiet");fireEvent.click(view.container.querySelector('button'));eq(fresh.container.querySelector('output').textContent,"quiet");fresh.unmount();
} finally {for(const restore of after.reverse())restore();}
};
