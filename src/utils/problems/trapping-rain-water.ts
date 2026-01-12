import assert from "assert";
import { Problem } from "../types/problem";

const starterCode = `function trap(height) {
  // Write your code here
};`;

const handler = (fn:any) => {
	try {
		assert.strictEqual(fn([0,1,0,2,1,0,1,3,2,1,2,1]),6);
		return true;
	} catch(e:any){ throw new Error(e); }
};

export const trappingRainWater: Problem = {
	id:"trapping-rain-water",
	title:"Trapping Rain Water",
	difficulty:"Hard",
	category:"Two Pointers",
	problemStatement:`<p>Compute trapped rainwater.</p>`,
	examples:[{id:1,inputText:"[0,1,0,2...]",outputText:"6"}],
	constraints:`<li>n ≤ 10⁴</li>`,
	starterCode,
	handlerFunction: handler,
	starterFunctionName:"function trap(",
	order:19,
};
