import assert from "assert";
import { Problem } from "../types/problem";

const starterCode = `function findMedianSortedArrays(nums1, nums2) {
  // Write your code here
};`;

const handler = (fn:any) => {
	try {
		assert.strictEqual(fn([1,3],[2]),2);
		return true;
	} catch(e:any){ throw new Error(e); }
};

export const medianSortedArrays: Problem = {
	id:"median-of-two-sorted-arrays",
	title:"Median of Two Sorted Arrays",
	difficulty:"Hard",
	category:"Binary Search",
	problemStatement:`<p>Find median of two sorted arrays.</p>`,
	examples:[{id:1,inputText:"[1,3],[2]",outputText:"2"}],
	constraints:`<li>O(log(m+n)) required</li>`,
	starterCode,
	handlerFunction: handler,
	starterFunctionName:"function findMedianSortedArrays(",
	order:20,
};
