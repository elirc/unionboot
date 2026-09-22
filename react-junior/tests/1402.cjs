const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={};
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
const items=()=>within(view.getByRole('list',{name:'Fruits'})).getAllByRole('button');const focusables=()=>items().filter(x=>x.tabIndex===0).map(x=>x.textContent);assert.deepEqual(focusables(),['Apple']);fireEvent.keyDown(items()[0],{key:'ArrowDown'});assert.equal(status(),'Banana');assert.deepEqual(focusables(),['Banana']);assert.equal(document.activeElement,items()[1]);fireEvent.keyDown(items()[1],{key:'ArrowUp'});fireEvent.keyDown(items()[0],{key:'ArrowUp'});assert.equal(status(),'Apple');fireEvent.keyDown(items()[0],{key:'End'});assert.equal(status(),'Date');fireEvent.keyDown(items()[3],{key:'Home'});assert.equal(status(),'Apple');fireEvent.click(items()[2]);assert.equal(status(),'Cherry');assert.deepEqual(focusables(),['Cherry']);assert.equal(document.activeElement,items()[2]);
};
