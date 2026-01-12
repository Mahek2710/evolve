import assert from "assert";
import { Problem } from "../types/problem";

const starterCode = `function twoSum(numbers, target) {
  // Write your code here
};`;

const handler = (fn:any) => {
	try {
		assert.deepStrictEqual(fn([2,7,11,15],9),[1,2]);
		return true;
	} catch(e:any){ throw new Error(e); }
};

export const twoSumII: Problem = {
	id:"two-sum-ii",
	title:"Two Sum II",
	difficulty:"Medium",
	category:"Two Pointers",
	problemStatement:`<p>Two sum on sorted array.</p>`,
	examples:[{id:1,inputText:"[2,7,11,15],9",outputText:"[1,2]"}],
	constraints:`<li>Exactly one solution</li>`,
	starterCode,
	handlerFunction: handler,
	starterFunctionName:"function twoSum(",
	order:15,
};
