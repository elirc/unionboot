const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={"tree":[{"id":1,"name":"src","children":[{"id":2,"name":"index.js"},{"id":3,"name":"components","children":[{"id":4,"name":"Button.jsx"}]}]},{"id":5,"name":"readme.md"}]};
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
const lists=view.getAllByRole('list');assert.equal(view.queryByText('index.js'),null);click('src');assert.ok(view.getByText('src'));assert.equal(view.getByRole('button',{name:'src'}).getAttribute('aria-expanded'),'true');assert.ok(view.getByText('index.js'));assert.ok(view.getByText('components'));click('components');assert.ok(view.getByText('Button.jsx'));click('src');assert.equal(view.queryByText('components'),null);assert.ok(view.getByText('readme.md'));
};
