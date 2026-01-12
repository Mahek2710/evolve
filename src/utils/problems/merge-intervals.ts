import assert from "assert";
import { Problem } from "../types/problem";

const starterCode = `function merge(intervals) {
  // Write your code here
};`;

const handler = (fn:any) => {
	try {
		const res = fn([[1,3],[2,6],[8,10],[15,18]]);
		assert.deepStrictEqual(res, [[1,6],[8,10],[15,18]]);
		return true;
	} catch(e:any) {
		throw new Error(e);
	}
};

export const mergeIntervals: Problem = {
	id: "merge-intervals",
	title: "Merge Intervals",
	difficulty: "Hard",
	category: "Intervals",
	problemStatement: `<p>Merge all overlapping intervals.</p>`,
	examples: [
		{ id: 1, inputText: "[[1,3],[2,6],[8,10],[15,18]]", outputText: "[[1,6],[8,10],[15,18]]" },
	],
	constraints: `<li>1 ≤ intervals.length ≤ 10⁴</li>`,
	starterCode,
	handlerFunction: handler,
	starterFunctionName: "function merge(",
	order: 10,
};
