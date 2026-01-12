import assert from "assert";
import { Problem } from "../types/problem";

/* =========================
   STARTER CODE
========================= */
const starterCodeJumpGame = `function canJump(nums) {
  // Write your code here
};`;

/* =========================
   HANDLER FUNCTION
========================= */
const handlerJumpGame = (fn: any) => {
	try {
		const tests = [
			[2, 3, 1, 1, 4],
			[3, 2, 1, 0, 4],
			[2, 0, 0],
			[2, 5, 0, 0],
		];

		const answers = [true, false, true, true];

		for (let i = 0; i < tests.length; i++) {
			const result = fn(tests[i]);
			assert.strictEqual(result, answers[i]);
		}

		return true;
	} catch (error: any) {
		throw new Error(error);
	}
};

/* =========================
   PROBLEM EXPORT
========================= */
export const jumpGame: Problem = {
	id: "jump-game",
	title: "Jump Game",

	difficulty: "Medium",
	category: "Greedy",

	problemStatement: `
<p class='mt-3'>
	You are given an integer array <code>nums</code>. You are initially positioned at the
	<strong>first index</strong>, and each element in the array represents your maximum jump length
	at that position.
</p>
<p class='mt-3'>
	Return <code>true</code> if you can reach the last index, or <code>false</code> otherwise.
</p>
	`,

	examples: [
		{
			id: 1,
			inputText: "nums = [2,3,1,1,4]",
			outputText: "true",
			explanation:
				"Jump 1 step from index 0 to 1, then 3 steps to the last index.",
		},
		{
			id: 2,
			inputText: "nums = [3,2,1,0,4]",
			outputText: "false",
			explanation:
				"You will always arrive at index 3. Its maximum jump length is 0, making it impossible to reach the last index.",
		},
	],

	constraints: `
<li>1 ≤ nums.length ≤ 10⁴</li>
<li>0 ≤ nums[i] ≤ 10⁵</li>
	`,

	starterCode: starterCodeJumpGame,
	handlerFunction: handlerJumpGame,
	starterFunctionName: "function canJump(",
	order: 3,
};
