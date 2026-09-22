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
let chosen=[];const check=()=>{eq(status(),chosen.join(','));for(const name of ['A','B','C','D']){eq(input(name).checked,chosen.includes(name));eq(input(name).disabled,name==="B"||(!chosen.includes(name)&&chosen.length>=2));}};check();for(const name of ["D","C","A"]){if(chosen.includes(name))continue;fireEvent.click(input(name));if(chosen.length<2)chosen.push(name);check();}const removed=chosen[0];fireEvent.click(input(removed));chosen=chosen.filter(x=>x!==removed);check();fireEvent.click(input(removed));chosen.push(removed);check();for(const name of [...chosen]){fireEvent.click(input(name));chosen=chosen.filter(x=>x!==name);check();}
} finally {for(const restore of after.reverse())restore();}
};
