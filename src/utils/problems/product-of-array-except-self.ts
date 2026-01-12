import assert from "assert";
import { Problem } from "../types/problem";

const starterCode = `function productExceptSelf(nums) {
  // Write your code here
};`;

const handler = (fn:any) => {
	try {
		assert.deepStrictEqual(fn([1,2,3,4]),[24,12,8,6]);
		return true;
	} catch(e:any){ throw new Error(e); }
};

export const productExceptSelf: Problem = {
	id:"product-of-array-except-self",
	title:"Product of Array Except Self",
	difficulty:"Medium",
	category:"Prefix Sum",
	problemStatement:`<p>Return array where each index has product except itself.</p>`,
	examples:[{id:1,inputText:"[1,2,3,4]",outputText:"[24,12,8,6]"}],
	constraints:`<li>No division</li>`,
	starterCode,
	handlerFunction: handler,
	starterFunctionName:"function productExceptSelf(",
	order:16,
};
