import assert from "assert";
import { Problem } from "../types/problem";

const starterCode = `function numIslands(grid) {
  // Write your code here
};`;

const handler = (fn:any) => {
	try {
		const grid = [
			["1","1","0"],
			["1","0","0"],
			["0","0","1"]
		];
		assert.strictEqual(fn(grid),2);
		return true;
	} catch(e:any){ throw new Error(e); }
};

export const numberOfIslands: Problem = {
	id:"number-of-islands",
	title:"Number of Islands",
	difficulty:"Medium",
	category:"DFS / Graph",
	problemStatement:`<p>Count number of islands.</p>`,
	examples:[{id:1,inputText:"grid",outputText:"2"}],
	constraints:`<li>grid[i][j] is '0' or '1'</li>`,
	starterCode,
	handlerFunction: handler,
	starterFunctionName:"function numIslands(",
	order:18,
};
