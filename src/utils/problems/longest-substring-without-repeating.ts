import assert from "assert";
import { Problem } from "../types/problem";

const starterCode = `function lengthOfLongestSubstring(s) {
  // Write your code here
};`;

const handler = (fn:any) => {
	try {
		assert.strictEqual(fn("abcabcbb"),3);
		return true;
	} catch(e:any){ throw new Error(e); }
};

export const longestSubstring: Problem = {
	id:"longest-substring-without-repeating",
	title:"Longest Substring Without Repeating Characters",
	difficulty:"Medium",
	category:"Sliding Window",
	problemStatement:`<p>Find longest substring without repeating characters.</p>`,
	examples:[{id:1,inputText:"abcabcbb",outputText:"3"}],
	constraints:`<li>0 ≤ s.length ≤ 10⁵</li>`,
	starterCode,
	handlerFunction: handler,
	starterFunctionName:"function lengthOfLongestSubstring(",
	order:17,
};
