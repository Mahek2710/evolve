import assert from "assert";
import { Problem } from "../types/problem";

const starterCode = `function containsDuplicate(nums) {
  // Write your code here
};`;

const handler = (fn:any) => {
	try {
		assert.strictEqual(fn([1,2,3,1]), true);
		assert.strictEqual(fn([1,2,3,4]), false);
		return true;
	} catch(e:any) {
		throw new Error(e);
	}
};

export const containsDuplicate: Problem = {
	id: "contains-duplicate",
	title: "Contains Duplicate",
	difficulty: "Easy",
	category: "Hashing",
	problemStatement: `<p>Return true if any value appears at least twice.</p>`,
	examples: [
		{ id: 1, inputText: "[1,2,3,1]", outputText: "true" },
	],
	constraints: `<li>1 ≤ nums.length ≤ 10⁵</li>`,
	starterCode,
	handlerFunction: handler,
	starterFunctionName: "function containsDuplicate(",
	order: 7,
};
