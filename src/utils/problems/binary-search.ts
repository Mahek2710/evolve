import assert from "assert";
import { Problem } from "../types/problem";

const starterCode = `function search(nums, target) {
  // Write your code here
};`;

const handler = (fn:any) => {
	try {
		assert.strictEqual(fn([-1,0,3,5,9,12], 9), 4);
		assert.strictEqual(fn([-1,0,3,5,9,12], 2), -1);
		return true;
	} catch(e:any) {
		throw new Error(e);
	}
};

export const binarySearch: Problem = {
	id: "binary-search",
	title: "Binary Search",
	difficulty: "Medium",
	category: "Binary Search",
	problemStatement: `<p>Return the index of target if found, else -1.</p>`,
	examples: [
		{ id: 1, inputText: "nums=[-1,0,3,5,9,12], target=9", outputText: "4" },
	],
	constraints: `<li>nums is sorted</li>`,
	starterCode,
	handlerFunction: handler,
	starterFunctionName: "function search(",
	order: 8,
};
