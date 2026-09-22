const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={};const added=[],removed=[];const oldAdd=window.addEventListener,oldRemove=window.removeEventListener;window.addEventListener=function(type,fn,...rest){if(type==='focus'||type==='blur')added.push([type,fn]);return oldAdd.call(this,type,fn,...rest);};window.removeEventListener=function(type,fn,...rest){if(type==='focus'||type==='blur')removed.push([type,fn]);return oldRemove.call(this,type,fn,...rest);};
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
assert.equal(status(),'focused');click('Blur now');assert.equal(status(),'blur');click('Focus now');assert.equal(status(),'focused');fireEvent.blur(window);assert.equal(status(),'blur');view.unmount();fireEvent.focus(window);assert.equal(document.body.textContent,'');for(const [type,listener] of added)assert.ok(removed.some(([t,l])=>t===type&&l===listener),'listener removed: '+type);
};
