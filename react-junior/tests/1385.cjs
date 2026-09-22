const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={"seedRows":[{"id":1,"name":"Pen","quantity":2},{"id":2,"name":"Book","quantity":1}]};
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
assert.equal(status('Total'),'3');change('Pen qty','5');assert.equal(status('Total'),'6');change('Pen name','Pencil');assert.ok(field('Pencil qty'));assert.ok(view.queryByLabelText('Pen qty')===null);click('Snapshot');const before=JSON.parse(status('Snapshot'));change('Pencil qty','9');assert.equal(status('Total'),'10');assert.deepEqual(JSON.parse(status('Snapshot')),before);click('Remove Pencil');assert.equal(status('Total'),'1');click('Add row');assert.ok(field('Row qty'));
};
