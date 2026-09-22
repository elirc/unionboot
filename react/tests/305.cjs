const assert=require('node:assert/strict');
module.exports=async({Component,React,render,fireEvent,act})=>{
const props={};
const view=render(React.createElement(Component,props));
const tabs=view.getAllByRole('tab');assert.equal(view.getByRole('tabpanel').textContent,'Green');fireEvent.keyDown(tabs[1],{key:'ArrowRight'});assert.equal(view.getByRole('tabpanel').textContent,'Blue');assert.equal(document.activeElement,tabs[2]);fireEvent.click(tabs[0]);assert.equal(tabs[0].getAttribute('aria-selected'),'true');

};
