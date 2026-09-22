const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={"people":[{"id":1,"name":"A","role":"r1"},{"id":2,"name":"B","role":"r2"},{"id":3,"name":"C","role":"r3"},{"id":4,"name":"D","role":"r4"},{"id":5,"name":"E","role":"r5"},{"id":6,"name":"F","role":"r6"},{"id":7,"name":"G","role":"r7"}]};
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
const page=()=>status('Page');const cells=()=>view.getAllByRole('row').slice(1).map(r=>r.cells[0].textContent);assert.equal(page(),'1');assert.deepEqual(cells(),['A','B','C']);click('Next');assert.equal(page(),'2');assert.deepEqual(cells(),['D','E','F']);click('Jump to last');assert.equal(page(),'3');assert.equal(button('Next').disabled,true);assert.deepEqual(cells(),['G']);view.rerender(React.createElement(Component,{people:props.people.slice(0,2)}));assert.equal(page(),'1');assert.deepEqual(cells(),['A','B']);assert.equal(button('Prev').disabled,true);
};
