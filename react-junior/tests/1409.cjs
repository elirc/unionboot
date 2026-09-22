const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={};window.sessionStorage.clear();window.sessionStorage.setItem('draft-junior','preset');
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
assert.equal(field('Text').value,'preset');change('Text','persisted');view.unmount();const second=render(React.createElement(Component,{}));assert.equal(second.getByLabelText('Text').value,'persisted');fireEvent.change(second.getByLabelText('Text'),{target:{value:'typed'}});assert.equal(window.sessionStorage.getItem('draft-junior'),'typed');fireEvent.click(second.getByText('Clear draft'));assert.equal(second.getByLabelText('Text').value,'');assert.equal(window.sessionStorage.getItem('draft-junior'),null);second.unmount();const proto=window.Storage.prototype;const old=Object.fromEntries(['getItem','setItem','removeItem'].map(k=>[k,proto[k]]));try{for(const k of Object.keys(old))proto[k]=()=>{throw new Error('blocked');};const third=render(React.createElement(Component,{}));const input=within(third.container).getByLabelText('Text');assert.equal(input.value,'');fireEvent.change(input,{target:{value:'still works'}});assert.equal(within(third.container).getByRole('status').textContent,'still works');fireEvent.click(within(third.container).getByRole('button',{name:'Clear draft'}));assert.equal(input.value,'');third.unmount();}finally{Object.assign(proto,old);}
};
