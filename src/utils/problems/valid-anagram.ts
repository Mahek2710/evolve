import assert from "assert";
import { Problem } from "../types/problem";

const starterCode = `function isAnagram(s, t) {
  // Write your code here
};`;

const handler = (fn:any) => {
	try {
		assert.strictEqual(fn("anagram","nagaram"), true);
		assert.strictEqual(fn("rat","car"), false);
		return true;
	} catch(e:any){ throw new Error(e); }
};

export const validAnagram: Problem = {
	id: "valid-anagram",
	title: "Valid Anagram",
	difficulty: "Easy",
	category: "Hashing",
	problemStatement: `<p>Check if two strings are anagrams.</p>`,
	examples: [{ id:1, inputText:"s=anagram, t=nagaram", outputText:"true" }],
	constraints:`<li>1 ≤ s.length, t.length ≤ 10⁵</li>`,
	starterCode,
	handlerFunction: handler,
	starterFunctionName: "function isAnagram(",
	order: 11,
};
