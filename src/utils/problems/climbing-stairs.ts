import assert from "assert";
import { Problem } from "../types/problem";

const starterCode = `function climbStairs(n) {
  // Write your code here
};`;

const handler = (fn:any) => {
	try {
		assert.strictEqual(fn(2),2);
		assert.strictEqual(fn(3),3);
		return true;
	} catch(e:any){ throw new Error(e); }
};

export const climbingStairs: Problem = {
	id:"climbing-stairs",
	title:"Climbing Stairs",
	difficulty:"Easy",
	category:"Dynamic Programming",
	problemStatement:`<p>Count distinct ways to climb stairs.</p>`,
	examples:[{id:1,inputText:"n=3",outputText:"3"}],
	constraints:`<li>1 ≤ n ≤ 45</li>`,
	starterCode,
	handlerFunction: handler,
	starterFunctionName:"function climbStairs(",
	order:13,
};
