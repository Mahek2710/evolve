import assert from "assert";
import { Problem } from "../types/problem";

const starterCode = `function invertTree(root) {
  // Write your code here
};`;

const handler = (fn:any) => {
	try {
		const tree = {val:1,left:{val:2},right:{val:3}};
		const res = fn(tree);
		assert.strictEqual(res.left.val,3);
		return true;
	} catch(e:any){ throw new Error(e); }
};

export const invertBinaryTree: Problem = {
	id:"invert-binary-tree",
	title:"Invert Binary Tree",
	difficulty:"Easy",
	category:"Tree",
	problemStatement:`<p>Invert a binary tree.</p>`,
	examples:[{id:1,inputText:"[1,2,3]",outputText:"[1,3,2]"}],
	constraints:`<li>Number of nodes ≤ 100</li>`,
	starterCode,
	handlerFunction: handler,
	starterFunctionName:"function invertTree(",
	order:14,
};
