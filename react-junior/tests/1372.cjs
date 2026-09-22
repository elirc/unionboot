const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={"people":["Ada","Bo","Cy"]};Object.freeze(props.people);
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
const names=n=>within(view.getByRole('list',{name:n})).queryAllByRole('listitem').map(x=>x.firstChild.textContent);assert.deepEqual(names('Available'),['Ada','Bo','Cy']);assert.equal(status(),'0');click('Assign Bo');click('Assign Ada');assert.deepEqual(names('Assigned'),['Bo','Ada']);assert.deepEqual(names('Available'),['Cy']);assert.equal(status(),'2');click('Return Bo');assert.deepEqual(names('Available'),['Cy','Bo']);assert.deepEqual(names('Assigned'),['Ada']);click('Assign Bo');assert.deepEqual(names('Assigned'),['Ada','Bo']);assert.deepEqual(props.people,['Ada','Bo','Cy']);
};
