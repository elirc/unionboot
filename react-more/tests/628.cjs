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
const tabs=view.getAllByRole('tab'),names=['Red','Green','Blue'];let selected=0,focused=0;eq(view.getByRole('tablist').getAttribute('aria-orientation'),'horizontal');const check=()=>{eq(view.getByRole('tabpanel').textContent,names[selected]);tabs.forEach((t,i)=>{eq(t.tabIndex,i===focused?0:-1);eq(t.getAttribute('aria-selected'),String(i===selected));});};check();eq(tabs[1].disabled,true);tabs[focused].focus();for(const [key,target] of [["ArrowRight",2],["ArrowRight",0],["Home",0],["End",2],["ArrowUp",2]]){fireEvent.keyDown(tabs[focused],{key});focused=target;selected=target;check();eq(document.activeElement,tabs[focused]);}fireEvent.click(tabs[0]);selected=focused=0;check();eq(document.activeElement,tabs[focused]);
} finally {for(const restore of after.reverse())restore();}
};
