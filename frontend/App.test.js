import React from "react";
import Component, {decVal, incVal} from "./App";
import {expect} from "chai";

it(`${Component.name} renders without crashing`, () => {
  shallow(<Component />);
});

// describe("Local State", () => {
//   it("decval works", () => {
//     const state = { passedVal: 0}
//     const newState = decVal(state);
//     expect(newState.passedVal).to.equal(-1);
//   });


//   it('incval works', () => {
//     const state = { passedVal: 0}
//     const newState = incVal(state);
//     expect(newState.passedVal).to.equal(1);
//   });
// })