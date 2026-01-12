import assert from "assert";
import { Problem } from "../types/problem";

/* =========================
   STARTER CODE
========================= */
const starterCodeTwoSum = `function twoSum(nums, target) {
  // Write your code here
};`;

/* =========================
   HANDLER FUNCTION
========================= */
const handlerTwoSum = (fn: any) => {
	try {
		const nums = [
			[2, 7, 11, 15],
			[3, 2, 4],
			[3, 3],
		];

		const targets = [9, 6, 6];
		const answers = [
			[0, 1],
			[1, 2],
			[0, 1],
		];

		for (let i = 0; i < nums.length; i++) {
			const result = fn(nums[i], targets[i]);
			assert.deepStrictEqual(result, answers[i]);
		}

		return true;
	} catch (error: any) {
		throw new Error(error);
	}
};

/* =========================
   PROBLEM EXPORT
========================= */
export const twoSum: Problem = {
	id: "two-sum",
	title: "Two Sum",

	difficulty: "Easy",
	category: "Array / Hashing",

	problemStatement: `
<p class='mt-3'>
	Given an array of integers <code>nums</code> and an integer <code>target</code>,
	return the indices of the two numbers such that they add up to <code>target</code>.
</p>
<p class='mt-3'>
	You may assume that each input would have <strong>exactly one solution</strong>,
	and you may not use the same element twice.
</p>
<p class='mt-3'>You can return the answer in any order.</p>
	`,

	examples: [
		{
			id: 1,
			inputText: "nums = [2,7,11,15], target = 9",
			outputText: "[0,1]",
			explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
		},
		{
			id: 2,
			inputText: "nums = [3,2,4], target = 6",
			outputText: "[1,2]",
		},
		{
			id: 3,
			inputText: "nums = [3,3], target = 6",
			outputText: "[0,1]",
		},
	],

	constraints: `
<li>2 ≤ nums.length ≤ 10</li>
<li>-10 ≤ nums[i] ≤ 10</li>
<li>-10 ≤ target ≤ 10</li>
<li><strong>Only one valid answer exists.</strong></li>
	`,

	handlerFunction: handlerTwoSum,
	starterCode: starterCodeTwoSum,
	order: 1,
	starterFunctionName: "function twoSum(",
};
