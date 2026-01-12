import assert from "assert";
import { Problem } from "../types/problem";

const starterCode = `function maxSubArray(nums) {
  // Write your code here
};`;

const handler = (fn:any) => {
	try {
		assert.strictEqual(fn([-2,1,-3,4,-1,2,1,-5,4]), 6);
		return true;
	} catch(e:any) {
		throw new Error(e);
	}
};

export const maximumSubarray: Problem = {
	id: "maximum-subarray",
	title: "Maximum Subarray",
	difficulty: "Medium",
	category: "Dynamic Programming",
	problemStatement: `<p>Find the contiguous subarray with the largest sum.</p>`,
	examples: [
		{ id: 1, inputText: "[-2,1,-3,4,-1,2,1,-5,4]", outputText: "6" },
	],
	constraints: `<li>1 ≤ nums.length ≤ 10⁵</li>`,
	starterCode,
	handlerFunction: handler,
	starterFunctionName: "function maxSubArray(",
	order: 9,
};
