const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={"rows":[{"id":"a","name":"Zoe","score":1},{"id":"b","name":"Ada","score":3},{"id":"c","name":"Bo","score":2}]};
const view=render(React.createElement(Component,props));
const names=()=>view.getAllByRole('row').slice(1).map(r=>r.cells[0].textContent);assert.deepEqual(names(),["Zoe","Bo","Ada"]);fireEvent.click(view.getByText('Score'));assert.deepEqual(names(),["Ada","Bo","Zoe"]);fireEvent.click(view.getByText('Score'));assert.deepEqual(names(),["Zoe","Bo","Ada"]);
view.unmount();const fresh=render(React.createElement(Component,{...props,key:'new-seed',seed:1}));assert.ok(fresh.container.textContent.length>0);fresh.unmount();
};
