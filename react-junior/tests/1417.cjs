const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={"items":[{"id":"a","name":"A"},{"id":"b","name":"B"},{"id":"c","name":"C"}]};
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
assert.equal(status(),'None');click('Pick A');assert.equal(status(),'A');view.rerender(React.createElement(Component,{items:[...props.items].reverse()}));assert.equal(status(),'A');view.rerender(React.createElement(Component,{items:[...props.items,{id:'d',name:'D'}]}));assert.equal(status(),'A');view.rerender(React.createElement(Component,{items:[{id:'b',name:'B'},{id:'d',name:'D'}]}));assert.equal(status(),'None');view.rerender(React.createElement(Component,{items:props.items}));assert.equal(status(),'None');view.rerender(React.createElement(Component,{items:[{id:'d',name:'D'},{id:'b',name:'B'}]}));click('Pick D');view.rerender(React.createElement(Component,{items:[{id:'b',name:'B'},{id:'d',name:'D'}]}));assert.equal(status(),'D');
};
