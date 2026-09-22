const assert=require('node:assert/strict');
const {within}=require('@testing-library/react');
module.exports=async({Component,React,render,fireEvent,act,clock})=>{
const props={"initialNames":["Ada","Bo","Cy"]};
const view=render(React.createElement(Component,props));
const status=(name)=>view.getByRole('status',{name:name===undefined?'':name}).textContent;
const click=n=>fireEvent.click(view.getByRole('button',{name:n}));
const button=n=>view.getByRole('button',{name:n});
const field=n=>view.getByLabelText(n);
const change=(n,v)=>fireEvent.change(field(n),{target:{value:v}});
const items=()=>view.getAllByRole('listitem').map(x=>x.textContent);assert.equal(status(),'3');change('New name',' Zed ');click('Add to top');assert.deepEqual(items(),['1 Zedx','2 Adax','3 Box','4 Cyx']);assert.equal(field('New name').value,'');change('New name','  ');click('Add to top');assert.equal(status(),'4');change('New name','zed');click('Add to top');assert.equal(status(),'4');assert.equal(field('New name').value,'zed');click('Remove Ada');assert.equal(status(),'3');assert.deepEqual(items(),['1 Zedx','2 Box','3 Cyx']);assert.deepEqual(props.initialNames,['Ada','Bo','Cy']);
};
