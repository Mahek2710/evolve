import assert from "assert";
import { Problem } from "../types/problem";

const starterCode = `function merge(nums1, m, nums2, n) {
  // Write your code here
};`;

const handler = (fn:any) => {
	try {
		const a=[1,2,3,0,0,0];
		fn(a,3,[2,5,6],3);
		assert.deepStrictEqual(a,[1,2,2,3,5,6]);
		return true;
	} catch(e:any){ throw new Error(e); }
};

export const mergeSortedArray: Problem = {
	id:"merge-sorted-array",
	title:"Merge Sorted Array",
	difficulty:"Easy",
	category:"Two Pointers",
	problemStatement:`<p>Merge two sorted arrays in-place.</p>`,
	examples:[{id:1,inputText:"nums1=[1,2,3,0,0,0]",outputText:"[1,2,2,3,5,6]"}],
	constraints:`<li>nums1.length = m+n</li>`,
	starterCode,
	handlerFunction: handler,
	starterFunctionName:"function merge(",
	order:12,
};
