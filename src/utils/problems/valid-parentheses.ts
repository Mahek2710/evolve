import assert from "assert";
import { Problem } from "../types/problem";

/* =========================
   STARTER CODE
========================= */
const starterCodeValidParentheses = `function validParentheses(s) {
  // Write your code here
};`;

/* =========================
   HANDLER FUNCTION
========================= */
const handlerValidParentheses = (fn: any) => {
	try {
		const tests = ["()", "()[]{}", "(]", "([)]", "{[]}"];
		const answers = [true, true, false, false, true];

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
export const validParentheses: Problem = {
	id: "valid-parentheses",
	title: "Valid Parentheses",

	difficulty: "Easy",
	category: "Stack",

	problemStatement: `
<p class='mt-3'>
	Given a string <code>s</code> containing just the characters
	<code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>,
	<code>'['</code> and <code>']'</code>, determine if the input string is valid.
</p>
<p class='mt-3'>An input string is valid if:</p>
<ul>
	<li>Open brackets must be closed by the same type of brackets.</li>
	<li>Open brackets must be closed in the correct order.</li>
	<li>Every close bracket has a corresponding open bracket of the same type.</li>
</ul>
	`,

	examples: [
		{
			id: 1,
			inputText: 's = "()"',
			outputText: "true",
		},
		{
			id: 2,
			inputText: 's = "()[]{}"',
			outputText: "true",
		},
		{
			id: 3,
			inputText: 's = "(]"',
			outputText: "false",
		},
		{
			id: 4,
			inputText: 's = "([)]"',
			outputText: "false",
		},
	],

	constraints: `
<li>1 ≤ s.length ≤ 10⁴</li>
<li>s consists of parentheses only: <code>()[]{}</code></li>
	`,

	handlerFunction: handlerValidParentheses,
	starterCode: starterCodeValidParentheses,
	starterFunctionName: "function validParentheses(",
	order: 4,
};
